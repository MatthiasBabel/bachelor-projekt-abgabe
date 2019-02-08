import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { HttpClient } from '@angular/common/http';

const contract = require("truffle-contract");

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  tallySheetArtifacts;
  Contract;

  account = this.web3Ser.account;

  constructor(
    private web3Ser: Web3Service,
    private http: HttpClient
  ) { }

  start() {
  return new Promise( (resolve, rej) => {
    this.http.get('http://localhost:8080/contract').subscribe((res) => {
      console.log("hello");
      this.tallySheetArtifacts = res;
      console.log(res);
      this.Contract = contract(this.tallySheetArtifacts);
      this.Contract.setProvider(this.web3Ser.web3.currentProvider);
      resolve('set');
  })
  });
}

  newAccount(name: any): any{
  return this.Contract
    .deployed()
    .then(inst => {
      return inst.newAccount((name), {from: this.account, gas: 900000}).then(log =>{console.log(log); return log})
    })
  }

  getMaxCapa(): any{
  return this.Contract
    .deployed()
    .then(inst => {
      return inst.getMaxCapa({from: this.account, gas: 900000}).then(log =>{console.log(log); return log})
    });
  }

  newProsumer(account: any): any{
  return this.Contract
    .deployed()
    .then(inst => {
      return inst.newProsumer({from: account, gas: 900000}).then(log =>{console.log(log); return log})
    });
  }

  addNewStorage(x: any, y: any, capacity: any, account: any): any{
  return this.Contract
    .deployed()
    .then(inst => {
      return inst.addNewStorage(x, y, capacity, {from: account, gas: 3000000}).then(log =>{console.log(log); return log})
    });
  }

  setMyStorageOnline(nbr: number, account: any): any{
  return this.Contract
    .deployed()
    .then(inst => {
      return inst.setMyStorageOnline(nbr, {from: account, gas: 900000}).then(log =>{console.log(log); return log})
    });
  }

  setMyStorageOffline(nbr: number, account: any): any{
  return this.Contract
    .deployed()
    .then(inst => {
      return inst.setMyStorageOffline(nbr, {from: account, gas: 900000}).then(log =>{console.log(log); return log})
    });
  }

  getCapaOfMyStorage(nbr: number, account: any): any{
    return this.Contract
      .deployed()
      .then(inst => {
        return inst.getCapaOfMyStorage(nbr, {from: account, gas: 900000}).then(log =>{console.log(log); return log})
      });
  }
  balanceOf(account: any): any{
    return this.Contract
      .deployed()
      .then(inst => {
        return inst.balanceOf(account, {from: account, gas: 900000}).then(log =>{console.log(log); return log})
      });
  }


  changeCapa(nbr: any, capa: any, account: any): any{
    return this.Contract
      .deployed()
      .then(inst => {
        return inst.changeCapa(nbr, capa, {from: account, gas: 900000}).then(log =>{console.log(log); return log})
      });
  }

  getMyUnusedCapaInNextInterval(nbr: any, account: any): any{
    return this.Contract
      .deployed()
      .then(inst => {
        return inst.getMyUnusedCapaInNextInterval(nbr, {from: account, gas: 900000}).then(log =>{console.log(log); return log})
      });
  }

  claim(account: any): any{
    return this.Contract
      .deployed()
      .then(inst => {
        return inst.claim({from: account, gas: 900000}).then(log =>{console.log(log); return log})
      });
  }


  useCapaInNextIntervalForXY(x: any, y: any, value: any, account: any): any{
    return this.Contract
      .deployed()
      .then(inst => {
        return inst.useCapaInNextIntervalForXY(x, y, value, {from: account, gas: 1200000}).then(log =>{console.log(log); return log})
      });
  }

  getUnusedCapaInNextInterval(x: any, y: any, account: any): any{
    return this.Contract
      .deployed()
      .then(inst => {
        return inst.getUnusedCapaInNextInterval(x, y, {from: account, gas: 900000}).then(log =>{console.log(log); return log})
      });
  }

  setOn(account: any): any{
    return this.Contract
      .deployed()
      .then(inst => {
        return inst.setOn({from: account, gas: 900000}).then(log =>{console.log(log); return log})
      });
  }

  getOn(account: any): any{
    return this.Contract
      .deployed()
      .then(inst => {
        return inst.getOn({from: account, gas: 900000}).then(log =>{console.log(log); return log})
      });
  }










}
