import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';
import { CustomHeaderComponent } from '../../../../../../src/app/custom-datepicker/custom-header.component';
import { CustomFooterComponent } from '../../../../../../src/app/custom-datepicker/custom-footer.component';
import { DateTime } from '../date-time.class';
import { ICalendarItem } from '../base-date-picker.class';
import { LCCalendarGridComponent } from '../calendar-grid/calendar-grid.component';
import { LCCalendarCellComponent } from '../calendar-cell/calendar-cell.component';
import { DayPicker } from '../day-picker/day-picker.class';
import { LCDayPickerButtonComponent } from '../day-picker/day-picker-button.component';
import { DateType, ECalendarType } from '../enums';
import { DATE_PICKER_HEADER } from '../header/header-provider.class';
import { DATE_PICKER_FOOTER } from '../footer/footer-provider.class';
import { LCDatePickerFooterComponent } from '../footer/footer.component';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { DatePickerConfig } from '../lc-date-picker-config';
import { IDatePickerConfiguration, LCDatePickerControl } from '../lc-date-picker-control';
import { LcDatePickerModule } from '../lc-date-picker.module';
import { LCDatePickerComponent } from './lc-date-picker.component';
import { LCDateRangePickerComponent } from '../lc-date-range-picker/lc-date-range-picker.component';

