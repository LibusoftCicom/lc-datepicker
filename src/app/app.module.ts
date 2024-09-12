import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LcDatePickerModule } from '@libusoftcicom/lc-datepicker';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { MomentDateAdapterService } from './moment-date-adapter.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LcDatePickerModule.withImplementation({adapter: MomentDateAdapterService}),
  ],
  providers: [
    MomentDateAdapterService,
    // LuxonDateAdapterService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
