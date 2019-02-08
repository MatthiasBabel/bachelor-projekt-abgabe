import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSort, MatTableDataSource} from '@angular/material';
import { ViewChild } from '@angular/core'

import { ActivatedRoute } from '@angular/router';
const Web3 = require("web3");
const contract = require("truffle-contract");


export interface Auction {
  position: number;
  address: number;
  bid: number;
  light: number;
  owner: any;
  interval: any;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentUnits = 0;
  nextUnits = 0;
  activeAuction: any;
  dataSource: any;
  tokenToClaim = 0;
  used: number;
  etherBalance: number;
  tokenBalance: number;
  gaugeSize = 300;
  web3: any;
  acc: any;
  accs: any;
  contractsArtifacts;
  Energy: any;
  AuctionAddress: any;
  currentValue= 100;
  capacity: number;
  intervalLength: any;
  Auction: any;
  TokenBase: any;
  contractAuctionAddress: any;
  contractTokenBaseAddress: any;
  to: any;
  amount: any;
  amountOfToken: number;
  tokenInWei: number;
  transEvent: any;
  AuctionEvent: any;
  EnergyTruffle: any;
  endNextIntervalHuman: any;
  currentIntervalHuman: any;
  endCurrentIntervalHuman: any;
  nextInterval: any;
  nextIntervalHuman: any;
  time: any;
  nextIntervalAuctionCounter = 0;
  amountOfWei: any;
  auctionEvent: any;
  bidEvent: any;
  bidToSet: any;
  contractAuctionABI = [  {   "constant": true,   "inputs": [],   "name": "creator",   "outputs": [    {     "name": "",     "type": "address"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "isElapsed",   "outputs": [    {     "name": "",     "type": "bool"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "getTime",   "outputs": [    {     "name": "",     "type": "uint256"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "light",   "outputs": [    {     "name": "",     "type": "uint8"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "startTime",   "outputs": [    {     "name": "",     "type": "uint256"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "owner",   "outputs": [    {     "name": "",     "type": "address"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "highestBidder",   "outputs": [    {     "name": "",     "type": "address"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": false,   "inputs": [    {     "name": "_bidder",     "type": "address"    }   ],   "name": "bid",   "outputs": [    {     "name": "",     "type": "bool"    }   ],   "payable": false,   "stateMutability": "nonpayable",   "type": "function"  },  {   "constant": false,   "inputs": [],   "name": "disburse",   "outputs": [    {     "name": "",     "type": "uint256"    }   ],   "payable": false,   "stateMutability": "nonpayable",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "tokenBase",   "outputs": [    {     "name": "",     "type": "address"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "constant": true,   "inputs": [],   "name": "highestBid",   "outputs": [    {     "name": "",     "type": "uint256"    }   ],   "payable": false,   "stateMutability": "view",   "type": "function"  },  {   "inputs": [    {     "name": "_owner",     "type": "address"    },    {     "name": "_startTime",     "type": "uint256"    },    {     "name": "_light",     "type": "uint8"    }   ],   "payable": false,   "stateMutability": "nonpayable",   "type": "constructor"  },  {   "anonymous": false,   "inputs": [    {     "indexed": true,     "name": "lastHighestBidder",     "type": "address"    },    {     "indexed": true,     "name": "newHighestBid",     "type": "uint256"    },    {     "indexed": false,     "name": "auction",     "type": "address"    }   ],   "name": "Bid",   "type": "event"  } ];
  contractTokenBaseABI = [ { "constant": true, "inputs": [], "name": "creator", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_auction", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "bidOnAuction", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "INITIAL_AMOUNT", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balances", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "DECIMALS", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getWeiInTokenbase", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTokenInWei", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenLeft", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "NAME", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "buy", "outputs": [ { "name": "amount", "type": "uint256" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "disburseEther", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "remaining", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "SYMBOL", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "tokenInWei", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": true, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "lastHighestBidder", "type": "address" }, { "indexed": true, "name": "newHighestBid", "type": "uint256" }, { "indexed": false, "name": "auction", "type": "address" } ], "name": "Bid", "type": "event" } ];

  thresholdConfig = {
    '0': {color: 'red'},
    '30': {color: 'orange'},
    '80': {color: 'green'},
  };
  auctions: Auction[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  displayedColumns: string[] = [];
  //dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

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
        this.acc = accs[+this.route.snapshot.paramMap.get('id')]
      }
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
            });
            this.getTokenBalance();
            this.getTimeAndInterval();
            this.bidEvent = this.TokenBase.Bid();
            this.bidEvent.watch((err, res) => {
              if(!err)
                this.newBid(res);
              else
                console.log(err);
            });
            this.auctionEvent = this.Energy.NewAuction();
            this.auctionEvent.watch((err, res) => {
              if(!err)
                this.getAuctions();
              else
                console.log(err);
            });
            this.transEvent = this.TokenBase.Transfer({_to: this.acc});
            this.transEvent.watch((err, res) => {
              if(!err)
                this.getTokenBalance();
              else
                console.log(err);
            });
          });
        });
      }

  startAuction() {
    this.Energy.startAuction({from: this.acc, gas: 3000000}).then(res => {
      this.getEtherBalance();
    });
  }



  getAuctions() {
    this.nextUnits = 0;
    this.Energy.getAuctions.call(this.nextInterval, {from: this.acc, gas: 3000000}).then(auctions => {
      for(let i = this.nextIntervalAuctionCounter; i < auctions.length; i++){
        let Auction = this.web3.eth.contract(this.contractAuctionABI).at(auctions[i]);
        Auction.owner.call((err, owner) => {
          Auction.highestBid.call((err, bid) => {
            Auction.light.call((err, light) => {
              Auction.startTime.call((err, startTime) => {
                Auction.highestBidder.call((err, highestBidder) => {
                  this.auctions.push({position: i, address: auctions[i], bid: bid.toNumber(), owner: owner, light: light.toNumber(), interval: startTime.toNumber()});
                  if(i == auctions.length - 1) {
                    this.dataSource = new MatTableDataSource(this.auctions);
                    this.dataSource.sort = this.sort;
                    this.displayedColumns = ['position', 'bid', 'light', 'address', 'owner'];
                  }
                  if(highestBidder == this.acc)
                    this.nextUnits++;
                });
              });
            });
          });
        });
      }
      this.nextIntervalAuctionCounter = auctions.length;
      console.log(this.auctions);
    });
  }

  getTimeAndInterval() {
    this.time = fromUnixToHuman(new Date());
    this.Energy.getNextInterval().then(res => {
      let old = this.nextInterval;
      this.nextInterval = res.toNumber();
      this.nextIntervalHuman = fromUnixToHuman(new Date(res*1000));
      this.Energy.intervalLength().then(interval => {
        this.intervalLength = interval.toNumber();
        this.endNextIntervalHuman = fromUnixToHuman(new Date((this.nextInterval + this.intervalLength-1) * 1000 ));
        this.currentIntervalHuman = fromUnixToHuman(new Date((this.nextInterval - this.intervalLength) * 1000 ));
        this.endCurrentIntervalHuman = fromUnixToHuman(new Date((this.nextInterval -1) * 1000 ));
        if(this.nextInterval != old){
          console.log("new Zeitintervall");
          this.nextIntervalAuctionCounter = 0;
          this.auctions = [];
          this.dataSource = new MatTableDataSource(this.auctions);
          this.getAuctions();
          this.getCurrentUnits();
          this.activeAuction = undefined;
        }
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


  getTokenBalance() {
    this.TokenBase.balanceOf(this.acc, {from: this.acc, gas: 3000000}, (err, res) => {
      this.tokenBalance = res.toNumber();
    });
  }

  disburse() {
    this.Auction.disburse.call({from: this.acc, gas: 3000000}, (err, res) => {
      alert("Es wurden " + res + " Token auf Ihr Konto überwiesen");
    });
    this.Auction.disburse({from: this.acc, gas: 3000000}, (err, res) => {
      this.getTokenBalance();
      this.TokenBase.balanceOf(this.contractAuctionAddress, {from: this.acc, gas: 3000000}, (err, res) => {
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
        this.getTokenBalance();
        this.getEtherBalance();
      }
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

  setNewBid(input) {
    this.TokenBase.bidOnAuction(this.activeAuction.address, this.bidToSet, {from: this.acc, gas: 3000000}, (err, res) => {
      if(err != undefined) {
        alert("Nicht erfolgreich! \n Transaktionshash: " + err);
      }
      else {
        alert("Erfolgreich! \Gebot wurde abgegeben: " + res);
        this.getTokenBalance();
        this.getEtherBalance();
        this.nextUnits++;
      }
    });
  }

  newBid(input) {
    if(input.args.lastHighestBidder == this.acc) {
      this.nextUnits--;
      alert("Sie wurden soeben bei Auktion " + input.args.auction + " mit einem Gebot von " + input.args.newHighestBid.toNumber() + " überboten");
    }
    for(let i = 0; i < this.auctions.length; i++) {
      if(this.auctions[i].address == input.args.auction){
        this.auctions[i].bid = input.args.newHighestBid.toNumber();
        this.dataSource = new MatTableDataSource(this.auctions);
        this.dataSource.sort = this.sort;
        break;
      }
    }
  }

  getCurrentUnits() {
    this.currentUnits = 0;
    this.Energy.getAuctions.call(this.nextInterval - this.intervalLength, {from: this.acc, gas: 3000000}).then(auctions => {
      for(let i = 0; i < auctions.length; i++){
        let Auction = this.web3.eth.contract(this.contractAuctionABI).at(auctions[i]);
        Auction.highestBidder.call((err, bidder) => {
          Auction.owner.call((err, owner) => {
            if(bidder == this.acc)
              this.currentUnits++;
            if(owner == this.acc){
              console.log("owner");
              Auction.disburse({from: this.acc, gas: 3000000}, (err, res) => {
                console.log(err);
                console.log(res);
                this.getTokenBalance();
              });
            }
          });
        });
      }
    });
  }
}
