pragma solidity ^0.4.24;

contract Energy{

    mapping (address => Auction.Lights) public lights;
    mapping (uint => Auction[]) auctions;
    mapping(address => mapping (uint => Auction[])) myAuctions;
    mapping (uint => mapping (address => uint)) numberOfBidsToSetInInterval;
    mapping (uint => mapping (address => uint)) numberOfOptionalBidsToSet;
    uint auctionInterval = 6000;
    address[] public authority;
    TokenBase tokenBase;

    constructor() public{
        authority.push(msg.sender);
        tokenBase = new TokenBase();
    }


    function startAuction() public{
        Auction tmp = new Auction(msg.sender, lights[msg.sender], getNextInterval(), address(tokenBase));
        auctions[getNextInterval()].push(tmp);
        myAuctions[msg.sender][getNextInterval()].push(tmp);
    }

    function getInterval() public view returns(uint){
        return auctionInterval;
    }

    //authoritymanagement
    function isAuthority(address _addr) public view returns(bool){
        for(uint i = 0; i < authority.length; i++){
            if(authority[i] == _addr)
                return true;
        }
        return false;
    }

    function addNewAuthority(address _addr) public{
        require(isAuthority(msg.sender));
        authority.push(_addr);
    }

    //Ampelsystem
    function setLight(address _producer, Auction.Lights _light) public{
        require(isAuthority(msg.sender), "You are not allowed to set Lights");
        lights[_producer] = _light;
    }

    function getLight(uint _interval,uint _number) public view returns(Auction.Lights){
        return auctions[_interval][_number].getLight();
    }

    function getLightOfProducer(address _from) public view returns(Auction.Lights){
        return lights[_from];
    }


    //auctionmanagement
    function getMyAuctionsFromInterval(uint _interval) public view returns(Auction[]){
        return myAuctions[msg.sender][_interval];
    }

    function getAuction(uint _interval, uint _number) public view returns(address){
        return auctions[_interval][_number];
    }

    function getAuctionsOfActualIntervall()public view returns(Auction[]){
        return auctions[now - (now % auctionInterval)];
    }

    function getAuctionsOfNextIntervall()public view returns(Auction[]){
        return auctions[now - (now % auctionInterval) + auctionInterval];
    }
/*
    function getAuctionOwner(uint _number, uint _interval) public view returns(address){
        require(_number < auctions[_interval].length);
        return auctions[_interval][_number].getOwner();
    }
*/
    function getOwner(uint _number, uint _interval) public view returns(address){
        require(_number < auctions[_interval].length);
        return auctions[_interval][_number].getOwner();
    }

    function getTokenFromAuction(uint _number, uint _interval) public view returns(uint){
        require(msg.sender == auctions[_interval][_number].getOwner(), "No permission");
        return auctions[_interval][_number].getTokenFromAuction();
    }

    //placing all bids in diffrent ways
    function autoPlaceBidForNextInterval() public{
        uint counter;
        while(numberOfBidsToSetInInterval[getNextInterval()][msg.sender] > 0 && counter <= auctions[getNextInterval()].length){
            uint timeInterval = getNextInterval();
            uint number = getCheapestAuctionInInterval(timeInterval);
            placeNewBid(auctions[timeInterval][number].getBid() + 1, number, timeInterval);
            counter++;
        }
    }

    function autoPlaceLightBidForNextInterval(Auction.Lights _light) public{
        uint counter;
        while(numberOfOptionalBidsToSet[getNextInterval()][msg.sender] > 0 &&  counter <= auctions[getNextInterval()].length){
            uint timeInterval = getNextInterval();
            int number = getCheapestLightsAuctionInInterval(timeInterval, _light);
            if(number >= 0)
                placeNewOptionalBid(auctions[timeInterval][uint(number)].getBid() + 1, uint(number), timeInterval);
            counter++;
        }
    }

    function autoPlaceMaxBidForNextInterval(int _maxBid) public{
        uint counter;
        while(numberOfOptionalBidsToSet[getNextInterval()][msg.sender] > 0 &&  counter <= auctions[getNextInterval()].length){
            uint timeInterval = getNextInterval();
            int number = getCheapestMaxAuctionInInterval(timeInterval, _maxBid);
            if(number >= 0)
                placeNewOptionalBid(auctions[timeInterval][uint(number)].getBid() + 1, uint(number), timeInterval);
            counter++;
        }
    }

    function autoPlaceMaxLightsBidForNextInterval(int _maxBid, Auction.Lights _light) public{
        uint counter;
        while(numberOfOptionalBidsToSet[getNextInterval()][msg.sender] > 0 &&  counter <= auctions[getNextInterval()].length){
            uint timeInterval = getNextInterval();
            int number = getCheapestMaxLightsAuctionInInterval(timeInterval, _maxBid, _light);
            if(number >= 0)
                placeNewOptionalBid(auctions[timeInterval][uint(number)].getBid() + 1, uint(number), timeInterval);
            counter++;
        }
    }

    //find cheapest auction
    function getCheapestAuctionInInterval(uint _interval) public view returns(uint auctionWithCheapestBidInInterval){
        int cheapestBid = int256(~((uint256(1) << 255)));
        auctionWithCheapestBidInInterval = 0;
        for(uint i = 0; i < auctions[_interval].length; i++){
            if(auctions[_interval][i].getBid() < cheapestBid && auctions[_interval][i].getHighestBidder() != msg.sender && auctions[_interval][i].getOwner() != msg.sender){
                cheapestBid = auctions[_interval][i].getBid();
                auctionWithCheapestBidInInterval = i;
            }
        }
    }

    function getCheapestLightsAuctionInInterval(uint _interval, Auction.Lights _light) public view returns(int auctionWithCheapestBidInInterval){
        int cheapestBid = int256(~((uint256(1) << 255)));
        auctionWithCheapestBidInInterval = -1;
        for(uint i = 0; i < auctions[_interval].length; i++){
            if(auctions[_interval][i].getBid() < cheapestBid && auctions[_interval][i].getHighestBidder() != msg.sender && uint8(auctions[_interval][i].getLight()) >= uint8(_light)  && auctions[_interval][i].getOwner() != msg.sender){
                cheapestBid = auctions[_interval][i].getBid();
                auctionWithCheapestBidInInterval = int(i);
            }
        }
    }

    function getCheapestMaxAuctionInInterval(uint _interval, int _maxBid) public view returns(int auctionWithCheapestBidInInterval){
        int cheapestBid = int256(~((uint256(1) << 255)));
        auctionWithCheapestBidInInterval = -1;
        for(uint i = 0; i < auctions[_interval].length; i++){
            if(auctions[_interval][i].getBid() < cheapestBid && auctions[_interval][i].getHighestBidder() != msg.sender && auctions[_interval][i].getBid() <= _maxBid  && auctions[_interval][i].getOwner() != msg.sender){
                cheapestBid = auctions[_interval][i].getBid();
                auctionWithCheapestBidInInterval = int(i);
            }
        }
    }

    function getCheapestMaxLightsAuctionInInterval(uint _interval, int _maxBid, Auction.Lights _light) public view returns(int auctionWithCheapestBidInInterval){
        int cheapestBid = int256(~((uint256(1) << 255)));
        auctionWithCheapestBidInInterval = -1;
        for(uint i = 0; i < auctions[_interval].length; i++){
            if(auctions[_interval][i].getBid() < cheapestBid && auctions[_interval][i].getHighestBidder() != msg.sender && auctions[_interval][i].getBid() <= _maxBid &&  uint8(auctions[_interval][i].getLight()) >= uint8(_light) && auctions[_interval][i].getOwner() != msg.sender){
                cheapestBid = auctions[_interval][i].getBid();
                auctionWithCheapestBidInInterval = int(i);
            }
        }
    }

    //bids
    function getBid(uint _number, uint _interval) public view returns(int){
        require(_number < auctions[_interval].length);
        return auctions[_interval][_number].getBid();
    }

    function getHighestBidder(uint _number, uint _interval) public view returns(address){
        require(_number < auctions[_interval].length);
        return auctions[_interval][_number].getHighestBidder();
    }

    function placeNewBid(int _bid, uint _number, uint _interval) public returns (bool){
        require(_number < auctions[_interval].length);
        require(numberOfBidsToSetInInterval[_interval][msg.sender] >= 1, "You have all your bids already set");
        //TODO:
        if(_bid > 0)
            require(tokenBase.balanceOf(msg.sender) >= uint(_bid), "You dont have enough Token");
        if(tokenBase.placeNewBid(msg.sender, auctions[_interval][_number], uint(_bid))){
            numberOfBidsToSetInInterval[_interval][msg.sender]--;
            auctions[_interval][_number].placeNewBid(msg.sender, _bid);
            return true;
        }
    }

    function placeNewOptionalBid(int _bid, uint _number, uint _interval) public returns (bool){
        require(_number < auctions[_interval].length);
        require(numberOfOptionalBidsToSet[getNextInterval()][msg.sender] >= 1, "You have all your bids already set");
        if(_bid > 0)
            require(tokenBase.balanceOf(msg.sender) >= uint(_bid), "You dont have enough Token");
        numberOfOptionalBidsToSet[_interval][msg.sender]--;
        auctions[_interval][_number].placeNewBid(msg.sender, _bid);
        return true;
    }

    //numbers of bids
    function getNumberOfOptionalBidsToSet(address _from) public view returns(uint){
        return numberOfOptionalBidsToSet[getNextInterval()][_from];
    }

    function getNumberOfMyBidsToSetInNextInterval() public view returns(uint){
        return numberOfBidsToSetInInterval[getNextInterval()][msg.sender];
    }

    function setNumbersOfBidsToSetInNextInterval(uint _number) public{
        require(numberOfBidsToSetInInterval[getNextInterval()][msg.sender] == 0, "You already set your number of bids");
        numberOfBidsToSetInInterval[getNextInterval()][msg.sender] = _number;
    }

    function setNumbersOfOptionalBidsToSet(uint _number) public{
        require(numberOfOptionalBidsToSet[getNextInterval()][msg.sender] == 0, "You already set your number of bids");
        numberOfOptionalBidsToSet[getNextInterval()][msg.sender] = _number;
    }

    function incrementNumberOfBidsSet(uint _interval, address _of) public returns(uint){
        numberOfBidsToSetInInterval[_interval][_of]++;
        return numberOfBidsToSetInInterval[_interval][_of];
    }

    function decrementNumberOfBidsSet(uint _interval, address _of) public returns(uint){
        numberOfBidsToSetInInterval[_interval][_of]--;
        return numberOfBidsToSetInInterval[_interval][_of];
    }

    //interval

    function getCurrentInterval() public view returns(uint){
        return (now - (now % auctionInterval));
    }

    function getNextInterval() public view returns(uint){
        return (now - (now % auctionInterval) + auctionInterval);
    }

    //token
    function getTokenBase() public view returns(TokenBase){
        return tokenBase;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return tokenBase.balanceOf(_owner);
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        return tokenBase.transfer(_to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        return tokenBase.transferFrom(_from, _to, _value);
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        return tokenBase.approve(_spender, _value);
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return tokenBase.allowance(_owner, _spender);
    }

    function setTokenInWei(uint256 _value) public {
        require(isAuthority(msg.sender), "No permission");
        tokenBase.setTokenInWei(_value);
    }

    function getTokenInWei() public view returns(uint256){
        return tokenBase.tokenInWei();
    }

    function buy() payable public {
        uint256 amount = msg.value/tokenBase.getTokenInWei();
        uint256 rest = msg.value - amount * tokenBase.getTokenInWei();

        if(rest != 0) {
            msg.sender.transfer(rest);
        }

        tokenBase.privateBuy(msg.sender, amount);

        sendWeiToTokenbase(msg.value);
    }


    function sendWeiToTokenbase(uint _value) private{
        address(tokenBase).transfer(_value);
    }

    function getWeiInEnergy() public view returns(uint){
        return address(this).balance;
    }


    function getAmountOfWeiFromContract() public view returns (uint256){
        return tokenBase.getAmountOfWeiFromContract();
    }

    function tokenLeft() public view returns (uint256){
        return tokenBase.getAmountOfWeiFromContract();
    }

    function getEthFromAuction(address _auction) public{

    }

    function getWeiInTokenbase() public view returns(uint){
        return tokenBase.getWeiInTokenbase();
    }
}

contract Auction{
    address owner;
    address highestBidder;
    Energy home;
    int bid;
    int lastHighestBid;
    enum Lights {NOTRANKED, RED, YELLOW, GREEN} Lights light;
    address lastHighestBidder;
    uint interval;
    TokenBase tokenBase;


    event Bid(address indexed _bidder, int _bid, uint _interval, address indexed  _auctionAddress, address indexed _lastHighestBidder);

    constructor(address _owner, Lights _color, uint _interval, address _tokenBase) public{
        home = Energy(msg.sender);
        owner = _owner;
        bid = 0;
        light = _color;
        interval = _interval;
        tokenBase = TokenBase(_tokenBase);
    }

    function placeNewBid(address _bidder, int _bid) public returns (bool){
        require(_bid >= bid, "Bid is too low");
        require((interval + home.getInterval()) > now, "It´s too late to set your bid");
        require(_bidder != owner, "You cannot bid on your own Auction");

        lastHighestBidder = highestBidder;

        home.incrementNumberOfBidsSet(home.getNextInterval(),lastHighestBidder);

        lastHighestBid = bid;
        highestBidder = _bidder;
        bid = _bid;

        if(lastHighestBidder != 0)
            tokenBase.transfer(lastHighestBidder, uint(lastHighestBid));

        emit Bid(_bidder, _bid, interval, address(this), lastHighestBidder);
        return true;
    }

    function getOwner() public view returns(address){
        return owner;
    }

    function getBid() public view returns(int){
        return bid;
    }

    function getHighestBidder() public view returns(address){
        return highestBidder;
    }


    function getLight() public view returns(Lights){
        return light;
    }

    function getInterval() public view returns(uint){
        return interval;
    }

    function getTokenFromAuction() public returns(uint){
      require(interval < now, "Auction not over");
      require(msg.sender == address(home), "No permission");
      if(bid > 0)
          tokenBase.transfer(owner, tokenBase.balanceOf(this));
    }

    function () public payable {
        revert();
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

    string public constant NAME = "EnerChain Token";

    string public constant SYMBOL = "ECT";

    uint8 public constant DECIMALS = 2;

    uint256 public constant INITIAL_AMOUNT = 100000000000;

    uint256 public tokenInWei = 100;

    mapping (address => uint256) public balances;

    mapping (address => mapping (address => uint256)) allowed;

    Energy home;

    constructor() public {
        totalSupply = INITIAL_AMOUNT;
        balances[address(this)] = INITIAL_AMOUNT;
        home = Energy(msg.sender);
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
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

     function setTokenInWei(uint256 _value) public {
        require(home.isAuthority(msg.sender));
        tokenInWei = _value;
    }

    function getTokenInWei() public view returns(uint256){
        return tokenInWei;
    }

    function privateBuy(address _addr, uint _value) payable public {
        require(_value <= balances[address(this)], "There are not that much Token left");
        require(msg.sender == address(home));

        balances[address(this)] -= _value;

        balances[_addr] += _value;
        emit Transfer(address(this), _addr, _value);
    }

    function buy(address _addr) payable public {
        uint256 amount = msg.value/tokenInWei;
        uint256 rest = msg.value - amount * tokenInWei;

        require(amount <= balances[address(this)], "There are not that much Token left");

        if(rest != 0) {
            msg.sender.transfer(rest);
        }

        balances[address(this)] -= amount;

        balances[_addr] += amount;
        emit Transfer(address(this), _addr, amount);
    }

    function getAmountOfWeiFromContract() public view returns (uint256){
        return address(this).balance;
    }

    function tokenLeft() public view returns (uint256){
        return balances[address(this)];
    }

    function placeNewBid(address _from, address _auction, uint _bid) public returns(bool){
        require(msg.sender == address(home));
        balances[_from] -= _bid;
        balances[_auction] += _bid;
        return true;
    }

    function getWeiInTokenbase() public view returns(uint){
        return address(this).balance;
    }

    function() public payable{
    }
}
