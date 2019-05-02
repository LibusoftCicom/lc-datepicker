import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LCTimePickerComponent } from './lc-date-picker/time-picker/time-picker.component';
import { LCTimePickerCompactComponent } from './lc-date-picker/time-picker-compact/time-picker-compact.component';
import { LCDayPickerComponent } from './lc-date-picker/day-picker/day-picker.component';
import { LCMonthPickerComponent } from './lc-date-picker/month-picker/month-picker.component';
import { LCYearPickerComponent } from './lc-date-picker/year-picker/year-picker.component';
import { LCDatePickerComponent } from './lc-date-picker/lc-date-picker.component';
import { DatePickerConfig } from './lc-date-picker/lc-date-picker-config-helper';
import { LCDateRangePickerComponent } from './lc-date-picker/lc-date-range-picker.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    LCDatePickerComponent,
    LCTimePickerComponent,
    LCTimePickerCompactComponent,
    LCDayPickerComponent,
    LCMonthPickerComponent,
    LCYearPickerComponent,
    LCDateRangePickerComponent
  ],
  exports: [LCDatePickerComponent, LCDateRangePickerComponent]
})
export class LcDatePickerModule {}

export * from './lc-date-picker/lc-date-picker-config-helper';
export * from './lc-date-picker/lc-date-picker.component';
