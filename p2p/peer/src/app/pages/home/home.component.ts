import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../services/web3.service';
import { ContractService } from '../../services/contract.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  account: any;

  constructor(
    private web3Service: Web3Service,
    private contractService: ContractService
  ) { }

  ngOnInit() {


  }



}
