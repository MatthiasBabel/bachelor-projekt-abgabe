pragma solidity ^0.5.0;

//Sowas wie service provided reinbringen

contract VirtualBattery {
    address public provider;
    TokenBase public tokenBase;
    Storage[] public storages;
    mapping(address => address) public personalStorage;
    uint public intervalLength = 30;
    uint public capacityInToken = 1;
    event ChangeCapacity(address indexed _address, uint _capacity);
    modifier onlyOwner() {
        require(msg.sender == provider, "No permission");
        _;
    }
    constructor() public {
        provider = msg.sender;
        tokenBase = new TokenBase();
    }
    //Bindet Batterie an virtuelle Batterie an, Jede von hier aus gespawnte Entitaet kann nur von dem hier vorhanden Provider bedient werden
    function newStorage(uint _x, uint _y, uint _capacity) public returns(address) {
        require(personalStorage[msg.sender] == address(0));
        Storage tmp = new Storage(msg.sender, _x, _y, _capacity);
        storages.push(tmp);
        personalStorage[msg.sender] = address(tmp);
        emit ChangeCapacity(address(tmp), _capacity);
        return address(tmp);
    }
    //Kosten pro genutzter Kapazitaet
    function setCapacityInToken(uint _value) public onlyOwner returns(bool) {
        capacityInToken = _value;
        return true;
    }
    function getStorageArray() public view returns(Storage[] memory) {
      return storages;
    }
    //Intervall
    function getCurrentInterval() public view returns(uint) {
        return (now - (now % intervalLength));
    }

    function getNextInterval() public view returns(uint) {
        return (now - (now % intervalLength)) + intervalLength;
    }

    function getStorages() public view returns(Storage[] memory) {
        return storages;
    }

    function setCapacity(uint  _value) public returns(bool){
        require(personalStorage[msg.sender] != address(0), "There is no Storage");
        emit ChangeCapacity(personalStorage[msg.sender], _value);
        return Storage(personalStorage[msg.sender]).setCapacity(_value);
    }

}

contract Storage {
    address public creator;
    address public owner;
    address public provider;
    uint public capacity;
    uint public futureIntervals = 3;
    TokenBase tokenBase;
    mapping(uint => uint) public usedCapacityInInterval;
    struct Coordinates {
        uint x;
        uint y;
    }
    Coordinates public coordinates;
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner" );
        _;
    }

    constructor(address _owner, uint _x, uint _y, uint _capacity) public {
        creator = msg.sender;
        owner = _owner;
        coordinates.x = _x;
        coordinates.y = _y;
        capacity = _capacity;
        provider = VirtualBattery(msg.sender).provider();
        tokenBase = VirtualBattery(msg.sender).tokenBase();
    }

    function useCapacityInInterval(uint _interval, uint _capacity) public returns(uint left){
        require(_interval >= now, "It's too late");
        require(capacityLeft(_interval) >= _capacity, "No capacity left!");
        require(msg.sender == address(tokenBase), "Not tokenBase");
        //Verhindert, dass zu weit in der Zukunft die Kapazitaet gebucht wird, damit Benutzer Herr ueber seine Batterie bleibt
        require((VirtualBattery(creator).getCurrentInterval() + VirtualBattery(creator).intervalLength() * futureIntervals) >= _interval, "It's too early");
        require((_interval % VirtualBattery(creator).intervalLength()) == 0, "No permissible interval");
        usedCapacityInInterval[_interval] += _capacity;
        return capacity - usedCapacityInInterval[_interval];
    }

    function setCapacity(uint _value) public returns(bool) {
        require(msg.sender == creator, "No permission");
        capacity = _value;
        return true;
    }

    function disburse() public onlyOwner returns(uint value) {
        value = tokenBase.balanceOf(address(this));
        tokenBase.transfer(owner, value);
    }

    function capacityLeft(uint _interval) public view returns(uint) {
        if(capacity <=  usedCapacityInInterval[_interval])
            return 0;
        return capacity - usedCapacityInInterval[_interval];
    }



}

contract TokenBase {
    string public constant NAME = "EnerChain Token";
    string public constant SYMBOL = "ECT";
    uint8 public constant DECIMALS = 0;
    uint256 public constant INITIAL_AMOUNT = 9000000000000000000000000000000;
    uint256 constant public tokenInWei = 1000000000000000;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) allowed;
    uint public totalSupply;
    event Transfer(address indexed _from, address indexed _to, uint indexed _value);
    event Approval(address indexed _owner, address indexed _to, uint256 _value);
    address public creator;

    constructor() public {
        totalSupply = INITIAL_AMOUNT;
        balances[address(this)] = INITIAL_AMOUNT;
        creator = msg.sender;
    }

    function findCapacity(uint _x, uint _y, uint _interval, uint _value) public returns(uint valueLeft){
        Storage best;
        uint shortest = uint(int(-1));
        valueLeft = _value;
        Storage[] memory storages = VirtualBattery(creator).getStorages();
        for(uint i = 0; i < storages.length; i++) {
            if(storages[i].capacityLeft(_interval) > 0) {
                uint x = 0;
                uint y = 0;
                uint len = 0;
                (x, y) = storages[i].coordinates();
                //Abs
                if(_x > x)
                    len = _x - x;
                else
                    len = x - _x;
                if(_y > y)
                    len += _y - y;
                else
                    len += y - _y;
                if(len < shortest){
                    shortest = len;
                    best = storages[i];
                }
            }
        }
        if(address(best) != address(0)){
            if(best.capacityLeft(_interval) >= valueLeft) {
               useCapacity(address(best), _interval, valueLeft);
             valueLeft = 0;
            }
            else {
                uint capacity = best.capacityLeft(_interval);
                useCapacity(address(best), _interval, capacity);
                valueLeft -= capacity;
                findCapacity(_x, _y, _interval, valueLeft);
            }
        }
    }
    //Sicherung der Kapazitaet in einem Intervall
    function useCapacity(address _storage, uint _interval, uint _value) internal returns(uint capacityLeft) {
        uint cost = VirtualBattery(creator).capacityInToken() * _value;
        require(balances[msg.sender] >= cost, "Not enough token");
        require(msg.sender == VirtualBattery(creator).provider(), "Not provider");
        capacityLeft = Storage(_storage).useCapacityInInterval(_interval, _value);
        transfer(_storage, cost);

    }

    //Token kaufen
    function buy() public payable returns(uint amount) {
        amount = (msg.value/tokenInWei);
        uint256 rest = msg.value - (amount * tokenInWei);
        if(rest != 0) {
            msg.sender.transfer(rest);
        }
        this.transfer(msg.sender, amount);
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value, "Sender has not enough Token");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][_to];
        require(balances[_from] >= _value, "Sender has not enough Token");
        require(allowance >= _value, "There is no allowance for this value");
        balances[_to] += _value;
        balances[_from] -= _value;
        allowed[_from][_to] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function getTokenInWei() public pure returns(uint256){
        return tokenInWei;
    }

    function tokenLeft() public view returns (uint256) {
        return balances[address(this)];
    }

    function disburseEther(uint _amount) public returns(uint value) {
        require(_amount <= balances[msg.sender]);
        value = _amount * tokenInWei;
        transfer(address(this), _amount);
        address(msg.sender).transfer(value);
    }

    function() external payable{
    }
}
