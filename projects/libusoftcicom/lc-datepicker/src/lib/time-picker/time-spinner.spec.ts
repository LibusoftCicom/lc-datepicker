import { Type } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ECalendarType, LCDatePickerControl } from '../lc-date-picker.module';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LCTimeSpinnerBaseDirective } from './time-spinner-base.directive';
import { LCTimeSpinnerComponent } from './time-spinner.component';
import { LCTimeSpinnerCompactComponent } from '../time-picker-compact/time-spinner-compact.component';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';

describe('time spinner components', () => {
  let dateAdapter: LCDatePickerAdapter;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LCTimeSpinnerComponent, LCTimeSpinnerCompactComponent],
      providers: [{
        provide: LCDatePickerAdapter,
        useClass: LuxonDateAdapterService
      }]
    }).compileComponents().then(() => {
      dateAdapter = TestBed.inject(LCDatePickerAdapter);
    });
  }));

  function createControl(): LCDatePickerControl {
    const today = dateAdapter.today();
    return new LCDatePickerControl({
      value: dateAdapter.toISOString(today),
      calendarType: ECalendarType.Time,
      localization: 'hr',
      minimumDate: dateAdapter.toISOString(dateAdapter.setParts(dateAdapter.getStartOfYear(today), { year: 1900 })),
      maximumDate: dateAdapter.toISOString(dateAdapter.setParts(dateAdapter.getStartOfYear(today), { year: 2099 })),
    }, dateAdapter);
  }

  function verifySpinner<T extends LCTimeSpinnerBaseDirective>(
    component: Type<T>,
    expectedDigitColor: string,
    expectedArrowColor: string,
  ): void {
    const fixture = TestBed.createComponent(component);
    fixture.componentInstance.control = createControl();
    fixture.componentInstance.value = '12';
    fixture.componentInstance.ariaLabel = 'hour';
    fixture.detectChanges();

    const incremented = jasmine.createSpy('incremented');
    const decremented = jasmine.createSpy('decremented');
    const scrolled = jasmine.createSpy('scrolled');
    fixture.componentInstance.incremented.subscribe(incremented);
    fixture.componentInstance.decremented.subscribe(decremented);
    fixture.componentInstance.scrolled.subscribe(scrolled);

    const buttons = fixture.nativeElement.querySelectorAll('.selectbtn') as NodeListOf<HTMLButtonElement>;
    const spinner = fixture.nativeElement.querySelector('.time-spinner') as HTMLDivElement;

    buttons[0].click();
    buttons[1].click();
    const wheelEvent = new WheelEvent('wheel', { deltaY: 1 });
    spinner.dispatchEvent(wheelEvent);

    expect(incremented).toHaveBeenCalledTimes(1);
    expect(decremented).toHaveBeenCalledTimes(1);
    expect(buttons[0].getAttribute('aria-label')).toBe('Increase hour 12');
    expect(buttons[1].getAttribute('aria-label')).toBe('Decrease hour 12');
    expect(scrolled).toHaveBeenCalledTimes(1);
    expect(scrolled).toHaveBeenCalledWith(wheelEvent);
    expect((fixture.nativeElement.querySelector('.timeDigit, .timeLabel') as HTMLElement).style.color)
      .toBe(expectedDigitColor);
    expect((buttons[0] as HTMLElement).style.color).toBe(expectedArrowColor);
    expect((buttons[1] as HTMLElement).style.color).toBe(expectedArrowColor);

    fixture.destroy();
    buttons[0].click();
    expect(incremented).toHaveBeenCalledTimes(1);
  }

  it('preserves standard spinner events, theming, and teardown', () => {
    verifySpinner(LCTimeSpinnerComponent, 'rgb(94, 102, 111)', 'rgb(94, 102, 111)');
  });

  it('preserves compact spinner events, theming, and teardown', () => {
    verifySpinner(
      LCTimeSpinnerCompactComponent,
      'var(--lc-datepicker-time-value-color, #5e666f)',
      'var(--lc-datepicker-color, #5e666f)',
    );
  });
});
