import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LCDatePickerComponent } from './lc-date-picker.component';
import { LCTimePickerComponent } from '../time-picker/time-picker.component';
import { LCTimePickerCompactComponent } from '../time-picker-compact/time-picker-compact.component';

import { LCDayPickerComponent } from '../day-picker/day-picker.component';
import { LCMonthPickerComponent } from '../month-picker/month-picker.component';
import { LCYearPickerComponent } from '../year-picker/year-picker.component';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';
import { LCConfirmButtonComponent } from '../confirm-button/confirm-button.component';
import { LCTimeSpinnerCompactComponent } from '../time-picker-compact/time-spinner-compact.component';
import { LCDayPickerButtonComponent } from '../day-picker/day-picker-button.component';
import { LCCalendarBackgroundComponent } from '../calendar-background/calendar-background.component';
import { LCMonthPickerButtonComponent } from '../month-picker/month-picker-button.component';
import { ECalendarType } from '../enums';
import { Panel } from '../base-date-picker.class';
import { IDatePickerConfiguration } from '../lc-date-picker-control';
import { DatePickerConfig } from '../lc-date-picker-config';

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

        const config:IDatePickerConfiguration = {
          value: dateAdapter.toISOString(today),
          calendarType: ECalendarType.DateTime,
          localization: 'hr',
          minimumDate: dateAdapter.toISOString(dateAdapter.setParts(dateAdapter.getStartOfYear(today), {year: 1900})),
          maximumDate: dateAdapter.toISOString(dateAdapter.setParts(dateAdapter.getStartOfYear(today), {year: 2099})),
          labels: {confirmLabel: 'Odabir'}
        };

        component.config = new DatePickerConfig(config, dateAdapter);

        component.config.setHostElement(fixture.nativeElement);

				fixture.detectChanges();
			});
	}));

	it('should create DatePicker component', () => {
		expect(component).toBeTruthy();
	});

	it('should set init date', () => {
		const date = dateAdapter.toISOString(dateAdapter.now());
		component.config.setValue(date);
		expect(component.config.getValue()).toBe(date);
	});

	it('should set new date on click', () => {
		const newDate = dateAdapter.toISOString(dateAdapter.add(dateAdapter.now(), 1, 'day'));
		component.config.setValue(newDate);
		expect(component.config.getValue()).toBe(newDate);
	});

	it('should switch on Month panel on click', () => {
		component.config.setCalendarType(ECalendarType.MonthYear);
		expect(component.config.getPanel()).toBe(Panel.Month);
	});

	it('should emit date on click', () => {
	    const date = dateAdapter.toISOString(dateAdapter.setParts(dateAdapter.today(), {hour: 5, minute: 45}));
	    component.config.setValue(date);
	    let emittedDate: string;
	    component.dateChange.subscribe((date: string) => emittedDate = date);
	    component.changeDate();
	    expect(emittedDate).toBe(date);
	});
});
