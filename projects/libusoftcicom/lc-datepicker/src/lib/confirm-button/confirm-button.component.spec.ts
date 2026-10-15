import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';
import { DateTime } from '../date-time.class';
import { ECalendarType } from '../enums';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { DatePickerConfig } from '../lc-date-picker-config';
import { LCConfirmButtonComponent } from './confirm-button.component';

describe('LCConfirmButtonComponent', () => {
  let fixture: ComponentFixture<LCConfirmButtonComponent>;
  let adapter: LCDatePickerAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LCConfirmButtonComponent],
      providers: [{ provide: LCDatePickerAdapter, useClass: LuxonDateAdapterService }]
    });
    adapter = TestBed.inject(LCDatePickerAdapter);
    fixture = TestBed.createComponent(LCConfirmButtonComponent);
  });

  it('disables confirmation for an incomplete range and enables it when complete', () => {
    const config = new DatePickerConfig({
      value: adapter.toISOString(new DateTime(2026, 9, 20, 0, 0, 0, 0, 'UTC')),
      calendarType: ECalendarType.Date,
      rangeSelectionMode: 'linked'
    }, adapter);
    const control = config.getControl();
    control.setRangeSelectionComplete(false);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    control.setRangeSelectionComplete(true);
    fixture.detectChanges();
    expect(button.disabled).toBe(false);
  });
});
