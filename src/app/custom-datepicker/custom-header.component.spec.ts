import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerConfig, ECalendarType, LCDatePickerControl, Panel } from '@libusoftcicom/lc-datepicker';
import { LuxonDateAdapterService } from '../luxon-date-adapter.service';
import { CustomHeaderComponent } from './custom-header.component';

describe('CustomHeaderComponent', () => {
  let fixture: ComponentFixture<CustomHeaderComponent>;
  let control: LCDatePickerControl;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CustomHeaderComponent] });
    const adapter = new LuxonDateAdapterService();
    const date = adapter.setParts(adapter.today(), { year: 2026, month: 0, date: 9 });
    control = new DatePickerConfig({
      value: adapter.toISOString(date), calendarType: ECalendarType.DateTime, localization: 'en'
    }, adapter).getControl();
    fixture = TestBed.createComponent(CustomHeaderComponent);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('type', Panel.Day);
    fixture.detectChanges();
  });

  const columns = [[Panel.Day, 7], [Panel.Month, 3], [Panel.Year, 5]] as const;

  columns.forEach(([panel, count]) => {
    it(`uses ${count} columns for panel ${panel}`, () => {
      fixture.componentRef.setInput('type', panel);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('th').colSpan).toBe(count);
    });
  });

  it('shows month and year as separate actions', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.period button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('January');
    expect(buttons[1].textContent.trim()).toBe('2026');
    buttons[0].click();
    expect(control.getPanel()).toBe(Panel.Month);
    buttons[1].click();
    expect(control.getPanel()).toBe(Panel.Year);
  });

  it('shows only the year action in the month panel', () => {
    fixture.componentRef.setInput('type', Panel.Month);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.period button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent.trim()).toBe('2026');
    buttons[0].click();
    expect(control.getPanel()).toBe(Panel.Year);
  });
});