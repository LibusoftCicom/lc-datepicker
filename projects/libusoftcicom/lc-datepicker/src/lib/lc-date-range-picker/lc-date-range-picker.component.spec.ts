import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';
import { CustomHeaderComponent } from '../../../../../../src/app/custom-datepicker/custom-header.component';
import { Panel } from '../base-date-picker.class';
import { ECalendarType, DateType } from '../enums';
import { DateTime } from '../date-time.class';
import { DATE_PICKER_FOOTER } from '../footer/footer-provider.class';
import { IDatePickerFooter } from '../footer/footer.component.interface';
import { DATE_PICKER_HEADER } from '../header/header-provider.class';
import { IDatePickerHeader } from '../header/lc-date-picker-header.interface';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { DatePickerConfig } from '../lc-date-picker-config';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { LCDayPickerComponent } from '../day-picker/day-picker.component';
import { LcDatePickerModule } from '../lc-date-picker.module';
import { LCDateRangePickerComponent } from './lc-date-range-picker.component';

@Component({ selector: 'test-range-header', standalone: true, template: '<tr><th>Custom header</th></tr>' })
class TestRangeHeaderComponent implements IDatePickerHeader {
  @Input() public control: LCDatePickerControl;
  @Input() public type: Panel;
}

@Component({ selector: 'test-range-footer', standalone: true, template: '<button (click)="confirm.emit()">Apply</button>' })
class TestRangeFooterComponent implements IDatePickerFooter {
  @Input() public control: LCDatePickerControl;
  @Output() public confirm = new EventEmitter<void>();
  @Output() public cancel = new EventEmitter<void>();
}

