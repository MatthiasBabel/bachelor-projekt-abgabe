pragma solidity ^0.5.0;

contract Energy {
    TokenBase public tokenBase;
    address[] public autorities;
    address public owner;
    uint public intervalLength = 60;
    mapping (uint => address[]) public auctions;
    mapping (address => Auction.Lights) public lights;
    event NewAuthority(address indexed _contributer, address indexed _new);
    event NewAuction(address _address, uint indexed _interval);

    modifier onlyAuthority {
        bool access;
        for(uint i = 0; i < autorities.length; i++){
            if(autorities[i] == msg.sender)
                access = true;
        }
        require(access, "No permission");
        _;
    }

    constructor() public {
        autorities.push(msg.sender);
        tokenBase = new TokenBase();
        owner = msg.sender;
    }

    function getAuctions(uint _interval) public view returns(address[] memory) {
      return auctions[_interval];
    }

    function isAuthority(address _sender) public view returns(bool auth) {
        for(uint i = 0; i < autorities.length; i++){
            if(autorities[i] == _sender)
                auth = true;
        }
    }

    function startAuction() public returns(address) {
        require(!isAuthority(msg.sender), "No permission");
        Auction tmp = new Auction(msg.sender, getNextInterval(), lights[msg.sender]);
        auctions[getNextInterval()].push(address(tmp));
        emit NewAuction(address(tmp), getNextInterval());
        return address(tmp);
    }

    function addAuthority(address _new) public onlyAuthority {
        autorities.push(_new);
        emit NewAuthority(msg.sender, _new);
    }

    function setLight(address _prosumer, Auction.Lights _light) onlyAuthority public {
        lights[_prosumer] = _light;
    }

    function getCurrentInterval() public view returns(uint) {
        return (now - (now % intervalLength));
    }

    function getNextInterval() public view returns(uint) {
        return (now - (now % intervalLength)) + intervalLength;
    }

}

contract Auction {
    address public creator;
    address public owner;
    address public highestBidder;
    uint public highestBid;
    uint public startTime;
    enum Lights {NOTRANKED, RED, YELLO, GREEN} Lights public light;
    TokenBase public tokenBase;
    event Bid(address indexed lastHighestBidder, uint indexed newHighestBid, address auction);

    constructor(address _owner, uint _startTime, Lights _light) public {
        creator = msg.sender;
        owner = _owner;
        startTime = _startTime;
        light = _light;
        tokenBase = Energy(msg.sender).tokenBase();
        emit Bid(address(0), 0, address(this));
    }

    function bid(address _bidder) external returns(bool) {
        require(address(tokenBase) == msg.sender, "No permission");
        require(!isElapsed(), "Its too late to bid");
        uint newBid = tokenBase.balanceOf(address(this)) - highestBid;
        //Es wird aufgezeichnet, wenn jemand ein zu niedriges Gebot setzt, oder auf seine eigene Auction bietet
        if(newBid <= highestBid || _bidder == owner) {
            tokenBase.transfer(_bidder, newBid);
            return false;
        }
        if(highestBidder != address(0))
            tokenBase.transfer(highestBidder, highestBid);
        emit Bid(highestBidder, newBid, address(this));
        highestBid = newBid;
        highestBidder = _bidder;
        return true;
    }

    function isElapsed() public view returns(bool) {
        if(startTime > now)
            return false;
        else
            return true;
    }

    function disburse() public returns(uint) {
        require(msg.sender == owner, "You are not the owner of this auction");
        require(isElapsed(), "You have to wait until the auction is over");
        tokenBase.transfer(owner, highestBid);
        return highestBid;
    }
}

contract TokenBase {
    string public constant NAME = "EnerChain Token";
    string public constant SYMBOL = "ECT";
    uint8 public constant DECIMALS = 0;
    uint256 public constant INITIAL_AMOUNT = 9000000000000000000000000000000;
    uint256 public tokenInWei = 1000000000000000;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) allowed;
    uint public totalSupply;
    event Transfer(address indexed _from, address indexed _to, uint indexed _value);
    event Approval(address indexed _owner, address indexed _to, uint256 _value);
    event Bid(address indexed lastHighestBidder, uint indexed newHighestBid, address auction);
    address public creator;

    constructor() public {
        totalSupply = INITIAL_AMOUNT;
        balances[address(this)] = INITIAL_AMOUNT;
        creator = msg.sender;
    }

    function bidOnAuction(address _auction, uint _value) public returns(bool) {
        require(!Energy(creator).isAuthority(msg.sender), "No permission");
        address lastHighestBidder = Auction(_auction).highestBidder();
        transfer(_auction, _value);
        if(Auction(_auction).bid(msg.sender)){
          emit Bid(lastHighestBidder, _value, _auction);
          return true;
        }
        return false;
    }

    function buy() public payable returns(uint amount) {
        require(!Energy(creator).isAuthority(msg.sender), "No permission");
        amount = (msg.value/tokenInWei);
        require(msg.value > amount, "Error");
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
        require(!Energy(creator).isAuthority(msg.sender), "No permission");
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
        require(!Energy(creator).isAuthority(msg.sender), "No permission");
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function getTokenInWei() public view returns(uint256){
        return tokenInWei;

    }

    function tokenLeft() public view returns (uint256) {
        return balances[address(this)];
    }

    function getWeiInTokenbase() public view returns(uint) {
        return address(this).balance;
    }

    function disburseEther() public returns(uint balance) {
        require(msg.sender == Energy(creator).owner(), "No permission");
        balance = address(this).balance;
        address(this).transfer(address(this).balance);
    }

    function() external payable{
    }
}
