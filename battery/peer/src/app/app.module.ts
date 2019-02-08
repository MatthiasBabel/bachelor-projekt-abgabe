import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { Web3Service } from './services/web3.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpService } from './services/http.service';
import { ContractService } from './services/contract.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    MatToolbarModule,
    HttpClientModule
  ],
  providers: [Web3Service, HttpService, ContractService],
  bootstrap: [AppComponent]
})
export class AppModule { }