describe('Opt-in custom picker views', () => {
  let adapter: LCDatePickerAdapter;
  let fixture: ComponentFixture<LCDatePickerComponent>;
  let component: LCDatePickerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LcDatePickerModule, CustomHeaderComponent, CustomFooterComponent],
      providers: [{ provide: LCDatePickerAdapter, useClass: LuxonDateAdapterService }]
    });
    TestBed.overrideProvider(DATE_PICKER_HEADER, { useValue: CustomHeaderComponent });
    TestBed.overrideProvider(DATE_PICKER_FOOTER, { useValue: CustomFooterComponent });
    adapter = TestBed.inject(LCDatePickerAdapter);
  });

  function createPicker(calendarType: ECalendarType, options: Partial<IDatePickerConfiguration> = {}): void {
    fixture = TestBed.createComponent(LCDatePickerComponent);
    component = fixture.componentInstance;
    component.config = new DatePickerConfig({
      value: adapter.toISOString(new DateTime(2026, 0, 9, 13, 30, 0, 0, 'Europe/Zagreb')),
      timezone: 'Europe/Zagreb', localization: 'en-gb', calendarType,
      selectionMode: 'explicit', labels: { confirmLabel: 'Apply', timeLabel: 'Time' }, ...options
    }, adapter);
    fixture.detectChanges();
    component.config.setOpen(true);
  }

  it('joins range cells and rounds only the boundaries of each visible row segment', () => {
    const grid = new LCCalendarGridComponent();
    grid.kind = 'day';
    const row: ICalendarItem[] = [
      { value: 8 }, { value: 9, rangeStart: true },
      { value: 10, inRange: true }, { value: 11, rangeEnd: true }, { value: 12 }
    ];
    expect(grid.isRangeBoundary(row, 1, -1)).toBe(true);
    expect(grid.isRangeBoundary(row, 1, 1)).toBe(false);
    expect(grid.isRangeBoundary(row, 2, -1)).toBe(false);
    expect(grid.isRangeBoundary(row, 2, 1)).toBe(false);
    expect(grid.isRangeBoundary(row, 3, 1)).toBe(true);
    expect(grid.isRangeCell(row[0])).toBe(false);
    const continuation: ICalendarItem[] = [{ value: 12, inRange: true }, { value: 13, rangePreview: true }];
    expect(grid.isRangeBoundary(continuation, 0, -1)).toBe(true);
    expect(grid.isRangeBoundary(continuation, 1, 1)).toBe(true);
    const single: ICalendarItem[] = [{ value: 9, rangeStart: true, rangeEnd: true }];
    expect(grid.isRangeBoundary(single, 0, -1)).toBe(true);
    expect(grid.isRangeBoundary(single, 0, 1)).toBe(true);
    grid.kind = 'month';
    expect(grid.isRangeCell(row[1])).toBe(false);
  });

  it('uses shared range-cell and band styles in linked single and dual calendars', () => {
    const start = adapter.toISOString(new DateTime(2026, 0, 8, 0, 0, 0, 0, 'Europe/Zagreb'));
    const end = adapter.toISOString(new DateTime(2026, 0, 16, 0, 0, 0, 0, 'Europe/Zagreb'));
    const tokens = {
      '--lc-datepicker-range-band-display': 'block',
      '--lc-datepicker-range-selection-background': 'rgb(12, 34, 56)',
      '--lc-datepicker-range-endpoint-background': 'rgb(78, 90, 12)',
      '--lc-datepicker-cell-size': '28px'
    };

    createPicker(ECalendarType.Date, { value: `${start}/${end}`, rangeSelectionMode: 'linked' });
    Object.entries(tokens).forEach(([name, value]) => fixture.nativeElement.style.setProperty(name, value));
    component.config.setOpen(true);
    fixture.detectChanges();

    const singleStart = fixture.nativeElement.querySelector('.day-cell.range-start') as HTMLElement;
    const singleEnd = fixture.nativeElement.querySelector('.day-cell.range-end') as HTMLElement;
    const singleBand = fixture.nativeElement.querySelector('td.range-band') as HTMLElement;
    const singleBandStart = fixture.nativeElement.querySelector('td.range-band-start') as HTMLElement;
    const singleBandEnd = fixture.nativeElement.querySelector('td.range-band-end') as HTMLElement;
    expect(singleStart).not.toBeNull();
    expect(singleEnd).not.toBeNull();
    expect(singleBandStart).not.toBeNull();
    expect(singleBandEnd).not.toBeNull();
    expect(getComputedStyle(singleStart).backgroundColor).toBe('rgb(78, 90, 12)');
    expect(getComputedStyle(singleEnd).backgroundColor).toBe('rgb(78, 90, 12)');
    expect(getComputedStyle(singleBand, '::before').display).toBe('block');
    expect(getComputedStyle(singleBand, '::before').height).toBe('28px');
    expect(getComputedStyle(singleBand, '::before').backgroundColor).toBe('rgb(12, 34, 56)');
    expect(getComputedStyle(singleBandStart, '::before').borderTopLeftRadius).toBe('28px');
    expect(getComputedStyle(singleBandEnd, '::before').borderTopRightRadius).toBe('28px');
    const singleStartBackground = getComputedStyle(singleStart).backgroundColor;
    const singleEndBackground = getComputedStyle(singleEnd).backgroundColor;
    const singleBandHeight = getComputedStyle(singleBand, '::before').height;
    const singleBandBackground = getComputedStyle(singleBand, '::before').backgroundColor;

    const dualFixture = TestBed.createComponent(LCDateRangePickerComponent);
    const dualConfig = new DatePickerConfig({
      value: `${start}/${end}`,
      timezone: 'Europe/Zagreb',
      calendarType: ECalendarType.DateRange,
      rangeSelectionMode: 'linked'
    }, adapter);
    dualFixture.componentInstance.config = dualConfig;
    dualFixture.detectChanges();
    dualConfig.setOpen(true);
    dualFixture.detectChanges();
    Object.entries(tokens).forEach(([name, value]) =>
      dualFixture.nativeElement.style.setProperty(name, value));

    const dualStart = dualFixture.nativeElement.querySelector('.day-cell.range-start') as HTMLElement;
    const dualEnd = dualFixture.nativeElement.querySelector('.day-cell.range-end') as HTMLElement;
    const dualBand = dualFixture.nativeElement.querySelector('td.range-band') as HTMLElement;
    const dualBandStart = dualFixture.nativeElement.querySelector('td.range-band-start') as HTMLElement;
    const dualBandEnd = dualFixture.nativeElement.querySelector('td.range-band-end') as HTMLElement;
    expect(dualFixture.nativeElement.querySelectorAll('lc-day-picker').length).toBe(2);
    expect(dualStart).not.toBeNull();
    expect(dualEnd).not.toBeNull();
    expect(dualBandStart).not.toBeNull();
    expect(dualBandEnd).not.toBeNull();
    expect(getComputedStyle(dualStart).backgroundColor).toBe(singleStartBackground);
    expect(getComputedStyle(dualEnd).backgroundColor).toBe(singleEndBackground);
    expect(getComputedStyle(dualBand, '::before').height).toBe(singleBandHeight);
    expect(getComputedStyle(dualBand, '::before').backgroundColor)
      .toBe(singleBandBackground);
    expect(getComputedStyle(dualBandStart, '::before').borderTopLeftRadius).toBe('28px');
    expect(getComputedStyle(dualBandEnd, '::before').borderTopRightRadius).toBe('28px');

    dualFixture.destroy();
    fixture.destroy();
  });

  it('keeps independent range endpoints as separate active dates', () => {
    const start = adapter.toISOString(new DateTime(2026, 0, 8, 0, 0, 0, 0, 'Europe/Zagreb'));
    const end = adapter.toISOString(new DateTime(2026, 0, 16, 0, 0, 0, 0, 'Europe/Zagreb'));
    const rangeFixture = TestBed.createComponent(LCDateRangePickerComponent);
    const config = new DatePickerConfig({
      value: `${start}/${end}`,
      timezone: 'Europe/Zagreb',
      calendarType: ECalendarType.DateRange,
      rangeSelectionMode: 'independent'
    }, adapter);
    rangeFixture.componentInstance.config = config;
    rangeFixture.detectChanges();
    config.setOpen(true);
    rangeFixture.detectChanges();
    rangeFixture.nativeElement.style.setProperty('--lc-datepicker-selected-background', 'rgb(12, 34, 56)');
    rangeFixture.nativeElement.style.setProperty('--lc-datepicker-range-endpoint-background', 'rgb(78, 90, 12)');
    rangeFixture.detectChanges();

    const activeCells = rangeFixture.nativeElement.querySelectorAll('.day-cell.active') as NodeListOf<HTMLElement>;
    expect(activeCells.length).toBe(2);
    expect(Array.from(activeCells).every(cell =>
      getComputedStyle(cell).backgroundColor === 'rgb(12, 34, 56)')).toBe(true);
    expect(rangeFixture.nativeElement.querySelectorAll('.day-cell.range-start, .day-cell.range-end').length).toBe(0);
    expect(rangeFixture.nativeElement.querySelectorAll('td.range-band').length).toBe(0);

    rangeFixture.destroy();
  });

  it('renders event metadata on disabled days and updates independent and linked calendars without changing selection', () => {
    const eventDate = adapter.toISOString(new DateTime(2026, 0, 10, 13, 30, 0, 0, 'Europe/Zagreb'));
    for (const rangeSelectionMode of ['independent', 'linked'] as const) {
      createPicker(ECalendarType.Date, {
        rangeSelectionMode, disabledDates: [eventDate],
        dateEvents: [
          { date: eventDate, label: 'Holiday', description: 'Public holiday', metadata: { country: 'HR', workingDay: false } },
          { date: eventDate, label: 'Office closed', metadata: { office: { name: 'Zagreb' } } }
        ]
      });
      const changed = jasmine.createSpy('dateChange');
      component.dateChange.subscribe(changed);
      const original = component.config.getValue();
      const cell = fixture.nativeElement.querySelector('.has-events') as HTMLElement;
      expect(cell).not.toBeNull();
      expect(fixture.nativeElement.querySelectorAll('.has-events').length).toBe(1);
      expect(cell.textContent.trim()).toBe('10');
      expect(cell.classList.contains('disabled')).toBe(true);
      expect(cell.title).toContain('Holiday\nPublic holiday');
      expect(cell.title).toContain('country: HR');
      expect(cell.title).toContain('workingDay: false');
      expect(cell.title).toContain('Office closed');
      expect(cell.title).toContain('office: {"name":"Zagreb"}');
      const button = cell.querySelector('button');
      expect(button.disabled).toBe(true);
      expect(button.getAttribute('aria-description')).toBe(cell.title);
      button.click();
      expect(component.config.getValue()).toBe(original);
      component.config.setDateEvents([]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.has-events')).toBeNull();
      expect(component.config.getValue()).toBe(original);
      expect(changed).not.toHaveBeenCalled();
      fixture.destroy();
    }
  });

  it('indexes multiple events by local calendar day and rebuilds the index on replacement', () => {
    const localDate = new DateTime(2026, 0, 9, 0, 0, 0, 0, 'Europe/Zagreb');
    const nextLocalDate = new DateTime(2026, 0, 10, 0, 0, 0, 0, 'Europe/Zagreb');
    const control = new LCDatePickerControl({
      value: adapter.toISOString(localDate),
      timezone: 'Europe/Zagreb',
      dateEvents: [
        { date: '2026-01-09', label: 'Holiday' },
        { date: '2026-01-08T23:00:00.000Z', label: 'Evening event' }
      ]
    }, adapter);

    expect(control.getDateEventsForDay(localDate).map(event => event.label))
      .toEqual(['Holiday', 'Evening event']);
    control.setDateEvents([{ date: '2026-01-10', label: 'Replacement' }]);
    expect(control.getDateEventsForDay(localDate)).toEqual([]);
    expect(control.getDateEventsForDay(nextLocalDate).map(event => event.label)).toEqual(['Replacement']);
  });

  it('keeps event dots independent of default, range, active, today and disabled states', () => {
    const control = new LCDatePickerControl({ value: adapter.toISOString(new DateTime(2026, 0, 9, 0, 0, 0, 0, 'UTC')) }, adapter);
    for (const state of ['default', 'range', 'active', 'today']) {
      for (const disabled of [false, true]) {
        const cellFixture = TestBed.createComponent(LCCalendarCellComponent);
        const cell = cellFixture.componentInstance;
        cell.control = control;
        cell.kind = 'day';
        cell.item = {
          value: 9, disabled, active: state === 'active', current: state === 'today', inRange: state === 'range',
          events: [{ date: '2026-01-09T00:00:00.000Z', label: 'Event' }]
        };
        cellFixture.detectChanges();
        const element = cellFixture.nativeElement.querySelector('.day-cell') as HTMLElement;
        expect(element.classList.contains('has-events')).toBe(true);
        expect(getComputedStyle(element, '::after').display).toBe('block');
        expect(element.querySelector('button').disabled).toBe(disabled);
        cellFixture.componentRef.setInput('item', { ...cell.item, events: [] });
        cellFixture.detectChanges();
        expect(element.classList.contains('has-events')).toBe(false);
        expect(element.getAttribute('title')).toBeNull();
        cellFixture.destroy();
      }
    }
  });

  it('round-trips a linked range through the single-date configuration and restores cancelled edits', () => {
    const start = adapter.toISOString(new DateTime(2026, 0, 9, 0, 0, 0, 0, 'Europe/Zagreb'));
    const end = adapter.toISOString(new DateTime(2026, 0, 15, 0, 0, 0, 0, 'Europe/Zagreb'));
    const config = new DatePickerConfig({
      value: start + '/' + end, timezone: 'Europe/Zagreb',
      calendarType: ECalendarType.Date, rangeSelectionMode: 'linked'
    }, adapter);
    expect(config.getValue()).toBe(start + '/' + end);
    config.setOpen(true);
    config.getControl().setValue(new DateTime(2026, 0, 10, 0, 0, 0, 0, 'Europe/Zagreb'));
    config.setOpen(false);
    expect(config.getValue()).toBe(start + '/' + end);
    config.setValue(end);
    expect(config.getValue()).toBe(end + '/' + end);
  });

  function clickRangeDay(day: number): void {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll(
      'lc-day-picker-button:not(.outside-month) button'
    )) as HTMLButtonElement[];
    buttons.find(button => !button.disabled && button.textContent.trim() === String(day)).click();
    fixture.detectChanges();
  }

  it('selects a linked range in one calendar and commits once on the second immediate click', () => {
    createPicker(ECalendarType.Date, { rangeSelectionMode: 'linked', selectionMode: 'immediate' });
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    expect(fixture.nativeElement.querySelectorAll('lc-day-picker').length).toBe(1);
    clickRangeDay(20);
    expect(component.config.isOpen()).toBe(true);
    expect(component.config.getControl().isRangeSelectionComplete()).toBe(false);
    expect(changed).not.toHaveBeenCalled();
    clickRangeDay(10);
    expect(component.config.isOpen()).toBe(false);
    expect(changed).toHaveBeenCalledOnceWith(component.config.getValue());
    expect(component.config.getControl().getValue().getDate()).toBe(10);
    expect(component.config.getControl(DateType.TO).getValue().getDate()).toBe(20);
  });

  it('keeps an explicit linked draft open, previews it and discards cancellation', () => {
    createPicker(ECalendarType.Date, { rangeSelectionMode: 'linked' });
    const original = component.config.getValue();
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    clickRangeDay(10);
    component.config.confirm();
    expect(component.config.isOpen()).toBe(true);
    expect(changed).not.toHaveBeenCalled();
    const button = Array.from(fixture.nativeElement.querySelectorAll('lc-day-picker-button button'))
      .find((element: HTMLButtonElement) => element.textContent.trim() === '20') as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.range-preview').length).toBeGreaterThan(0);
    button.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.in-range').length).toBeGreaterThan(0);
    expect(changed).not.toHaveBeenCalled();
    component.config.setOpen(false);
    expect(component.config.getValue()).toBe(original);
    component.config.setOpen(true);
    expect(component.config.getControl().isRangeSelectionComplete()).toBe(true);
    clickRangeDay(15);
    clickRangeDay(15);
    component.confirm();
    expect(changed).toHaveBeenCalledOnceWith(component.config.getValue());
    expect(component.config.isOpen()).toBe(false);
  });

  it('renders a cancel action in the custom footer and restores an incomplete draft', () => {
    createPicker(ECalendarType.Date, { rangeSelectionMode: 'linked' });
    const original = component.config.getValue();
    clickRangeDay(10);
    const cancel = fixture.nativeElement.querySelector('app-custom-datepicker-footer .cancel') as HTMLButtonElement;
    expect(cancel).not.toBeNull();
    cancel.click();
    fixture.detectChanges();
    expect(component.config.isOpen()).toBe(false);
    expect(component.config.getValue()).toBe(original);
  });

  it('supports the default footer, disabled endpoints, a third click and navigation without changing endpoints', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [LcDatePickerModule],
      providers: [{ provide: LCDatePickerAdapter, useClass: LuxonDateAdapterService }]
    });
    TestBed.overrideProvider(DATE_PICKER_FOOTER, { useValue: LCDatePickerFooterComponent });
    adapter = TestBed.inject(LCDatePickerAdapter);
    createPicker(ECalendarType.Date, {
      rangeSelectionMode: 'linked',
      disabledDates: [adapter.toISOString(new DateTime(2026, 0, 15, 0, 0, 0, 0, 'Europe/Zagreb'))]
    });
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    const original = component.config.getValue();
    const disabled = Array.from(fixture.nativeElement.querySelectorAll('lc-day-picker-button button'))
      .find((element: HTMLButtonElement) => element.textContent.trim() === '15') as HTMLButtonElement;
    expect(disabled.disabled).toBe(true);
    disabled.click();
    expect(component.config.getValue()).toBe(original);
    clickRangeDay(10);
    expect(fixture.nativeElement.querySelector('lc-confirm-button button').disabled).toBe(true);
    clickRangeDay(20);
    expect(fixture.nativeElement.querySelector('lc-confirm-button button').disabled).toBe(false);
    const selected = component.config.getValue();
    component.config.nextPage();
    fixture.detectChanges();
    expect(component.config.getValue()).toBe(selected);
    component.config.previousPage();
    fixture.detectChanges();
    clickRangeDay(12);
    expect(fixture.nativeElement.querySelector('lc-confirm-button button').disabled).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.range-end').length).toBe(0);
    clickRangeDay(13);
    fixture.nativeElement.querySelector('lc-confirm-button button').click();
    expect(changed).toHaveBeenCalledOnceWith(component.config.getValue());
    expect(component.config.isOpen()).toBe(false);
  });

  it('retains immediate single-date behavior when linked selection is not enabled', () => {
    createPicker(ECalendarType.Date, { selectionMode: 'immediate' });
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    clickRangeDay(10);
    expect(component.config.getValue()).not.toContain('/');
    expect(changed).toHaveBeenCalledOnceWith(component.config.getValue());
    expect(component.config.isOpen()).toBe(false);
  });

  it('renders six full weeks without fabricated markers or ranges', () => {
    createPicker(ECalendarType.DateTime, {
      view: {
        showAdjacentDays: true, compactWeekdays: true
      }
    });
    const cells = fixture.nativeElement.querySelectorAll('lc-day-picker-button');
    expect(cells.length).toBe(42);
    const dayTable = fixture.nativeElement.querySelector('lc-calendar-grid table');
    expect(dayTable.querySelector('thead').parentElement).toBe(dayTable);
    expect(dayTable.querySelector('thead th')?.getAttribute('colspan')).toBe('7');
    expect(cells[0].textContent.trim()).toBe('29');
    expect(cells[0].querySelector('button').disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('.dayName').textContent.trim()).toBe('Mo');
    expect(fixture.nativeElement.querySelector('.marked, .in-range')).toBeNull();
    expect(fixture.nativeElement.querySelector('.day-cell.active').textContent.trim()).toBe('9');
  });

  it('renders the current single panel and preserves time-only variants', () => {
    createPicker(ECalendarType.DateTime);
    expect(fixture.nativeElement.querySelectorAll('lc-active-calendar-panel').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('lc-day-picker').length).toBe(1);
    expect(fixture.nativeElement.querySelector('lc-time-picker-compact')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('lc-time-picker')).toBeNull();
    fixture.destroy();

    createPicker(ECalendarType.Time);
    expect(fixture.nativeElement.querySelectorAll('lc-active-calendar-panel').length).toBe(1);
    expect(fixture.nativeElement.querySelector('lc-time-picker')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('lc-time-picker-compact')).toBeNull();
    fixture.destroy();

    createPicker(ECalendarType.Time, { view: { compactTime: true } });
    expect(fixture.nativeElement.querySelector('lc-time-picker-compact')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.timeOnly')).not.toBeNull();
  });

  it('recognizes today independently of the selected time', () => {
    const today = adapter.setParts(adapter.today('Europe/Zagreb'), { hour: 13, minute: 30 });
    createPicker(ECalendarType.DateTime, { value: adapter.toISOString(today), view: { showAdjacentDays: true } });
    const current = fixture.nativeElement.querySelector('.day-cell.current');
    expect(current).not.toBeNull();
    expect(current.classList.contains('active')).toBe(true);
  });

  it('skips disabled calendar days even when the selected value has a time', () => {
    createPicker(ECalendarType.DateTime, {
      disabledDates: [9, 10].map(day => adapter.toISOString(new DateTime(2026, 0, day, 0, 0, 0, 0, 'Europe/Zagreb'))),
      view: { showAdjacentDays: true }
    });
    expect(component.config.getControl().getValue().getDate()).toBe(11);
    expect(component.config.getControl().getValue().getHour()).toBe(13);
    const disabled = Array.from(fixture.nativeElement.querySelectorAll('.disabled:not(.outside-month) button')) as HTMLButtonElement[];
    expect(disabled.map(button => button.textContent.trim())).toEqual(['9', '10']);
    expect(disabled.every(button => button.disabled)).toBe(true);
    expect(fixture.nativeElement.querySelector('.active.disabled')).toBeNull();
  });

  it('makes all nine months outside min/max disabled and styles them through shared tokens', () => {
    createPicker(ECalendarType.MonthYear, {
      value: adapter.toISOString(new DateTime(2026, 5, 1, 0, 0, 0, 0, 'Europe/Zagreb')),
      minimumDate: adapter.toISOString(new DateTime(2026, 4, 1, 0, 0, 0, 0, 'Europe/Zagreb')),
      maximumDate: adapter.toISOString(new DateTime(2026, 6, 31, 23, 59, 0, 0, 'Europe/Zagreb'))
    });
    fixture.nativeElement.style.setProperty('--lc-datepicker-disabled-color', '#996633');
    fixture.nativeElement.style.setProperty('--lc-datepicker-disabled-background', '#f4f4f4');
    fixture.nativeElement.style.setProperty('--lc-datepicker-disabled-opacity', '0.6');
    fixture.nativeElement.style.setProperty('--lc-datepicker-disabled-cursor', 'not-allowed');
    const disabled = fixture.nativeElement.querySelectorAll('lc-month-picker-button .disabled');
    expect(disabled.length).toBe(9);
    const cell = disabled[0];
    const button = cell.querySelector('button');
    expect(button.disabled).toBe(true);
    expect(getComputedStyle(button).color).toBe('rgb(153, 102, 51)');
    expect(getComputedStyle(button).cursor).toBe('not-allowed');
    expect(getComputedStyle(cell).backgroundColor).toBe('rgb(244, 244, 244)');
    expect(getComputedStyle(cell).opacity).toBe('0.6');
    const value = component.config.getValue();
    button.click();
    expect(component.config.getValue()).toBe(value);
  });

  it('disables years outside min/max and uses the same disabled color token', () => {
    createPicker(ECalendarType.Year, {
      value: adapter.toISOString(new DateTime(2027, 0, 1, 0, 0, 0, 0, 'Europe/Zagreb')),
      minimumDate: adapter.toISOString(new DateTime(2026, 0, 1, 0, 0, 0, 0, 'Europe/Zagreb')),
      maximumDate: adapter.toISOString(new DateTime(2028, 11, 31, 23, 59, 0, 0, 'Europe/Zagreb')),
      view: { yearColumns: 4, yearPageAnchor: 2025 }
    });
    fixture.nativeElement.style.setProperty('--lc-datepicker-disabled-color', '#996633');
    const disabled = fixture.nativeElement.querySelectorAll('lc-year-picker-button .disabled button');
    expect(disabled.length).toBe(17);
    expect(disabled[0].disabled).toBe(true);
    expect(getComputedStyle(disabled[0]).color).toBe('rgb(153, 102, 51)');
    const value = component.config.getValue();
    disabled[0].click();
    expect(component.config.getValue()).toBe(value);
  });

  it('skips the same disabled time interval through compact controls', () => {
    createPicker(ECalendarType.Time, {
      view: { compactTime: true },
      disabledTimeRanges: [
        { startTime: { hour: 0, minute: 0 }, stopTime: { hour: 7, minute: 59 } },
        { startTime: { hour: 14, minute: 0 }, stopTime: { hour: 16, minute: 59 } },
        { startTime: { hour: 21, minute: 0 }, stopTime: { hour: 23, minute: 59 } }
      ]
    });
    const hour = fixture.nativeElement.querySelector('lc-time-spinner-compact');
    hour.querySelector('.selectbtn').click();
    expect(component.config.getControl().getValue().getHour()).toBe(17);
    expect(component.config.getControl().getValue().getMinute()).toBe(0);
    expect(component.config.isOpen()).toBe(true);
  });

  it('keeps the legacy day grid when adjacent dates are not enabled', () => {
    createPicker(ECalendarType.DateTime);
    expect(fixture.nativeElement.querySelectorAll('lc-day-picker-button').length).toBe(31);
    expect(fixture.nativeElement.querySelector('.outside-month')).toBeNull();
  });

  it('keeps wheel navigation attached to the active calendar table', () => {
    createPicker(ECalendarType.DateTime);
    const control = component.config.getControl();
    const currentMonth = control.getValue().getMonth();
    const table = fixture.nativeElement.querySelector('lc-day-picker table');
    table.dispatchEvent(new WheelEvent('wheel', { deltaY: -1, bubbles: true, cancelable: true }));
    expect(control.getValue().getMonth()).toBe((currentMonth + 1) % 12);
  });

  it('lets the custom header own its colors across month navigation', () => {
    createPicker(ECalendarType.MonthYear);
    const header = fixture.nativeElement.querySelector('thead');
    expect(header.getAttribute('style')).toBeNull();
    expect(getComputedStyle(header).backgroundColor).toBe('rgb(255, 255, 255)');
    fixture.nativeElement.style.setProperty('--lc-datepicker-header-background', '#f0f4f8');
    fixture.nativeElement.style.setProperty('--lc-datepicker-header-color', '#123456');
    fixture.nativeElement.querySelector('.toolbar button[aria-label="Next"]').click();
    expect(header.getAttribute('style')).toBeNull();
    expect(getComputedStyle(header).backgroundColor).toBe('rgb(240, 244, 248)');
    expect(getComputedStyle(header.querySelector('.period button')).color).toBe('rgb(18, 52, 86)');
  });

  it('waits for Apply after selecting a month', () => {
    createPicker(ECalendarType.MonthYear);
    const monthTable = fixture.nativeElement.querySelector('lc-calendar-grid table');
    expect(monthTable.querySelector('thead').parentElement).toBe(monthTable);
    expect(monthTable.querySelector('thead th')?.getAttribute('colspan')).toBe('3');
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('lc-month-picker-button button')) as HTMLButtonElement[];
    buttons.find(button => button.textContent.trim() === 'Jun').click();
    expect(component.config.isOpen()).toBe(true);
    expect(changed).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('lc-month-picker .active').textContent.trim()).toBe('Jun');
    const selectedValue = component.config.getValue();
    fixture.nativeElement.querySelector('.apply').click();
    expect(changed).toHaveBeenCalledOnceWith(selectedValue);
    expect(component.config.getValue()).toBe(selectedValue);
    expect(component.config.isOpen()).toBe(false);
  });

  it('restores the last confirmed value when an explicit selection is cancelled', () => {
    createPicker(ECalendarType.MonthYear);
    const originalValue = component.config.getValue();
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('lc-month-picker-button button')) as HTMLButtonElement[];
    buttons.find(button => button.textContent.trim() === 'Jun').click();
    expect(component.config.getValue()).not.toBe(originalValue);
    expect(changed).not.toHaveBeenCalled();

    component.config.setOpen(false);

    expect(component.config.getValue()).toBe(originalValue);
    expect(changed).not.toHaveBeenCalled();
  });

  it('preserves immediate month selection by default', () => {
    createPicker(ECalendarType.MonthYear, { selectionMode: 'immediate' });
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    fixture.nativeElement.querySelector('lc-month-picker-button button').click();
    expect(changed).toHaveBeenCalledTimes(1);
    expect(component.config.isOpen()).toBe(false);
  });

  it('uses four year columns, twenty-year pages and explicit confirmation when configured', () => {
    createPicker(ECalendarType.Year, {
      value: adapter.toISOString(new DateTime(2031, 0, 1, 0, 0, 0, 0, 'Europe/Zagreb')),
      view: { yearColumns: 4, yearPageAnchor: 2025 }
    });
    expect(fixture.nativeElement.querySelector('lc-year-picker tbody tr').children.length).toBe(4);
    expect(fixture.nativeElement.querySelectorAll('lc-year-picker-button').length).toBe(20);
    expect(fixture.nativeElement.querySelector('lc-year-picker-button').textContent.trim()).toBe('2025');
    fixture.nativeElement.querySelector('.toolbar button[aria-label="Next"]').click();
    expect(fixture.nativeElement.querySelector('lc-year-picker-button').textContent.trim()).toBe('2045');
    fixture.nativeElement.querySelector('.toolbar button[aria-label="Previous"]').click();
    expect(fixture.nativeElement.querySelector('lc-year-picker-button').textContent.trim()).toBe('2025');
    const changed = jasmine.createSpy('dateChange');
    component.dateChange.subscribe(changed);
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('lc-year-picker-button button')) as HTMLButtonElement[];
    buttons.find(button => button.textContent.trim() === '2032').click();
    expect(component.config.isOpen()).toBe(true);
    expect(changed).not.toHaveBeenCalled();
    fixture.nativeElement.querySelector('.apply').click();
    expect(changed).toHaveBeenCalledTimes(1);
  });

  it('preserves five columns and twenty-five years by default', () => {
    createPicker(ECalendarType.Year);
    expect(fixture.nativeElement.querySelector('lc-year-picker tbody tr').children.length).toBe(5);
    expect(fixture.nativeElement.querySelectorAll('lc-year-picker-button').length).toBe(25);
  });

  it('reuses compact time controls without a caption or header for time-only', () => {
    createPicker(ECalendarType.Time, { view: { compactTime: true } });
    expect(fixture.nativeElement.querySelector('lc-time-picker')).toBeNull();
    expect(fixture.nativeElement.querySelector('.clockCell')).toBeNull();
    const spinner = fixture.nativeElement.querySelector('lc-time-spinner-compact');
    const before = Number(spinner.querySelector('.timeLabel').textContent.trim());
    spinner.querySelector('.selectbtn').click();
    expect(Number(spinner.querySelector('.timeLabel').textContent.trim())).toBe((before + 1) % 24);
    expect(component.config.isOpen()).toBe(true);
  });
});

