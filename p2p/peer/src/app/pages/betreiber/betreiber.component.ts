import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const Web3 = require("web3");
const contract = require("truffle-contract");

export interface Light {
  value: any;
  viewValue: any;
}

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
  Energy: any;
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
  EnergyTruffle: any;
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
  addressProducer: any;
  lightProducer: any;
  addressAuthority: any;
  contractStorageABI = [ { "constant": true, "inputs": [], "name": "creator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "provider", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_interval", "type": "uint256" } ], "name": "capacityLeft", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "capacity", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_interval", "type": "uint256" }, { "name": "_capacity", "type": "uint256" } ], "name": "useCapacityInInterval", "outputs": [ { "name": "left", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "setCapacity", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "coordinates", "outputs": [ { "name": "x", "type": "uint256" }, { "name": "y", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "disburse", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "futureIntervals", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "usedCapacityInInterval", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_x", "type": "uint256" }, { "name": "_y", "type": "uint256" }, { "name": "_capacity", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ];
  contractTokenBaseABI = [ { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "buy", "outputs": [ { "name": "amount", "type": "uint256" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_amount", "type": "uint256" } ], "name": "disburseEther", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_x", "type": "uint256" }, { "name": "_y", "type": "uint256" }, { "name": "_interval", "type": "uint256" }, { "name": "_value", "type": "uint256" } ], "name": "findCapacity", "outputs": [ { "name": "valueLeft", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": true, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "remaining", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balances", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "creator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "DECIMALS", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTokenInWei", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_AMOUNT", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "NAME", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "SYMBOL", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenInWei", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenLeft", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

  lights: Light[] = [
    {value: '0', viewValue: 'not ranked'},
    {value: '1', viewValue: 'rot'},
    {value: '2', viewValue: 'gelb'},
    {value: '3', viewValue: 'grün'}
  ];

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
        this.EnergyTruffle = contract(this.contractsArtifacts);
        this.EnergyTruffle.setProvider(this.web3.currentProvider);
        this.EnergyTruffle
          .deployed()
          .then(inst => {
            this.Energy = inst;
            return inst.tokenBase.call({from: this.acc, gas: 3000000});
          }).then(res => {
            this.contractTokenBaseAddress = res;
            this.TokenBase = this.web3.eth.contract(this.contractTokenBaseABI).at(this.contractTokenBaseAddress);
            this.TokenBase.tokenInWei({from: this.acc, gas: 3000000}, (err, res) => {
              this.tokenInWei = res.toNumber();
              this.getTokenBalance();
              this.getTimeAndInterval();
            });
          });
    });
  }

  approve() {
    this.Energy.setLight(this.addressProducer, this.lightProducer, {from: this.acc, gas: 3000000}).then(res => {});
  }

  approveAuthority() {
    this.Energy.addAuthority(this.addressAuthority, {from: this.acc, gas: 3000000}).then(res => {});
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
      }
    });
  }

  getEther() {

  }



  getAvailableCapacity() {

  }

  getUsedCapacity() {

  }

  getUsedCapacityLoop() {

  }

  request() {

  }


  getTimeAndInterval() {
    this.time = fromUnixToHuman(new Date());
    this.Energy.getNextInterval().then(res => {
      if(this.nextInterval != res.toNumber())
        this.getUsedCapacity();
      this.nextInterval = res.toNumber();
      this.nextIntervalHuman = fromUnixToHuman(new Date(res*1000));
      this.Energy.intervalLength().then(interval => {
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
