import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LCMonthPickerComponent } from './month-picker.component';
import { ECalendarType, LCDatePickerControl } from './../lc-date-picker.module';

import { LCMonthPickerButtonComponent } from './month-picker-button.component';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';

describe('LCMonthPickerComponent', () => {
  let component: LCMonthPickerComponent;
  let fixture: ComponentFixture<LCMonthPickerComponent>;
  let dateAdapter: LCDatePickerAdapter;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LCMonthPickerComponent,
        LCMonthPickerButtonComponent,
      ],
      providers: [{
        provide: LCDatePickerAdapter,
        useClass: LuxonDateAdapterService
      }]
    })
      .compileComponents()
      .then(() => {
        dateAdapter = TestBed.inject(LCDatePickerAdapter);
        fixture = TestBed.createComponent(LCMonthPickerComponent);
        component = fixture.componentInstance;
        const today = dateAdapter.today();

        const config = {
          value: dateAdapter.toISOString(today),
          calendarType: ECalendarType.MonthYear,
          localization: 'hr',
          minimumDate: dateAdapter.toISOString(dateAdapter.setParts(dateAdapter.getStartOfYear(today), {year: 1900})),
          maximumDate: dateAdapter.toISOString(dateAdapter.setParts(dateAdapter.getStartOfYear(today), {year: 2099})),
          labels: {confirmLabel: 'Odabir'}
        };

        component.control = new LCDatePickerControl(config, dateAdapter);

        component.control.setHostElement(fixture.nativeElement);

        fixture.detectChanges();
      });
  }));

  it('should create MonthPicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should format months array', () => {
    const months = component.calendarData;
    expect(months.length).toBe(4);
    expect(months[0].length).toBe(3);
    expect(months[1].length).toBe(3);
    expect(months[2].length).toBe(3);
    expect(months[3].length).toBe(3);
  });

  it('should set month on click', () => {
      const month = dateAdapter.setParts(component.control.getValue(), {month: component.control.getValue().getMonth() - 1});
      expect(component.control.getValue().getMonth()).not.toBe(month.getMonth());
      component.control.setValue(month, true);
      expect(component.control.getValue().getMonth()).toBe(month.getMonth());
  });

  it('should switch to previous year on scroll up', () => {
      component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {month: 0, year: 2023}));

      expect(component.control.getValue().getYear()).toBe(2023);

      const scrollEvent = new WheelEvent('test', {deltaY: 1});
      component.monthScroll(scrollEvent);

      expect(component.control.getValue().getYear()).toBe(2022);
  });

  it('should switch to next year on scroll down', () => {
      component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {month: 0, year: 2023}));

      expect(component.control.getValue().getYear()).toBe(2023);

      const scrollEvent = new WheelEvent('test', {deltaY: -1});
      component.monthScroll(scrollEvent);

      expect(component.control.getValue().getYear()).toBe(2024);
  });
});
