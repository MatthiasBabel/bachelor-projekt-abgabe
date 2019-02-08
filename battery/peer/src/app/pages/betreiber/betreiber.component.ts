import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const Web3 = require("web3");
const contract = require("truffle-contract");

@Component({
  selector: 'app-betreiber',
  templateUrl: './betreiber.component.html',
  styleUrls: ['./betreiber.component.css']
})
export class BetreiberComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }
  etherBalance: any;
  color = 'primary';
  mode = 'determinate';
  value: number;
  bufferValue: number;
  maxCapa: number;
  acc: any;
  balance: any;
  capacityRequest: number;
  web3: any;
  Storage: any;
  TokenBase: any;
  VirtualBattery: any;
  contractTokenBaseAddress: any;
  accs;
  tokenInWei: number;
  contractsArtifacts: any;
  tokenBalance: any;
  amountOfWei: any;
  to: any;
  amount: number;
  amountOfToken: number;
  capaEvent: any;
  VirtualBatteryTruffle: any;
  availableCapacity: number;
  usedCapacityCurrent: number;
  intervalLength: number;
  location = {
    x: 1,
    y: 1
  }
  time: any;
  nextInterval: any;
  nextIntervalHuman: any;
  usedCapacityNext: number;
  endNextIntervalHuman: number;
  currentIntervalHuman: any;
  endCurrentIntervalHuman: any;
  capacityInToken: any;
  valueNext = 0;
  valueCurrent = 0;
  contractStorageABI = [ { "constant": true, "inputs": [], "name": "creator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "provider", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_interval", "type": "uint256" } ], "name": "capacityLeft", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "capacity", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_interval", "type": "uint256" }, { "name": "_capacity", "type": "uint256" } ], "name": "useCapacityInInterval", "outputs": [ { "name": "left", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "setCapacity", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "coordinates", "outputs": [ { "name": "x", "type": "uint256" }, { "name": "y", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "disburse", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "futureIntervals", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "usedCapacityInInterval", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_x", "type": "uint256" }, { "name": "_y", "type": "uint256" }, { "name": "_capacity", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ];
  contractTokenBaseABI = [ { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "buy", "outputs": [ { "name": "amount", "type": "uint256" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_amount", "type": "uint256" } ], "name": "disburseEther", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_x", "type": "uint256" }, { "name": "_y", "type": "uint256" }, { "name": "_interval", "type": "uint256" }, { "name": "_value", "type": "uint256" } ], "name": "findCapacity", "outputs": [ { "name": "valueLeft", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": true, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "remaining", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balances", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "creator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "DECIMALS", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTokenInWei", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_AMOUNT", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "NAME", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "SYMBOL", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenInWei", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenLeft", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

  ngOnInit() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
    );
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        Error('There was an error fetching your accounts.')
      }
      if (accs.length === 0) {
        Error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
      }
      this.accs = accs;
      this.acc = accs[0];
      this.getEtherBalance();
    });
    this.http.get('http://localhost:8080/contract').subscribe((res) => {
        this.contractsArtifacts = res;
        this.VirtualBatteryTruffle = contract(this.contractsArtifacts);
        this.VirtualBatteryTruffle.setProvider(this.web3.currentProvider);
        this.VirtualBatteryTruffle
          .deployed()
          .then(inst => {
            this.VirtualBattery = inst;
            this.capaEvent = inst.ChangeCapacity();
            inst.capacityInToken().then(res => {
              console.log(res);
              this.capacityInToken = res.toNumber();
            });
            this.capaEvent.watch((err, res) => {
              if(!err)
                this.getAvailableCapacity();
              else
                console.log(err);
            });
            return inst.tokenBase.call({from: this.acc, gas: 3000000});
          }).then(res => {
            this.contractTokenBaseAddress = res;
            this.TokenBase = this.web3.eth.contract(this.contractTokenBaseABI).at(this.contractTokenBaseAddress);
            this.TokenBase.tokenInWei({from: this.acc, gas: 3000000}, (err, res) => {
              this.tokenInWei = res.toNumber();
              this.getTokenBalance();
              this.getTimeAndInterval();
              this.getAvailableCapacity();
            });
          });
    });
  }

  getTokenBalance() {
    this.TokenBase.balanceOf(this.acc, {from: this.acc, gas: 3000000}, (err, res) => {
      this.tokenBalance = res.toNumber();
    });
  }
  getEtherBalance() {
    this.web3.eth.getBalance(this.acc, (err, balance) => {
      this.etherBalance = balance.toNumber();
    });
  }

  getToken(){
    this.TokenBase.buy({from: this.acc, gas: 3000000, value: this.amountOfWei}, (err, res) => {
      if(err != undefined) {
        alert("Nicht erfolgreich! \n Transaktionshash: " + err);
      }
      else {
        alert("Erfolgreich! \nTransaktionshash: " + res);
        this.getTokenBalance();
        this.getEtherBalance();
      }
    });
  }

  transfer() {
    this.TokenBase.transfer(this.to, this.amount, {from: this.acc, gas: 3000000}, (err, res) => {
      if(err != undefined) {
        alert("Nicht erfolgreich! \n Transaktionshash: " + err);
      }
      else {
        alert("Erfolgreich! \nTransaktionshash: " + res);
        this.getTokenBalance();
      }
    });
  }

  getEther() {
    this.TokenBase.disburseEther.call(this.amountOfToken, {from: this.acc, gas: 3000000}, (err, res) => {
      if(err != undefined) {
        alert("Nicht erfolgreich! \n Transaktionshash: " + err);
      }
      else {
        alert("Erfolgreich! \nSie haben im Austausch gegen " + this.amountOfToken + " Token " + res + " Wei erhalten.");
      }
    });
    this.TokenBase.disburseEther(this.amountOfToken, {from: this.acc, gas: 3000000}, (err, res) => {});
    this.getTokenBalance();
    this.getEtherBalance();
  }



  getAvailableCapacity() {
    this.availableCapacity = 0;
    this.VirtualBattery.getStorageArray({from: this.acc, gas: 3000000}).then(storages => {
      for(var i = 0; i < storages.length; i++) {
        this.Storage = this.Storage = this.web3.eth.contract(this.contractStorageABI).at(storages[i]);
        this.Storage.capacity((err, res) => {
          this.availableCapacity += res.toNumber();
          this.valueNext = (this.usedCapacityNext/this.availableCapacity) * 100;
          this.valueCurrent = (this.usedCapacityCurrent/this.availableCapacity) * 100;
        });
      }
    });
  }

  getUsedCapacity() {
    this.usedCapacityCurrent = 0;
    this.usedCapacityNext = 0;
    this.VirtualBattery.getStorageArray({from: this.acc, gas: 3000000}).then(storages => {
      for(var i = 0; i < storages.length; i++) {
        this.Storage = this.Storage = this.web3.eth.contract(this.contractStorageABI).at(storages[i]);
        this.Storage.usedCapacityInInterval(this.nextInterval-this.intervalLength, (err, res) => {
          this.usedCapacityCurrent += res.toNumber();
          this.valueCurrent = (this.usedCapacityCurrent/this.availableCapacity) * 100;
        });
        this.Storage.usedCapacityInInterval(this.nextInterval, (err, res) => {
          this.usedCapacityNext += res.toNumber();
          this.valueNext = (this.usedCapacityNext/this.availableCapacity) * 100;
        });
      }
    });
  }

  getUsedCapacityLoop() {
    this.getUsedCapacity();
    console.log(this.intervalLength);
    setTimeout(() => {this.getUsedCapacityLoop()}, this.intervalLength * 1000);
  }

  request() {
    this.VirtualBattery.getNextInterval.call().then(interval => {
        this.TokenBase.findCapacity(this.location.x, this.location.y, interval, this.capacityRequest, {from: this.acc, gas: 3000000}, (err, res) => {
            this.getTokenBalance();
            this.getUsedCapacity();
        });
    });
  }


  getTimeAndInterval() {
    this.time = fromUnixToHuman(new Date());
    this.VirtualBattery.getNextInterval().then(res => {
      if(this.nextInterval != res.toNumber())
        this.getUsedCapacity();
      this.nextInterval = res.toNumber();
      this.nextIntervalHuman = fromUnixToHuman(new Date(res*1000));
      this.VirtualBattery.intervalLength().then(interval => {
        this.intervalLength = interval.toNumber();
        this.endNextIntervalHuman = fromUnixToHuman(new Date((this.nextInterval + this.intervalLength-1) * 1000 ));
        this.currentIntervalHuman = fromUnixToHuman(new Date((this.nextInterval - this.intervalLength) * 1000 ));
        this.endCurrentIntervalHuman = fromUnixToHuman(new Date((this.nextInterval -1) * 1000 ));

      });
    });
    setTimeout(() => {this.getTimeAndInterval()}, 1000);

    function fromUnixToHuman(date: any): any {
      var hours = date.getHours();
      // Minutes part from the timestamp
      var minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      var seconds = "0" + date.getSeconds();
      return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }

  }
  /*getMaxCapa(): any{
    this.contractService.getMaxCapa().then(res => {
      console.log(res);
      this.maxCapa = res;

      this.value = (this.kapaAnforderung/this.maxCapa)*100;

      setTimeout(this.getMaxCapa(), 100);
    });
  }
*/

}
