import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LCDatePickerComponent } from './lc-date-picker.component';
import { LCTimePickerComponent } from './time-picker/time-picker.component';
import { LCTimePickerCompactComponent } from './time-picker-compact/time-picker-compact.component';

import { LCDayPickerComponent } from './day-picker/day-picker.component';
import { LCMonthPickerComponent } from './month-picker/month-picker.component';
import { LCYearPickerComponent } from './year-picker/year-picker.component';
import { LCDatePickerAdapter } from './lc-date-picker-adapter.class';
import { LuxonDateAdapterService } from '../../../../../src/app/luxon-date-adapter.service';
import { LCConfirmButtonComponent } from './confirm-button.component';
import { LCTimeSpinnerCompactComponent } from './time-picker-compact/time-spinner-compact.component';
import { LCDayPickerButtonComponent } from './day-picker/day-picker-button.component';
import { LCCalendarBackgroundComponent } from './calendar-background.component';
import { Panel } from './base-date-picker.class';
import {LCMonthPickerButtonComponent} from './month-picker/month-picker-button.component';
import { DatePickerConfig } from './lc-date-picker-config-helper';
import { ECalendarType } from './enums';
import { DateTime } from './date-time.class';

describe('LCDatePickerComponent', () => {
	let component: LCDatePickerComponent;
	let fixture: ComponentFixture<LCDatePickerComponent>;
	let dateAdapter: LCDatePickerAdapter;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				LCDatePickerComponent,
				LCTimePickerComponent,
				LCDayPickerComponent,
				LCDayPickerButtonComponent,
				LCMonthPickerComponent,
                LCMonthPickerButtonComponent,
				LCYearPickerComponent,
				LCTimePickerCompactComponent,
				LCTimeSpinnerCompactComponent,
				LCConfirmButtonComponent,
				LCCalendarBackgroundComponent,
			],
			providers: [
				{
					provide: LCDatePickerAdapter,
					useClass: LuxonDateAdapterService,
				},
			],
		})
			.compileComponents()
			.then(() => {
				dateAdapter = TestBed.inject(LCDatePickerAdapter);
				fixture = TestBed.createComponent(LCDatePickerComponent);
				component = fixture.componentInstance;
				const today = dateAdapter.today();

				component.config = new DatePickerConfig();
				component.config.setCalendarType(ECalendarType.DateTime);
				component.config.setLocalization('hr');
				component.config.setMinDate(dateAdapter.setParts(dateAdapter.getStartOfYear(today), { year: 1900 }));
				component.config.setMaxDate(dateAdapter.setParts(dateAdapter.getStartOfYear(today), { year: 2099 }));
				component.config.labels = { confirmLabel: 'Odabir' };

				component.value = today;

				fixture.detectChanges();
			});
	}));

	it('should create DatePicker component', () => {
		expect(component).toBeTruthy();
	});

	it('should set init date', () => {
		const date = dateAdapter.now();
		component.value = date;
		expect(dateAdapter.toISOString(component.getValue())).toBe(dateAdapter.toISOString(date));
	});

	it('should set new date on dayPicker click', () => {
		const newDate = dateAdapter.add(dateAdapter.now(), 1, 'day');
		component.onDaySelected(newDate);
		expect(dateAdapter.toISOString(component.getSelectedDateTime())).toBe(dateAdapter.toISOString(newDate));
	});

	it('should set new month on monthPicker click', () => {
		const newDate = dateAdapter.setParts(dateAdapter.now(), { month: 1, date: 1 });
		component.onMonthSelected(newDate);
		expect(component.getSelectedDateTime().getMonth()).toBe(newDate.getMonth());
	});

	it('should set new year on yearPicker click', () => {
		const newDate = dateAdapter.setParts(dateAdapter.now(), { month: 1, date: 1, year: 2016 });
		component.onYearSelected(newDate);
		expect(component.getSelectedDateTime().getYear()).toBe(newDate.getYear());
	});

	it('should switch on Month panel on click', () => {
		component.onSwitchPanel(Panel.Month);
		expect(component.activePanel).toBe(Panel.Month);
	});

	it('should emit date on click', () => {
	    const date = dateAdapter.setParts(dateAdapter.today(), {hour: 5, minute: 45});
	    component.onDaySelected(date);
	    let emitedDate: string;
	    component.dateChange.subscribe((date: DateTime) => emitedDate = dateAdapter.toISOString(date));
	    component.confirm();
	    expect(emitedDate).toBe(dateAdapter.toISOString(date));
	});
});
