import {ModuleWithProviders, NgModule, Type} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LCTimePickerComponent } from './time-picker/time-picker.component';
import { LCTimePickerCompactComponent } from './time-picker-compact/time-picker-compact.component';
import { LCDayPickerComponent } from './day-picker/day-picker.component';
import { LCMonthPickerComponent } from './month-picker/month-picker.component';
import { LCYearPickerComponent } from './year-picker/year-picker.component';
import { LCDatePickerComponent } from './lc-datepicker/lc-date-picker.component';
import { LCDateRangePickerComponent } from './lc-date-range-picker/lc-date-range-picker.component';
import {LCDatePickerAdapter} from './lc-date-picker-adapter.class';
import {LCDayPickerButtonComponent} from './day-picker/day-picker-button.component';
import {LCMonthPickerButtonComponent} from './month-picker/month-picker-button.component';
import {LCYearPickerButtonComponent} from './year-picker/year-picker-button.component';
import {LCTimeSpinnerComponent} from './time-picker/time-spinner.component';
import {LCTimeSpinnerCompactComponent} from './time-picker-compact/time-spinner-compact.component';
import {LCConfirmButtonComponent} from './confirm-button/confirm-button.component';
import {LCCalendarBackgroundComponent} from './calendar-background/calendar-background.component';
import { LcDatePickerHeaderDirective } from './header/lc-date-picker-header.directive';
import { withDatePickerHeader } from './header/header-provider.class';
import { withDatePickerFooter } from './footer/footer-provider.class';
import { LcDatePickerBasicHeaderComponent } from './header/lc-date-picker-basic-header.component';
import { LCDatePickerFooterComponent } from './footer/footer.component';
import { LcDatePickerFooterDirective } from './footer/lc-date-picker-footer.directive';
import { IDatePickerHeader } from './header/lc-date-picker-header.interface';
import { IDatePickerFooter } from './footer/footer.component.interface';
import { LCCalendarCellComponent } from './calendar-cell/calendar-cell.component';
import { LCCalendarGridComponent } from './calendar-grid/calendar-grid.component';
import { LCActiveCalendarPanelComponent } from './active-calendar-panel/active-calendar-panel.component';

export interface ImplementationConfig {
  adapter?: Type<LCDatePickerAdapter>;
	header?: Type<IDatePickerHeader>;
	footer?: Type<IDatePickerFooter>;
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
		LCCalendarCellComponent,
		LCCalendarGridComponent,
		LCActiveCalendarPanelComponent,
		LCTimeSpinnerComponent,
		LCTimeSpinnerCompactComponent,
		LCConfirmButtonComponent,
		LCCalendarBackgroundComponent,
    	LcDatePickerHeaderDirective,
		LcDatePickerBasicHeaderComponent,
		LCDatePickerFooterComponent,
		LcDatePickerFooterDirective,
	],
	exports: [
    LCDatePickerComponent,
    LCDateRangePickerComponent,
  ],
  providers: [
    withDatePickerHeader()
	, withDatePickerFooter()
  ]
})
export class LcDatePickerModule {
	public static withImplementation(config: ImplementationConfig = {}): ModuleWithProviders<LcDatePickerModule> {
		return {
			ngModule: LcDatePickerModule,
			providers: [
				{ provide: LCDatePickerAdapter, useClass: config.adapter }
				, withDatePickerHeader(config.header)
				, withDatePickerFooter(config.footer)
			],
		};
	}
}

export * from './lc-date-picker-config';
export * from './lc-date-picker-control';
export * from './lc-datepicker/lc-date-picker.component';
export * from './lc-date-range-picker/lc-date-range-picker.component';
export * from './date-time.class';
export * from './enums';
export * from './base-date-picker.class';
export * from './lc-date-picker-adapter.class';
export * from './header/header-provider.class';
export * from './header/lc-date-picker-header.interface';
export * from './footer/footer-provider.class';
export * from './footer/footer.component.interface';
export * from './day-picker/day-picker.class';
export * from './year-picker/year-picker.class';
export * from './month-picker/month-picker.class';
