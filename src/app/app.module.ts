import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LcDatePickerModule } from '../lib/lc-date-picker.module';
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
