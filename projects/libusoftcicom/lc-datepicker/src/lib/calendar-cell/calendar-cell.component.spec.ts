import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ICalendarItem } from '../base-date-picker.class';
import { DateTimePart, LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { ECalendarType } from '../enums';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';
import { LCCalendarCellComponent } from './calendar-cell.component';

describe('LCCalendarCellComponent', () => {
  let fixture: ComponentFixture<LCCalendarCellComponent>;
  let adapter: LCDatePickerAdapter;
  let control: LCDatePickerControl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LCCalendarCellComponent],
      providers: [{ provide: LCDatePickerAdapter, useClass: LuxonDateAdapterService }]
    });
    adapter = TestBed.inject(LCDatePickerAdapter);
    const today = adapter.today();
    control = new LCDatePickerControl({
      value: adapter.toISOString(today),
      calendarType: ECalendarType.DateTime,
      localization: 'hr',
    }, adapter);
    fixture = TestBed.createComponent(LCCalendarCellComponent);
    fixture.componentRef.setInput('control', control);
  });

  it('renders kind-specific labels and state, and reacts to item changes', () => {
    const item: ICalendarItem = { value: 2026, text: 'October', active: true, current: true };
    fixture.componentRef.setInput('item', item);
    fixture.componentRef.setInput('kind', 'month');
    fixture.detectChanges();

    let cell = fixture.nativeElement.querySelector('.month-cell') as HTMLDivElement;
    let button = cell.querySelector('button') as HTMLButtonElement;
    expect(button.textContent.trim()).toBe('October');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(cell.classList.contains('active')).toBe(true);
    expect(cell.classList.contains('current')).toBe(true);
    expect(button.style.color).toContain('--lc-datepicker-choice-color');

    fixture.componentRef.setInput('item', { value: 2027, disabled: true });
    fixture.componentRef.setInput('kind', 'year');
    fixture.detectChanges();
    cell = fixture.nativeElement.querySelector('.year-cell') as HTMLDivElement;
    button = cell.querySelector('button') as HTMLButtonElement;
    expect(button.textContent.trim()).toBe('2027');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(cell.classList.contains('active')).toBe(false);
    expect(cell.classList.contains('current')).toBe(false);
    expect(cell.classList.contains('disabled')).toBe(true);
  });

  it('provides a focusable day button with the outside-month state', () => {
    fixture.componentRef.setInput('item', { value: 1, outsideMonth: true });
    fixture.componentRef.setInput('kind', 'day');
    fixture.detectChanges();

    const cell = fixture.nativeElement.querySelector('.day-cell') as HTMLDivElement;
    const button = cell.querySelector('button') as HTMLButtonElement;
    expect(cell.classList.contains('outside-month')).toBe(true);
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('uses state-specific text tokens without important color overrides', () => {
    fixture.nativeElement.style.setProperty('--lc-datepicker-disabled-color', '#996633');
    fixture.nativeElement.style.setProperty('--lc-datepicker-outside-color', '#336699');
    fixture.componentRef.setInput('item', { value: 1, disabled: true });
    fixture.detectChanges();

    let button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.style.color).toContain('--lc-datepicker-disabled-color');
    expect(getComputedStyle(button).color).toBe('rgb(153, 102, 51)');

    fixture.componentRef.setInput('item', { value: 1, disabled: true, outsideMonth: true });
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.style.color).toContain('--lc-datepicker-outside-color');
    expect(getComputedStyle(button).color).toBe('rgb(51, 102, 153)');
  });

  it('announces the full date and range state without marking interior days as pressed', () => {
    const date = adapter.today();
    fixture.componentRef.setInput('item', {
      value: date.getDate(),
      dateTime: date,
      current: true,
      rangeStart: true
    });
    fixture.componentRef.setInput('kind', 'day');
    fixture.detectChanges();

    let button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const dateLabel = [
      DateTimePart.DATE,
      DateTimePart.MONTH,
      DateTimePart.YEAR
    ].map(part => adapter.formatDateTimePart(date, part, control.getLocalization())).join(' ');
    expect(button.getAttribute('aria-label')).toBe(`${dateLabel}, range start`);
    expect(button.getAttribute('aria-current')).toBe('date');
    expect(button.getAttribute('aria-pressed')).toBe('true');

    fixture.componentRef.setInput('item', {
      value: date.getDate(),
      dateTime: date,
      inRange: true
    });
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe(`${dateLabel}, in selected range`);
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('keeps event markers distinct from range, active, today and disabled cell backgrounds', () => {
    const host = fixture.nativeElement as HTMLElement;
    host.style.setProperty('--lc-datepicker-selected-background', 'rgb(1, 2, 3)');
    host.style.setProperty('--lc-datepicker-range-selection-background', 'rgb(4, 5, 6)');
    host.style.setProperty('--lc-datepicker-today-background', 'rgb(7, 8, 9)');
    host.style.setProperty('--lc-datepicker-event-marker-color', 'rgb(10, 11, 12)');
    host.style.setProperty('--lc-datepicker-disabled-color', 'rgb(13, 14, 15)');

    const render = (item: ICalendarItem): HTMLElement => {
      fixture.componentRef.setInput('item', item);
      fixture.detectChanges();
      return fixture.nativeElement.querySelector('.day-cell') as HTMLElement;
    };

    expect(getComputedStyle(render({ value: 1, inRange: true })).backgroundColor).toBe('rgb(4, 5, 6)');
    expect(getComputedStyle(render({ value: 1, rangePreview: true })).backgroundColor).toBe('rgb(4, 5, 6)');
    expect(getComputedStyle(render({ value: 1, active: true })).backgroundColor).toBe('rgb(1, 2, 3)');
    const today = render({ value: 1, current: true });
    expect(getComputedStyle(today).backgroundColor).toBe('rgb(7, 8, 9)');
    expect(getComputedStyle(today, '::after').display).toBe('none');

    const event = { date: '2026-01-01', label: 'Event' };
    const eventToday = render({ value: 1, current: true, events: [event] });
    expect(getComputedStyle(eventToday).backgroundColor).toBe('rgb(7, 8, 9)');
    expect(getComputedStyle(eventToday, '::after').display).toBe('block');
    expect(getComputedStyle(eventToday, '::after').backgroundColor).toBe('rgb(10, 11, 12)');

    const disabledEvent = render({ value: 1, disabled: true, events: [event] });
    expect(disabledEvent.classList.contains('disabled')).toBe(true);
    expect(getComputedStyle(disabledEvent, '::after').backgroundColor).toBe('rgb(13, 14, 15)');
  });

  it('emits a selection only for enabled cells', () => {
    const selection = jasmine.createSpy('selection');
    fixture.componentInstance.selection.subscribe(selection);
    fixture.componentRef.setInput('item', { value: 2, disabled: true });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.componentInstance.select();
    expect(selection).not.toHaveBeenCalled();

    fixture.componentRef.setInput('item', { value: 3 });
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    expect(selection).toHaveBeenCalledTimes(1);
  });
});
