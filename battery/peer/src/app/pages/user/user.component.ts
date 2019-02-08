import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
const Web3 = require("web3");
const contract = require("truffle-contract");


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  tokenToClaim = 0;
  used: number;
  etherBalance: number;
  tokenBalance: number;
  gaugeSize = 300;
  web3: any;
  acc: any;
  accs: any;
  contractsArtifacts;
  VirtualBattery: any;
  storageAddress: any;
  currentValue= 100;
  capacity: number;
  batteryStats = {
    x: 1,
    y: 1,
    capacity: 100
  }
  Storage: any;
  TokenBase: any;
  contractStorageAddress: any;
  contractTokenBaseAddress: any;
  to: any;
  amount: any;
  amountOfToken: number;
  tokenInWei: number;
  transEvent: any;
  storageEvent: any;
  contractStorageABI = [ { "constant": true, "inputs": [], "name": "creator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "provider", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_interval", "type": "uint256" } ], "name": "capacityLeft", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "capacity", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_interval", "type": "uint256" }, { "name": "_capacity", "type": "uint256" } ], "name": "useCapacityInInterval", "outputs": [ { "name": "left", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "setCapacity", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "coordinates", "outputs": [ { "name": "x", "type": "uint256" }, { "name": "y", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "disburse", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "futureIntervals", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "usedCapacityInInterval", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_x", "type": "uint256" }, { "name": "_y", "type": "uint256" }, { "name": "_capacity", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ];
  contractTokenBaseABI = [ { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "buy", "outputs": [ { "name": "amount", "type": "uint256" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_amount", "type": "uint256" } ], "name": "disburseEther", "outputs": [ { "name": "value", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_x", "type": "uint256" }, { "name": "_y", "type": "uint256" }, { "name": "_interval", "type": "uint256" }, { "name": "_value", "type": "uint256" } ], "name": "findCapacity", "outputs": [ { "name": "valueLeft", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": true, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "remaining", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balances", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "creator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "DECIMALS", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTokenInWei", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_AMOUNT", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "NAME", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "SYMBOL", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenInWei", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenLeft", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

  thresholdConfig = {
    '0': {color: 'red'},
    '30': {color: 'orange'},
    '80': {color: 'green'},
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

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
      if(+this.route.snapshot.paramMap.get('id') <= 1)
        this.acc = accs[1];
      else{
        this.acc = accs[+this.route.snapshot.paramMap.get('id')];
      }
      this.web3.eth.getBalance(this.acc, (err, balance) => {
        this.etherBalance = balance.toNumber();
      });
    });
    this.http.get('http://localhost:8080/contract').subscribe((res) => {
        this.contractsArtifacts = res;
        this.VirtualBattery = contract(this.contractsArtifacts);
        this.VirtualBattery.setProvider(this.web3.currentProvider);
        this.VirtualBattery
          .deployed()
          .then(inst => {
            inst.personalStorage(this.acc).then(res => {
              this.contractStorageAddress = res;
              if(res != "0x0000000000000000000000000000000000000000"){
                this.Storage = this.web3.eth.contract(this.contractStorageABI).at(res);
                this.Storage.capacity((err, res) => {
                  this.capacity = res.toNumber();
                  this.getUsed();
                  this.getTokenBalance();
                });
              }
            });
            return inst.tokenBase.call({from: this.acc, gas: 3000000});
          }).then(res => {
            this.contractTokenBaseAddress = res;
            this.TokenBase = this.web3.eth.contract(this.contractTokenBaseABI).at(this.contractTokenBaseAddress);
            this.TokenBase.tokenInWei({from: this.acc, gas: 3000000}, (err, res) => {
              console.log(res.toNumber());
              this.tokenInWei = res.toNumber();
            });
            this.transEvent = this.TokenBase.Transfer({_to: this.acc});
            this.transEvent.watch((err, res) => {
              if(!err)
                this.getTokenBalance();
              else
                console.log(err);
            });
            this.storageEvent = this.TokenBase.Transfer({_to: this.contractStorageAddress});
            this.storageEvent.watch((err, res) => {
              if(!err)
                this.TokenBase.balanceOf(this.contractStorageAddress, {from: this.acc, gas: 3000000}, (err, res) => {
                  this.tokenToClaim = res.toNumber();
                });
              else
                console.log(err);
            });
          });
        });
      }

  register() {
    let instance;
    this.VirtualBattery
      .deployed()
      .then(inst => {
        instance = inst;
        return inst.newStorage.call(1, 1, 100, {from: this.acc, gas: 3000000});
      }).then(res => {
          this.storageEvent = this.TokenBase.Transfer({_to: res});
          this.storageEvent.watch((err, res) => {
            if(!err)
              this.TokenBase.balanceOf(this.contractStorageAddress, {from: this.acc, gas: 3000000}, (err, res) => {
                this.tokenToClaim = res.toNumber();
              });
            else
              console.log(err);
          });
          instance.newStorage(1, 1, 100, {from: this.acc, gas: 3000000}).then(r => {
          this.Storage = this.web3.eth.contract(this.contractStorageABI).at(res);
          this.Storage.capacity((err, res) => {
            this.capacity = res.toNumber();
            this.getUsed();
          });
          this.contractStorageAddress = res;
          this.getTokenBalance();
          });
      });
  }

  setCapacity() {
    this.VirtualBattery
      .deployed()
      .then(inst => {
        inst.setCapacity(this.currentValue, {from: this.acc, gas: 3000000}).then(res => {
          this.Storage.capacity((err, res) => {
            this.capacity = res.toNumber();
          });
        });
      })
      /*
    this.Storage.setCapacity(this.currentValue, {from: this.acc, gas: 3000000}, (err, res) =>{
      this.Storage.capacity((err, res) => {
        this.capacity = res.toNumber();
      });
    });
    */
  }

  getUsed() {
    let nInterval;
    this.VirtualBattery
      .deployed()
      .then(inst => {
        inst.intervalLength({from: this.acc, gas: 3000000}).then(length => {
          inst.getCurrentInterval({from: this.acc, gas: 3000000}).then(res => {
            nInterval = (res.toNumber() + length.toNumber()) * 1000;
            this.Storage.usedCapacityInInterval(res.toNumber(), {from: this.acc, gas: 3000000}, (err, res) => {
              this.used = res.toNumber();
              this.TokenBase.balanceOf(this.contractStorageAddress, {from: this.acc, gas: 3000000}, (err, res) => {
                this.tokenToClaim = res.toNumber();
              });
          });
          var d = new Date();
          var wait = nInterval - d.getTime();
          setTimeout(() => {this.getUsed()}, wait);
        });
      });
    });
  }

  getTokenBalance() {
    this.TokenBase.balanceOf(this.acc, {from: this.acc, gas: 3000000}, (err, res) => {
      this.tokenBalance = res.toNumber();
    });
  }

  disburse() {
    this.Storage.disburse.call({from: this.acc, gas: 3000000}, (err, res) => {
      alert("Es wurden " + res + " Token auf Ihr Konto überwiesen");
    });
    this.Storage.disburse({from: this.acc, gas: 3000000}, (err, res) => {
      this.getTokenBalance();
      this.TokenBase.balanceOf(this.contractStorageAddress, {from: this.acc, gas: 3000000}, (err, res) => {
        this.tokenToClaim = res.toNumber();
      });
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
    this.TokenBase.disburseEther.call(this.amountOfToken, {from: this.acc, gas: 3000000}, (err, res) => {
      if(err != undefined) {
        alert("Nicht erfolgreich! \n Transaktionshash: " + err);
      }
      else {
        alert("Erfolgreich! \nSie haben im Austausch gegen " + this.amountOfToken + " Token " + res + "Wei erhalten.");
      }
    });
    this.TokenBase.disburseEther(this.amountOfToken, {from: this.acc, gas: 3000000}, (err, res) => {});
    this.getTokenBalance();
    this.web3.eth.getBalance(this.acc, (err, balance) => {
      this.etherBalance = balance.toNumber();
    });
  }



}
