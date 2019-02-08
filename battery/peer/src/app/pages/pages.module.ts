import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { BuchenComponent } from './buchen/buchen.component';
import { AccountsComponent } from './accounts/accounts.component';
import { UserComponent } from './user/user.component';
import { BetreiberComponent } from './betreiber/betreiber.component';
import {MatCardModule} from '@angular/material/card';
import { NgxGaugeModule } from 'ngx-gauge';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';






@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatCardModule,
    NgxGaugeModule,
    MatSliderModule,
    FormsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  declarations: [
    HomeComponent,
    PagesComponent,
    BuchenComponent,
    AccountsComponent,
    UserComponent,
    BetreiberComponent,
  ]
})
export class PagesModule { }