describe('Day cell state combinations', () => {
  let fixture: ComponentFixture<LCDayPickerButtonComponent>;
  let control: LCDatePickerControl;
  let model: DayPicker;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LcDatePickerModule],
      providers: [DayPicker, { provide: LCDatePickerAdapter, useClass: LuxonDateAdapterService }]
    });
    const adapter = TestBed.inject(LCDatePickerAdapter);
    control = new DatePickerConfig({ value: adapter.toISOString(adapter.today()), calendarType: ECalendarType.DateTime }, adapter).getControl();
    model = TestBed.inject(DayPicker);
    model.setControl(control);
    fixture = TestBed.createComponent(LCDayPickerButtonComponent);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('row', 0);
    fixture.componentRef.setInput('column', 0);
  });

  const states: Array<[string, Partial<ICalendarItem>]> = [
    ['default', {}], ['active', { active: true }], ['today', { current: true }]
  ];

  states.forEach(([name, flags]) => {
    [false, true].forEach(disabled => {
      it(`renders ${name} with disabled=${disabled}`, () => {
        const item: ICalendarItem = { value: 1, disabled, ...flags };
        model.setCalendarData([[item]]);
        fixture.componentRef.setInput('item', item);
        fixture.detectChanges();
        const cell = fixture.nativeElement.querySelector('.day-cell');
        expect(cell.classList.contains('active')).toBe(!!flags.active);
        expect(cell.classList.contains('current')).toBe(!!flags.current);
        expect(cell.querySelector('button').disabled).toBe(disabled);
        if (disabled) {
          const selected = spyOn(model, 'setSelectedDate');
          cell.querySelector('button').click();
          fixture.componentInstance.selectItem();
          expect(selected).not.toHaveBeenCalled();
        }
      });
    });
  });

  it('updates state classes when the input changes', () => {
    const item: ICalendarItem = { value: 1, active: true, current: true };
    model.setCalendarData([[item]]);
    fixture.componentRef.setInput('item', item);
    fixture.detectChanges();
    fixture.componentRef.setInput('item', { value: 2 });
    fixture.detectChanges();
    const cell = fixture.nativeElement.querySelector('.day-cell');
    ['active', 'current', 'disabled'].forEach(name => expect(cell.classList.contains(name)).toBe(false));
  });
});