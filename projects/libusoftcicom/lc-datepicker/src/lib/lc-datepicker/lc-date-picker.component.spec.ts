import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LCDatePickerComponent } from './lc-date-picker.component';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';
import { ECalendarType } from '../enums';
import { Panel } from '../base-date-picker.class';
import { IDatePickerConfiguration } from '../lc-date-picker-control';
import { DatePickerConfig } from '../lc-date-picker-config';
import { LcDatePickerModule } from '../lc-date-picker.module';
import { DateTime } from '../date-time.class';
import { LCDayPickerComponent } from '../day-picker/day-picker.component';

describe('LCDatePickerComponent', () => {
	let component: LCDatePickerComponent;
	let fixture: ComponentFixture<LCDatePickerComponent>;
	let dateAdapter: LCDatePickerAdapter;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [LcDatePickerModule],
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

	const createLinkedRangePicker = (start: DateTime): LCDayPickerComponent => {
		fixture.destroy();
		fixture = TestBed.createComponent(LCDatePickerComponent);
		component = fixture.componentInstance;
		component.config = new DatePickerConfig({
			value: dateAdapter.toISOString(start),
			calendarType: ECalendarType.Date,
			rangeSelectionMode: 'linked',
			selectionMode: 'explicit'
		}, dateAdapter);
		fixture.detectChanges();
		component.config.setOpen(true);
		fixture.detectChanges();
		return fixture.debugElement.query(By.directive(LCDayPickerComponent))
			.componentInstance as LCDayPickerComponent;
	}

	const dayButton = (day: number): HTMLButtonElement => Array.from(
			fixture.nativeElement.querySelectorAll('lc-day-picker-button button') as NodeListOf<HTMLButtonElement>
		).find(button => button.textContent.trim() === String(day)) as HTMLButtonElement;

	const dayCell = (day: number): HTMLElement => dayButton(day).parentElement as HTMLElement;

	it('should create DatePicker component', () => {
		expect(component).toBeTruthy();
		expect(component.config.isLinkedRangeSelection()).toBe(false);
		expect(component.config.isSynchronizedRangeNavigation()).toBe(false);
	});

	it('emits only open changes when a linked range draft is cancelled', () => {
		fixture.destroy();
		fixture = TestBed.createComponent(LCDatePickerComponent);
		component = fixture.componentInstance;
		component.config = new DatePickerConfig({
			value: dateAdapter.toISOString(new DateTime(2026, 9, 20, 0, 0, 0, 0, 'UTC')),
			calendarType: ECalendarType.Date,
			rangeSelectionMode: 'linked',
			selectionMode: 'explicit'
		}, dateAdapter);
		fixture.detectChanges();
		const originalValue = component.config.getValue();
		const events: string[] = [];
		component.openedChange.subscribe(open => events.push(`open:${open}`));
		component.dateChange.subscribe(value => events.push(`date:${value}`));

		component.config.setOpen(true);
		dayButton(25).click();
		fixture.detectChanges();
		expect(events).toEqual(['open:true']);

		component.config.setOpen(false);
		fixture.detectChanges();
		expect(component.config.getValue()).toBe(originalValue);
		expect(events).toEqual(['open:true', 'open:false']);
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

	it('should confirm through the control navigation event exactly once', () => {
		const changed = jasmine.createSpy('dateChange');
		component.dateChange.subscribe(changed);
		component.config.setOpen(true);
		component.confirm();
		expect(changed).toHaveBeenCalledTimes(1);
		expect(changed).toHaveBeenCalledWith(component.config.getValue());
		expect(component.config.isOpen()).toBe(false);
	});

	it('should clear the output and close the picker', () => {
		const changed = jasmine.createSpy('dateChange');
		component.dateChange.subscribe(changed);
		component.config.setOpen(true);
		component.clear();
		expect(changed).toHaveBeenCalledOnceWith('');
		expect(component.config.isOpen()).toBe(false);
	});

	it('preserves the clock icon when no optional time label is configured', () => {
		component.config.setOpen(true);
		expect(fixture.nativeElement.querySelector('.clockCell .fa-clock-o')).not.toBeNull();
		expect(fixture.nativeElement.querySelector('.timeCaption')).toBeNull();
	});

	it('supports a time label and changing the hour without confirming the date', () => {
		component.config.setLabels({ confirmLabel: 'Odabir', timeLabel: 'Vrijeme' });
		const changed = jasmine.createSpy('dateChange');
		component.dateChange.subscribe(changed);
		component.config.setOpen(true);
		expect(fixture.nativeElement.querySelector('.timeCaption').textContent.trim()).toBe('Vrijeme');
		expect(fixture.nativeElement.querySelector('.clockCell .fa-clock-o')).toBeNull();
		const spinner = fixture.nativeElement.querySelector('lc-time-spinner-compact');
		const before = Number(spinner.querySelector('.timeLabel').textContent.trim());
		spinner.querySelector('.selectbtn').click();
		const after = Number(spinner.querySelector('.timeLabel').textContent.trim());
		expect(after).toBe((before + 1) % 24);
		expect(changed).not.toHaveBeenCalled();
		expect(component.config.isOpen()).toBe(true);
	});

	it('previews and completes a linked range from October into November', () => {
		const picker = createLinkedRangePicker(new DateTime(2026, 9, 20, 0, 0, 0, 0, 'UTC'));
		dayButton(20).click();
		fixture.detectChanges();
		picker.nextMonth();
		fixture.detectChanges();

		dayButton(10).dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();
		expect(dayCell(1).classList.contains('range-preview')).toBe(true);
		expect(dayCell(10).classList.contains('range-preview')).toBe(true);
		expect(dayCell(11).classList.contains('range-preview')).toBe(false);

		picker.previousMonth();
		fixture.detectChanges();
		expect(dayCell(20).classList.contains('range-start')).toBe(true);
		expect(dayCell(21).classList.contains('range-preview')).toBe(true);
		expect(dayCell(31).classList.contains('range-preview')).toBe(true);
		expect(dayCell(19).classList.contains('range-preview')).toBe(false);
		picker.nextMonth();
		fixture.detectChanges();

		dayButton(10).click();
		fixture.detectChanges();
		expect(dayCell(10).classList.contains('range-end')).toBe(true);
		expect(dayCell(1).classList.contains('in-range')).toBe(true);
		expect(dayCell(9).classList.contains('in-range')).toBe(true);
		expect(dayCell(11).classList.contains('in-range')).toBe(false);
		expect(component.config.getValue().split('/').map(value =>
			dateAdapter.fromISOString(value).getDate()
		)).toEqual([20, 10]);

		picker.previousMonth();
		fixture.detectChanges();
		expect(dayCell(20).classList.contains('range-start')).toBe(true);
		expect(dayCell(21).classList.contains('in-range')).toBe(true);
		expect(dayCell(31).classList.contains('in-range')).toBe(true);
		expect(dayCell(19).classList.contains('in-range')).toBe(false);
	});

	it('normalizes a linked range when the earlier date is selected second', () => {
		const picker = createLinkedRangePicker(new DateTime(2026, 10, 10, 0, 0, 0, 0, 'UTC'));
		dayButton(10).click();
		fixture.detectChanges();
		picker.previousMonth();
		fixture.detectChanges();

		dayButton(20).dispatchEvent(new MouseEvent('mouseenter'));
		fixture.detectChanges();
		expect(dayCell(20).classList.contains('range-preview')).toBe(true);
		expect(dayCell(31).classList.contains('range-preview')).toBe(true);
		expect(dayCell(19).classList.contains('range-preview')).toBe(false);

		picker.nextMonth();
		fixture.detectChanges();
		expect(dayCell(1).classList.contains('range-preview')).toBe(true);
		expect(dayCell(9).classList.contains('range-preview')).toBe(true);
		expect(dayCell(10).classList.contains('range-start')).toBe(true);
		expect(dayCell(11).classList.contains('range-preview')).toBe(false);
		picker.previousMonth();
		fixture.detectChanges();

		dayButton(20).click();
		fixture.detectChanges();
		expect(component.config.getValue().split('/').map(value =>
			dateAdapter.fromISOString(value).getDate()
		)).toEqual([20, 10]);
		expect(dayCell(20).classList.contains('range-start')).toBe(true);
		expect(dayCell(21).classList.contains('in-range')).toBe(true);
		expect(dayCell(31).classList.contains('in-range')).toBe(true);
		expect(dayCell(19).classList.contains('in-range')).toBe(false);

		picker.nextMonth();
		fixture.detectChanges();
		expect(dayCell(1).classList.contains('in-range')).toBe(true);
		expect(dayCell(9).classList.contains('in-range')).toBe(true);
		expect(dayCell(10).classList.contains('range-end')).toBe(true);
		expect(dayCell(11).classList.contains('in-range')).toBe(false);
	});

	it('supports a same-month linked range and a one-day linked range', () => {
		createLinkedRangePicker(new DateTime(2026, 9, 20, 0, 0, 0, 0, 'UTC'));
		dayButton(20).click();
		fixture.detectChanges();
		dayButton(25).click();
		fixture.detectChanges();
		expect(dayCell(20).classList.contains('range-start')).toBe(true);
		expect(dayCell(22).classList.contains('in-range')).toBe(true);
		expect(dayCell(25).classList.contains('range-end')).toBe(true);

		createLinkedRangePicker(new DateTime(2026, 9, 20, 0, 0, 0, 0, 'UTC'));
		dayButton(20).click();
		fixture.detectChanges();
		dayButton(20).click();
		fixture.detectChanges();
		expect(dayCell(20).classList.contains('range-start')).toBe(true);
		expect(dayCell(20).classList.contains('range-end')).toBe(true);
		expect(fixture.nativeElement.querySelectorAll('.in-range').length).toBe(0);
	});

	it('keeps a linked range chronological across a year boundary', () => {
		const picker = createLinkedRangePicker(new DateTime(2026, 11, 20, 0, 0, 0, 0, 'UTC'));
		dayButton(20).click();
		fixture.detectChanges();
		picker.nextMonth();
		fixture.detectChanges();
		dayButton(10).click();
		fixture.detectChanges();

		const [start, end] = component.config.getValue().split('/')
			.map(value => dateAdapter.fromISOString(value));
		expect(start.getYear()).toBe(2026);
		expect(start.getMonth()).toBe(11);
		expect(start.getDate()).toBe(20);
		expect(end.getYear()).toBe(2027);
		expect(end.getMonth()).toBe(0);
		expect(end.getDate()).toBe(10);
		expect(dayCell(1).classList.contains('in-range')).toBe(true);
		expect(dayCell(9).classList.contains('in-range')).toBe(true);
		expect(dayCell(10).classList.contains('range-end')).toBe(true);
		expect(dayCell(11).classList.contains('in-range')).toBe(false);
	});
});
