pragma solidity ^0.4.24;

contract Home {
    uint interval = 10;
    address owner;
    address[] prosumerAddress;
    Storage[] public storages;
    mapping(address => Prosumer) prosumer;
    mapping(uint => mapping(uint => Storage)) public storageGrid;
    TokenBase tokenBase;
    uint tokenForOneCapacity = 1;
    uint pauschale = 10;

    bool on = false;

    constructor() public {
        owner = msg.sender;
        tokenBase = new TokenBase();
    }

    function getCapaOfMyStorage(uint _stNbr) public view returns(uint){
        return prosumer[msg.sender].getStorages()[_stNbr].getUnusedCapaInNextInterval();
    }

    function getNbrOfClaims() public view returns(uint){
         return prosumer[msg.sender].getStorages()[0].getNbrOfClaims();
    }

    function getPauschale() public view returns(uint){
        return pauschale;
    }

    function getUnusedCapaInNextInterval() public view returns(uint value){
        for(uint i = 0; i < storages.length; i++){
            value += storages[i].getUnusedCapaInNextInterval();
        }
    }

    function setPauschale(uint _value) public {
        pauschale = _value;
    }

    function getTokenForOneCapacity() public view returns (uint){
        return tokenForOneCapacity;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return tokenBase.balanceOf(_owner);
    }

    function claim() public {
        require(prosumer[msg.sender].getStorages().length > 0);
        for(uint i = 0; i <  prosumer[msg.sender].getStorages().length; i++){
            tokenBase.giveTokenFromTo(msg.sender, prosumer[msg.sender].getStorages()[i].claim());
            prosumer[msg.sender].getStorages()[i].setLastClaimedToNow();
        }
    }

    //setter
    function useCapaInNextIntervalFromXY(uint _x, uint _y, uint _value) public returns(uint capaLeft) {
        return storageGrid[_x][_y].useCapaInNextInterval(_value);
    }

    function getMaxCapa() public view returns(uint maxCapa) {
        for(uint i = 0; i < storages.length; i++){
            maxCapa += storages[i].getCapa();
        }
    }

    function changeCapa(uint _stNbr, uint _capa) public {
        prosumer[msg.sender].getStorages()[_stNbr].changeCapa(_capa);
    }

    function getMyStorages() public view returns(Storage[]) {
        return prosumer[msg.sender].getStorages();
    }

    function getInterval() public view returns(uint){
        return interval;
    }

    function setMyStorageOffline(uint _stNbr) public {
        prosumer[msg.sender].getStorages()[_stNbr].setOffline();
    }

    function setMyStorageOnline(uint _stNbr) public {
        prosumer[msg.sender].getStorages()[_stNbr].setOnline();
    }

    function useCapaInNextIntervalForXY(uint _x, uint _y, uint _value) public returns(uint valueLeft){
        uint index = 0;
        uint shortest = uint(int(-1));
        valueLeft = _value;
        for(uint i = 0; i < storages.length; i++){
            if(storages[i].getUnusedCapaInNextInterval() > 0){
                uint x = 0;
                uint y = 0;
                uint len = 0;
                (x, y) = storages[i].getXY();
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
                    index = i;
                }
            }
        }
        uint space = storages[index].getUnusedCapaInNextInterval();
        if(space >= valueLeft){
            storages[index].useCapaInNextInterval(valueLeft);
            valueLeft = 0;
        }
        else {
            storages[index].useCapaInNextInterval(space);
            valueLeft -= space;
            useCapaInNextIntervalForXY(_x, _y, valueLeft);
        }

    }

    //New

    function newProsumer() public {
        prosumer[msg.sender] = new Prosumer(msg.sender);
        prosumerAddress.push(msg.sender);
    }

    function addNewStorage(uint _x, uint _y, uint _capacity) public {
        Storage newStorage = new Storage(msg.sender, _x, _y, _capacity);
        storages.push(newStorage);
        storageGrid[_x][_y] = newStorage;
        prosumer[msg.sender].addNewStorage(address(newStorage));
    }

    // Intervall

    function getActualInterval() public view returns(uint) {
        return now - (now % interval);
    }

    function getNextInterval() public view returns(uint) {
        return now - (now % interval) + interval;
    }

    //Getter
    function getStorageFromXY(uint _x, uint _y) public view returns(Storage) {
        return storageGrid[_x][_y];
    }

    function getUnusedCapaInNextInterval(uint _x, uint _y) public view returns(uint) {
        return storageGrid[_x][_y].getUnusedCapaInNextInterval();
    }

    function getMyUnusedCapaInNextInterval(uint _x) public view returns(uint){
      prosumer[msg.sender].getStorages()[_x].getUnusedCapaInNextInterval();
    }



}

