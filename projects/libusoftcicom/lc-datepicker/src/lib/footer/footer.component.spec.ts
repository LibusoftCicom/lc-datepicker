import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';
import { DateTime } from '../date-time.class';
import { ECalendarType } from '../enums';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { DatePickerConfig } from '../lc-date-picker-config';
import { LCConfirmButtonComponent } from '../confirm-button/confirm-button.component';
import { LCDatePickerFooterComponent } from './footer.component';

describe('LCDatePickerFooterComponent', () => {
  let fixture: ComponentFixture<LCDatePickerFooterComponent>;
  let component: LCDatePickerFooterComponent;
  let adapter: LCDatePickerAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [LCDatePickerFooterComponent, LCConfirmButtonComponent],
      providers: [{ provide: LCDatePickerAdapter, useClass: LuxonDateAdapterService }]
    });
    adapter = TestBed.inject(LCDatePickerAdapter);
    fixture = TestBed.createComponent(LCDatePickerFooterComponent);
    component = fixture.componentInstance;
  });

  const setControl = (
    calendarType: ECalendarType,
    rangeSelectionMode?: 'independent' | 'linked',
    selectionMode?: 'immediate' | 'explicit'
  ): void => {
    const from = new DateTime(2026, 9, 20, 0, 0, 0, 0, 'UTC');
    const value = calendarType === ECalendarType.DateRange
      ? `${adapter.toISOString(from)}/${adapter.toISOString(adapter.add(from, 1, 'day'))}`
      : adapter.toISOString(from);
    const config = new DatePickerConfig({ value, calendarType, rangeSelectionMode, selectionMode }, adapter);
    fixture.componentRef.setInput('control', config.getControl());
    fixture.detectChanges();
  };

  it('shows the confirm button only for supported picker types', () => {
    const cases: [ECalendarType, boolean][] = [
      [ECalendarType.Time, true],
      [ECalendarType.DateTime, true],
      [ECalendarType.Date, false],
      [ECalendarType.MonthYear, false],
      [ECalendarType.Year, false],
      [ECalendarType.DateRange, true]
    ];

    cases.forEach(([calendarType, visible]) => {
      setControl(calendarType);
      expect(component.shouldShowConfirmButton(component.control())).toBe(visible);
      expect(!!fixture.nativeElement.querySelector('lc-confirm-button')).toBe(visible);
    });
  });

  it('shows the confirm button for linked single-date selection only when enabled', () => {
    setControl(ECalendarType.Date, 'independent', 'immediate');
    expect(component.shouldShowConfirmButton(component.control())).toBe(false);

    (['immediate', 'explicit'] as const).forEach(selectionMode => {
      setControl(ECalendarType.Date, 'linked', selectionMode);
      expect(component.shouldShowConfirmButton(component.control())).toBe(true);
      expect(fixture.nativeElement.querySelector('lc-confirm-button')).not.toBeNull();
    });
  });
});
