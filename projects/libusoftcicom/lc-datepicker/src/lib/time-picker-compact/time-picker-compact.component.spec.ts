import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ECalendarType, EHourFormat, LCDatePickerControl } from '../lc-date-picker.module';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LCTimePickerCompactComponent } from './time-picker-compact.component';
import { LCTimeSpinnerCompactComponent } from './time-spinner-compact.component';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';

describe('LCTimePickerCompactComponent', () => {
  let fixture: ComponentFixture<LCTimePickerCompactComponent>;
  let component: LCTimePickerCompactComponent;
  let adapter: LCDatePickerAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LCTimePickerCompactComponent, LCTimeSpinnerCompactComponent],
      providers: [{ provide: LCDatePickerAdapter, useClass: LuxonDateAdapterService }]
    });
    adapter = TestBed.inject(LCDatePickerAdapter);
    const today = adapter.setParts(adapter.today(), { hour: 5, minute: 15 });
    const control = new LCDatePickerControl({
      value: adapter.toISOString(today),
      calendarType: ECalendarType.Time,
      localization: 'hr',
      minimumDate: adapter.toISOString(adapter.setParts(adapter.getStartOfYear(today), { year: 1900 })),
      maximumDate: adapter.toISOString(adapter.setParts(adapter.getStartOfYear(today), { year: 2099 })),
    }, adapter);
    fixture = TestBed.createComponent(LCTimePickerCompactComponent);
    component = fixture.componentInstance;
    component.control = control;
    fixture.detectChanges();
  });

  it('shares time formatting, updates, and cleanup for the compact layout', () => {
    expect(component.hourFormat).toBe(EHourFormat.TWENTY_FOUR_HOUR);
    expect(component.formattedHour).toBe('05');
    expect(component.formattedMinute).toBe('15');
    expect((fixture.nativeElement.querySelector('tbody') as HTMLElement).style.color)
      .toBe('var(--lc-datepicker-color, #5e666f)');

    component.addHour();
    fixture.detectChanges();
    expect(component.formattedHour).toBe('06');

    component.control.setHourFormat(EHourFormat.TWELVE_HOUR);
    component.addMinute();
    fixture.detectChanges();
    expect(component.hourFormat).toBe(EHourFormat.TWELVE_HOUR);
    expect(component.formattedMinute).toBe('16');
    expect(component.formattedAMPM).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('lc-time-spinner-compact').length).toBe(3);

    fixture.destroy();
  });
});
