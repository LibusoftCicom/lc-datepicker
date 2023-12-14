import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LCTimePickerComponent } from './time-picker/time-picker.component';
import { LCTimePickerCompactComponent } from './time-picker-compact/time-picker-compact.component';
import { LCDayPickerComponent } from './day-picker/day-picker.component';
import { LCMonthPickerComponent } from './month-picker/month-picker.component';
import { LCYearPickerComponent } from './year-picker/year-picker.component';
import { LCDatePickerComponent } from './lc-date-picker.component';
import { LCDateRangePickerComponent } from './lc-date-range-picker.component';
import {LCDatePickerAdapter} from './lc-date-picker-adapter.class';
import {LCDayPickerButtonComponent} from './day-picker/day-picker-button.component';
import {LCMonthPickerButtonComponent} from './month-picker/month-picker-button.component';
import {LCYearPickerButtonComponent} from './year-picker/year-picker-button.component';
import {LCTimeSpinnerComponent} from './time-picker/time-spinner.component';
import {LCTimeSpinnerCompactComponent} from './time-picker-compact/time-spinner-compact.component';
import {LCConfirmButtonComponent} from './confirm-button.component';
import {LCCalendarBackgroundComponent} from './calendar-background.component';

export interface ImplementationConfig {
  adapter?: Type<LCDatePickerAdapter>;
}

@NgModule({
	imports: [CommonModule],
	declarations: [
		LCDatePickerComponent,
		LCTimePickerComponent,
		LCTimePickerCompactComponent,
		LCDayPickerComponent,
		LCMonthPickerComponent,
		LCYearPickerComponent,
		LCDateRangePickerComponent,
		LCDayPickerButtonComponent,
		LCMonthPickerButtonComponent,
		LCYearPickerButtonComponent,
		LCTimeSpinnerComponent,
		LCTimeSpinnerCompactComponent,
		LCConfirmButtonComponent,
		LCCalendarBackgroundComponent,
	],
	exports: [LCDatePickerComponent, LCDateRangePickerComponent],
})
export class LcDatePickerModule {
	public static withImplementation(config: ImplementationConfig = {}): ModuleWithProviders<LcDatePickerModule> {
		return {
			ngModule: LcDatePickerModule,
			providers: [{ provide: LCDatePickerAdapter, useClass: config.adapter }],
		};
	}
}

export * from './lc-date-picker-config-helper';
export * from './lc-date-picker.component';
export * from './lc-date-range-picker.component';
export * from './date-time.class';
export * from './enums';