describe('LCDateRangePickerComponent compatibility', () => {
  let fixture: ComponentFixture<LCDateRangePickerComponent>;
  let component: LCDateRangePickerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LcDatePickerModule, TestRangeHeaderComponent, TestRangeFooterComponent, CustomHeaderComponent],
      providers: [{ provide: LCDatePickerAdapter, useClass: LuxonDateAdapterService }]
    });
  });

  function createPicker(): void {
    fixture = TestBed.createComponent(LCDateRangePickerComponent);
    component = fixture.componentInstance;
    const adapter = TestBed.inject(LCDatePickerAdapter);
    const start = adapter.today();
    component.config = new DatePickerConfig({
      value: adapter.toISOString(start) + '/' + adapter.toISOString(adapter.add(start, 1, 'day')),
      calendarType: ECalendarType.DateRange
    }, adapter);
    fixture.detectChanges();
  }

  function labels(): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.dateRangeLabel'),
      (element: HTMLElement) => element.textContent.trim());
  }

  it('updates events on both independent and linked panels without modifying the selected range', () => {
    const adapter = TestBed.inject(LCDatePickerAdapter);
    const start = new DateTime(2026, 0, 9, 0, 0, 0, 0, 'Europe/Zagreb');
    for (const rangeSelectionMode of ['independent', 'linked'] as const) {
      fixture = TestBed.createComponent(LCDateRangePickerComponent);
      component = fixture.componentInstance;
      component.config = new DatePickerConfig({
        value: adapter.toISOString(start) + '/' + adapter.toISOString(adapter.add(start, 1, 'day')),
        calendarType: ECalendarType.DateRange, rangeSelectionMode
      }, adapter);
      fixture.detectChanges();
      component.config.setOpen(true);
      const original = component.config.getValue();
      component.config.setDateEvents([{ date: adapter.toISOString(start), label: 'Holiday', metadata: { country: 'HR' } }]);
      fixture.detectChanges();
      const panels = Array.from(fixture.nativeElement.querySelectorAll('lc-day-picker')) as HTMLElement[];
      expect(panels.length).toBe(2);
      panels.forEach(panel => {
        expect(panel.querySelector('.has-events')?.getAttribute('title')).toContain('Holiday');
      });
      expect(component.config.getValue()).toBe(original);
      component.config.setDateEvents([]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.has-events')).toBeNull();
      expect(component.config.getValue()).toBe(original);
      fixture.destroy();
    }
  });

  it('preserves From/To and one OK button in the default implementation', () => {
    createPicker();
    expect(component.config.isLinkedRangeSelection()).toBe(false);
    expect(component.config.isSynchronizedRangeNavigation()).toBe(false);
    component.config.setOpen(true);
    expect(labels()).toEqual(['From', 'To']);
    expect(fixture.nativeElement.querySelectorAll('lc-active-calendar-panel').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('lc-day-picker').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('lc-calendar-grid table[aria-label="Choose date"]').length).toBe(2);
    const headerButtons = Array.from(
      fixture.nativeElement.querySelectorAll('lc-calendar-grid thead button')
    ) as HTMLButtonElement[];
    expect(headerButtons.length).toBe(10);
    expect(headerButtons.every(button => button.type === 'button' && !!button.getAttribute('aria-label'))).toBe(true);
    const nextButtons = Array.from(
      fixture.nativeElement.querySelectorAll('.calendar .pullRight')
    ) as HTMLElement[];
    expect(nextButtons.length).toBe(2);
    expect(nextButtons.every(button => getComputedStyle(button).float === 'right')).toBe(true);
    const dayButtons = Array.from(
      fixture.nativeElement.querySelectorAll(
        'lc-calendar-grid table.dayPicker tbody tr:not(.days) lc-day-picker-button button'
      )
    ) as HTMLButtonElement[];
    expect(dayButtons.length).toBeGreaterThan(0);
    expect(dayButtons.every(button => {
      const cell = button.closest('td') as HTMLTableCellElement;
      return button.getBoundingClientRect().height >= cell.getBoundingClientRect().height - 3;
    })).toBe(true);
    const buttons = fixture.nativeElement.querySelectorAll('lc-confirm-button button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent.trim()).toBe('OK');
  });

  it('keeps default From and To calendars independently navigable', () => {
    const adapter = TestBed.inject(LCDatePickerAdapter);
    const fromDate = new DateTime(2026, 11, 10, 0, 0, 0, 0, 'UTC');
    const toDate = new DateTime(2027, 0, 20, 0, 0, 0, 0, 'UTC');
    fixture = TestBed.createComponent(LCDateRangePickerComponent);
    component = fixture.componentInstance;
    component.config = new DatePickerConfig({
      value: adapter.toISOString(fromDate) + '/' + adapter.toISOString(toDate),
      calendarType: ECalendarType.DateRange
    }, adapter);
    fixture.detectChanges();
    component.config.setOpen(true);

    const dayPickers = fixture.debugElement.queryAll(By.directive(LCDayPickerComponent))
      .map(element => element.componentInstance as LCDayPickerComponent);
    const fromControl = component.config.getControl(DateType.FROM);
    const toControl = component.config.getControl(DateType.TO);
    const toValue = adapter.toISOString(toControl.getValue());

    dayPickers[0].nextMonth();
    expect(fromControl.getValue().getMonth()).toBe(0);
    expect(fromControl.getValue().getYear()).toBe(2027);
    expect(toControl.getValue().getMonth()).toBe(0);
    expect(toControl.getValue().getYear()).toBe(2027);
    expect(adapter.toISOString(toControl.getValue())).toBe(toValue);

    dayPickers[1].previousMonth();
    expect(fromControl.getValue().getMonth()).toBe(0);
    expect(fromControl.getValue().getYear()).toBe(2027);
    expect(toControl.getValue().getMonth()).toBe(11);
    expect(toControl.getValue().getYear()).toBe(2026);
  });

  it('preserves configured labels and header labels across panels', () => {
    createPicker();
    component.config.setLabels({ fromLabel: 'Start', toLabel: 'End', confirmLabel: 'Confirm' });
    component.config.setOpen(true);
    component.config.getControl(DateType.FROM).setPanel(Panel.Month);
    component.config.getControl(DateType.TO).setPanel(Panel.Year);
    expect(labels()).toEqual(['Start', 'End']);
    expect(fixture.nativeElement.querySelector('lc-confirm-button button').textContent.trim()).toBe('Confirm');
  });

  it('preserves the default theme color when a range panel changes to month', () => {
    createPicker();
    component.config.setTheme({ primaryColor: '#52616f', fontColor: '#ffffff' });
    component.config.setOpen(true);
    component.config.getControl(DateType.FROM).setPanel(Panel.Month);
    const header = fixture.nativeElement.querySelector('lc-month-picker thead');
    expect(getComputedStyle(header).backgroundColor).toBe('rgb(82, 97, 111)');
    expect(labels()).toEqual(['From', 'To']);
  });

  it('keeps custom range header colors in month and year panels', () => {
    TestBed.overrideProvider(DATE_PICKER_HEADER, { useValue: CustomHeaderComponent });
    createPicker();
    fixture.nativeElement.style.setProperty('--lc-datepicker-header-background', '#ffffff');
    fixture.nativeElement.style.setProperty('--lc-datepicker-header-color', '#123456');
    component.config.setOpen(true);
    component.config.getControl(DateType.FROM).setPanel(Panel.Month);
    component.config.getControl(DateType.TO).setPanel(Panel.Year);
    component.config.getControl(DateType.FROM).nextPage();
    const headers = Array.from(fixture.nativeElement.querySelectorAll('thead')) as HTMLElement[];
    expect(headers.length).toBe(2);
    headers.forEach(header => {
      expect(getComputedStyle(header).backgroundColor).toBe('rgb(255, 255, 255)');
      expect(getComputedStyle(header.querySelector('.period button')).color).toBe('rgb(18, 52, 86)');
    });
  });

  it('emits the range exactly once and closes when OK is clicked', () => {
    createPicker();
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    component.config.setOpen(true);
    const value = component.config.getValue();
    fixture.nativeElement.querySelector('lc-confirm-button button').click();
    expect(changed).toHaveBeenCalledOnceWith(value);
    expect(component.config.isOpen()).toBe(false);
  });

  it('preserves default selection, confirm and open event order', () => {
    createPicker();
    const events: string[] = [];
    component.openedChange.subscribe(open => events.push(`open:${open}`));
    component.dateChange.subscribe(value => events.push(`date:${value}`));
    component.config.setOpen(true);

    const fromPicker = fixture.debugElement.queryAll(By.directive(LCDayPickerComponent))[0]
      .componentInstance as LCDayPickerComponent;
    const day = Array.from(
      fixture.nativeElement.querySelectorAll('lc-day-picker-button button') as NodeListOf<HTMLButtonElement>
    ).find(button => !button.disabled && button.textContent.trim() === '15') as HTMLButtonElement;
    day.click();
    fixture.detectChanges();
    expect(events).toEqual(['open:true']);

    const selectedValue = component.config.getValue();
    component.confirm();

    expect(events).toEqual([`open:true`, `date:${selectedValue}`, 'open:false']);
    expect(fromPicker.control.getValue().getDate()).toBe(15);
  });

  it('restores both range endpoints when an explicit selection is cancelled', () => {
    const adapter = TestBed.inject(LCDatePickerAdapter);
    const start = adapter.today();
    fixture = TestBed.createComponent(LCDateRangePickerComponent);
    component = fixture.componentInstance;
    component.config = new DatePickerConfig({
      value: adapter.toISOString(start) + '/' + adapter.toISOString(adapter.add(start, 1, 'day')),
      calendarType: ECalendarType.DateRange,
      selectionMode: 'explicit'
    }, adapter);
    fixture.detectChanges();
    component.config.setOpen(true);
    const originalValue = component.config.getValue();
    component.config.getControl(DateType.FROM).setValue(adapter.add(start, 2, 'day'));
    component.config.getControl(DateType.TO).setValue(adapter.add(start, 3, 'day'));

    component.setOpen(false);

    expect(component.config.getValue()).toBe(originalValue);
  });

  it('keeps linked selection panels independently navigable by default', () => {
    const adapter = TestBed.inject(LCDatePickerAdapter);
    const start = new DateTime(2026, 2, 10, 0, 0, 0, 0, 'UTC');
    const end = new DateTime(2026, 4, 20, 0, 0, 0, 0, 'UTC');
    fixture = TestBed.createComponent(LCDateRangePickerComponent);
    component = fixture.componentInstance;
    component.config = new DatePickerConfig({
      value: adapter.toISOString(start) + '/' + adapter.toISOString(end),
      calendarType: ECalendarType.DateRange,
      rangeSelectionMode: 'linked'
    }, adapter);
    fixture.detectChanges();
    component.config.setOpen(true);

    const dayPickers = fixture.debugElement.queryAll(By.directive(LCDayPickerComponent))
      .map(element => element.componentInstance as LCDayPickerComponent);
    expect(dayPickers.length).toBe(2);
    expect(dayPickers[0].control.getValue().getMonth()).toBe(2);
    expect(dayPickers[1].control.getValue().getMonth()).toBe(4);
    const originalValue = component.config.getValue();

    dayPickers[0].nextMonth();
    expect(dayPickers[0].control.getValue().getMonth()).toBe(3);
    expect(dayPickers[1].control.getValue().getMonth()).toBe(4);

    dayPickers[0].previousMonth();
    expect(dayPickers[0].control.getValue().getMonth()).toBe(2);
    expect(dayPickers[1].control.getValue().getMonth()).toBe(4);

    dayPickers[1].nextMonth();
    expect(dayPickers[0].control.getValue().getMonth()).toBe(2);
    expect(dayPickers[1].control.getValue().getMonth()).toBe(5);

    dayPickers[1].previousMonth();
    expect(dayPickers[0].control.getValue().getMonth()).toBe(2);
    expect(dayPickers[1].control.getValue().getMonth()).toBe(4);
    expect(component.config.getValue()).toBe(originalValue);
  });

  it('synchronizes month navigation only when explicitly configured', () => {
    const adapter = TestBed.inject(LCDatePickerAdapter);
    const start = new DateTime(2026, 2, 10, 0, 0, 0, 0, 'UTC');
    const end = new DateTime(2026, 4, 20, 0, 0, 0, 0, 'UTC');
    fixture = TestBed.createComponent(LCDateRangePickerComponent);
    component = fixture.componentInstance;
    component.config = new DatePickerConfig({
      value: adapter.toISOString(start) + '/' + adapter.toISOString(end),
      calendarType: ECalendarType.DateRange,
      rangeSelectionMode: 'linked',
      rangeNavigationMode: 'synchronized'
    }, adapter);
    fixture.detectChanges();
    component.config.setOpen(true);

    const dayPickers = fixture.debugElement.queryAll(By.directive(LCDayPickerComponent))
      .map(element => element.componentInstance as LCDayPickerComponent);
    dayPickers[0].nextMonth();
    expect(dayPickers[0].control.getValue().getMonth()).toBe(3);
    expect(dayPickers[1].control.getValue().getMonth()).toBe(5);

    dayPickers[1].previousMonth();
    expect(dayPickers[0].control.getValue().getMonth()).toBe(2);
    expect(dayPickers[1].control.getValue().getMonth()).toBe(4);
  });

  it('starts a linked range draft, swaps reversed endpoints and confirms once', () => {
    const adapter = TestBed.inject(LCDatePickerAdapter);
    const start = new DateTime(2026, 2, 5, 0, 0, 0, 0, 'UTC');
    const end = new DateTime(2026, 3, 7, 0, 0, 0, 0, 'UTC');
    fixture = TestBed.createComponent(LCDateRangePickerComponent);
    component = fixture.componentInstance;
    component.config = new DatePickerConfig({
      value: adapter.toISOString(start) + '/' + adapter.toISOString(end),
      calendarType: ECalendarType.DateRange,
      disabledDates: [adapter.toISOString(adapter.setParts(start, { date: 15 }))],
      rangeSelectionMode: 'linked'
    }, adapter);
    fixture.detectChanges();
    component.config.setOpen(true);
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    const pickers = Array.from(fixture.nativeElement.querySelectorAll('lc-day-picker')) as HTMLElement[];
    const enabledDay = (picker: HTMLElement, day: string): HTMLButtonElement => {
      const button = Array.from(
        picker.querySelectorAll('lc-day-picker-button button') as NodeListOf<HTMLButtonElement>
      )
        .find(element => !element.disabled && element.textContent.trim() === day) as HTMLButtonElement;
      return button;
    };

    enabledDay(pickers[1], '20').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('lc-confirm-button button').disabled).toBe(true);
    expect(changed).not.toHaveBeenCalled();

    const disabledEndpoint = Array.from(
      pickers[0].querySelectorAll('lc-day-picker-button button') as NodeListOf<HTMLButtonElement>
    ).find(button => button.textContent.trim() === '15') as HTMLButtonElement;
    expect(disabledEndpoint.disabled).toBe(true);
    disabledEndpoint.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('lc-confirm-button button').disabled).toBe(true);

    const previewDate = enabledDay(pickers[0], '10');
    previewDate.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.range-preview').length).toBeGreaterThan(0);
    previewDate.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.range-preview').length).toBe(0);
    previewDate.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('lc-confirm-button button').disabled).toBe(false);
    expect(component.config.getValue()).toBe(
      adapter.toISOString(adapter.setParts(adapter.fromISOString(adapter.toISOString(start)), { date: 10, hour: 0 })) + '/' +
      adapter.toISOString(adapter.setParts(adapter.fromISOString(adapter.toISOString(start)), { month: 3, date: 20, hour: 0 }))
    );
    expect(changed).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('.range-start').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.range-end').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.in-range').length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('.range-start button').getAttribute('aria-pressed')).toBe('true');
    expect(
      Array.from(pickers[0].querySelectorAll('lc-day-picker-button button') as NodeListOf<HTMLButtonElement>)
        .find(button => button.textContent.trim() === '15').disabled
    ).toBe(true);

    const dayPickers = fixture.debugElement.queryAll(By.directive(LCDayPickerComponent))
      .map(element => element.componentInstance as LCDayPickerComponent);
    const selectedRange = component.config.getValue();
    dayPickers[0].nextMonth();
    fixture.detectChanges();
    expect(component.config.getValue()).toBe(selectedRange);
    expect(fixture.nativeElement.querySelectorAll('.range-end').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.in-range').length).toBeGreaterThan(0);

    fixture.nativeElement.querySelector('lc-confirm-button button').click();
    expect(changed).toHaveBeenCalledOnceWith(component.config.getValue());
    expect(component.config.isOpen()).toBe(false);
  });

  it('accepts a one-day linked range', () => {
    const adapter = TestBed.inject(LCDatePickerAdapter);
    const start = new DateTime(2026, 2, 5, 0, 0, 0, 0, 'UTC');
    fixture = TestBed.createComponent(LCDateRangePickerComponent);
    component = fixture.componentInstance;
    component.config = new DatePickerConfig({
      value: adapter.toISOString(start) + '/' + adapter.toISOString(start),
      calendarType: ECalendarType.DateRange,
      rangeSelectionMode: 'linked'
    }, adapter);
    fixture.detectChanges();
    component.config.setOpen(true);

    const pickers = Array.from(fixture.nativeElement.querySelectorAll('lc-day-picker')) as HTMLElement[];
    const dayButton = Array.from(
      pickers[0].querySelectorAll('lc-day-picker-button button') as NodeListOf<HTMLButtonElement>
    ).find(button => !button.disabled && button.textContent.trim() === '12') as HTMLButtonElement;
    dayButton.click();
    fixture.detectChanges();
    const sameDayButton = Array.from(
      pickers[1].querySelectorAll('lc-day-picker-button button') as NodeListOf<HTMLButtonElement>
    ).find(button => !button.disabled && button.textContent.trim() === '12') as HTMLButtonElement;
    sameDayButton.click();
    fixture.detectChanges();

    const selectedStart = component.config.getControl(DateType.FROM).getValue();
    const selectedEnd = component.config.getControl(DateType.TO).getValue();
    const selected = adapter.toISOString(selectedStart);
    expect(selectedStart.getDate()).toBe(12);
    expect(adapter.toISOString(selectedEnd)).toBe(selected);
    expect(component.config.getValue()).toBe(selected + '/' + selected);
    expect(component.config.getControl(DateType.FROM).isRangeSelectionComplete()).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.range-start').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.range-end').length).toBe(2);
  });

  it('restores the confirmed value when a linked range draft is cancelled', () => {
    const adapter = TestBed.inject(LCDatePickerAdapter);
    const start = new DateTime(2026, 2, 5, 0, 0, 0, 0, 'UTC');
    const end = new DateTime(2026, 2, 7, 0, 0, 0, 0, 'UTC');
    fixture = TestBed.createComponent(LCDateRangePickerComponent);
    component = fixture.componentInstance;
    component.config = new DatePickerConfig({
      value: adapter.toISOString(start) + '/' + adapter.toISOString(end),
      calendarType: ECalendarType.DateRange,
      rangeSelectionMode: 'linked'
    }, adapter);
    fixture.detectChanges();
    component.config.setOpen(true);
    const originalValue = component.config.getValue();
    const pickers = Array.from(fixture.nativeElement.querySelectorAll('lc-day-picker')) as HTMLElement[];
    const selectDay = (picker: HTMLElement, day: string): void => {
      const date = Array.from(
        picker.querySelectorAll('lc-day-picker-button button') as NodeListOf<HTMLButtonElement>
      ).find(button => !button.disabled && button.textContent.trim() === day) as HTMLButtonElement;
      date.click();
    };
    selectDay(pickers[1], '20');
    selectDay(pickers[0], '10');
    expect(component.config.getValue()).not.toBe(originalValue);

    component.setOpen(false);

    expect(component.config.getValue()).toBe(originalValue);
    expect(component.config.getControl(DateType.FROM).isRangeSelectionComplete()).toBe(true);
  });

  it('does not impose default labels on a custom header and keeps the default footer', () => {
    TestBed.overrideProvider(DATE_PICKER_HEADER, { useValue: TestRangeHeaderComponent });
    createPicker();
    component.config.setOpen(true);
    expect(labels()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('Custom header');
    expect(fixture.nativeElement.querySelectorAll('lc-confirm-button button').length).toBe(1);
  });

  it('keeps default labels when only the footer is replaced', () => {
    TestBed.overrideProvider(DATE_PICKER_FOOTER, { useValue: TestRangeFooterComponent });
    createPicker();
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    component.config.setOpen(true);
    expect(labels()).toEqual(['From', 'To']);
    expect(fixture.nativeElement.querySelector('lc-confirm-button')).toBeNull();
    fixture.nativeElement.querySelector('test-range-footer button').click();
    expect(changed).toHaveBeenCalledTimes(1);
    expect(component.config.isOpen()).toBe(false);
  });
});