contract Prosumer {
    Home home;
    address owner;
    Storage[] storages;


    constructor(address _owner) public{
        home = Home(msg.sender);
        owner = _owner;
    }

    function addNewStorage(address _storage) public {
        require(msg.sender == address(home), "No permission");
        storages.push(Storage(_storage));
    }

    function getStorages() public view returns (Storage[]){
        return storages;
    }

}

contract Storage {
    Home home;
    uint x;
    uint y;
    Prosumer owner;
    uint maxCapa;
    uint capa;
    mapping(uint => uint) usedCapaInInterval;
    uint lastClaimed;

    struct Coordinates{
        uint x;
        uint y;
    }

    Coordinates coordinates;


    constructor(address _owner, uint _x, uint _y, uint _capa) public{
        owner = Prosumer(_owner);
        capa = _capa;
        home = Home(msg.sender);
        coordinates.x = _x;
        coordinates.y = _y;
        maxCapa = _capa;
        lastClaimed = now;
    }

    function setOffline() public {
        capa = 0;
    }

    function setOnline() public {
        capa = maxCapa;
    }

    function changeCapa(uint _capa) public{
        capa = _capa;
        maxCapa = _capa;
    }

    function changeXY(uint _x, uint _y) public{
        coordinates.x = _x;
        coordinates.y = _y;
    }

    function getXY() public view returns(uint, uint) {
        return (coordinates.x, coordinates.y);
    }

    function getCapa() public view returns(uint){
        return capa;
    }

    function useCapaInNextInterval(uint _value) public returns(uint _free){
        require(msg.sender == address(home), "No permission");
        require(usedCapaInInterval[home.getNextInterval()] + _value <= capa, "No capacity left");
        usedCapaInInterval[home.getNextInterval()] += _value;
        return usedCapaInInterval[home.getNextInterval()];
    }

    function getUnusedCapaInNextInterval() public view returns(uint _free) {
        return capa - usedCapaInInterval[home.getNextInterval()];
    }

    function setLastClaimedToNow() public{
        lastClaimed = home.getActualInterval();
    }

    function getNbrOfClaims() public view returns(uint value) {
        value = (now - lastClaimed) / home.getInterval();
    }

    function claim() public view returns(uint value){
        uint interval = home.getInterval();
        uint notClaimedIntervals = (now - lastClaimed) / interval;
        for(uint i = 0; i < notClaimedIntervals; i++) {
            value += usedCapaInInterval[lastClaimed + notClaimedIntervals * interval] * home.getTokenForOneCapacity();
            value += home.getPauschale();
        }

    }
}

contract ERC20Interface {

    uint256 public totalSupply;

    function balanceOf(address _owner) public view returns (uint256 balance);

    function transfer(address _to, uint256 _value) public returns (bool success);

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);

    function approve(address _spender, uint256 _value) public returns (bool success);

    function allowance(address _owner, address _spender) public view returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

}


contract TokenBase is ERC20Interface {

    string public constant NAME = "BatterChain";

    string public constant SYMBOL = "BAC";

    uint256 public constant INITIAL_AMOUNT = 100000;

    address public owner;

    mapping (address => uint256) public balances;

    mapping (address => mapping (address => uint256)) allowed;

    constructor() public {
        totalSupply = INITIAL_AMOUNT;
        balances[msg.sender] = INITIAL_AMOUNT;
        owner = msg.sender;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function giveTokenFromTo(address _to, uint _value) public{
        require(msg.sender == owner, "No permission!");
        balances[owner] -= _value;
        balances[_to] += _value;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {

        require(balances[msg.sender] >= _value, "Sender has not enought Token");

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][_to];
        require(balances[_from] >= _value, "Sender has not enought Token");
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

    function addToken(uint _value) public {
        require(owner == msg.sender, "No Access!");
        totalSupply +=  _value;
        balances[owner] += _value;
    }
}
