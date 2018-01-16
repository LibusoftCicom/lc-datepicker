import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LcDatePickerModule } from '@libusoftcicom/lc-datepicker';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LcDatePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
