import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

const Web3 = require('web3');

declare var window: any;

@Injectable()
export class Web3Service {

  public web3: any;

  public account: any;
  public accounts: any;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.checkAndInstantiateWeb3();

    this.getAccounts().subscribe(accs => {
      console.log(+this.route.snapshot.paramMap.get('id'));
      //if(+this.route.snapshot.paramMap.get('id') <== 0);
      this.account = accs[0];
      this.accounts = accs;
    });
    console.warn('Web3 loaded');
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    /*if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source.'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else*/{
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
      );
      console.log(this.web3);
    }
  };

  getAccounts(): Observable<any> {
    return Observable.create(observer => {
      this.web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          observer.error('There was an error fetching your accounts.')
        }

        if (accs.length === 0) {
          observer.error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
        }

        observer.next(accs)
        observer.complete()
      });
    })
  }

  getBalance(account): Observable<any> {
    return Observable.create(observer => {
      this.web3.eth.getBalance(account, (err, balance) => {
        if (err != null) {
          observer.error('There was an error fetching your balance.');
        }
        observer.next(balance.toString());
        observer.complete();
      });
    });
  }

  getBlock(blockHash): Observable<any> {
    return Observable.create(observer => {
      this.web3.eth.getBlock(blockHash, (err, balance) => {
        if (err != null) {
          observer.error('There was an error fetching your balance.');
        }
        observer.next(balance);
        observer.complete();
      });
    });
  }

  getTransaction(txHash): Observable<any> {
    return Observable.create(observer => {
      this.web3.eth.getTransaction(txHash, (err, balance) => {
        if (err != null) {
          observer.error('There was an error fetching your balance.');
        }
        console.log(balance);
        observer.next(balance);
        observer.complete();
      });
    });
  }

  getLastFewReceipts(txSender: any, quantity: number, cb: any): any {
    let blockNbr: number;
    let logs: Array<any> = [];
    this.web3.eth.getBlockNumber((err, res) => {
      if (!err) {
        blockNbr = res;
      }
      else {
        console.error(err);
      }
      nextBlock(blockNbr, this.web3);
      cb(logs);
    });

    function nextBlock(blNbr, web3){
      web3.eth.getBlock(blNbr, (err, res) => {
       for(let transactionHash of res.transactions){
         web3.eth.getTransaction(transactionHash, (err, res) => {
           if(res.from == txSender){
              logs.push(res);
          }
          if(logs.length < quantity)
            nextBlock(--blNbr, web3);
         });
       }
      });

    }
  }
}
