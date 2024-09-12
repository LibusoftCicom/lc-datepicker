import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LCTimePickerComponent } from './time-picker.component';
import { ECalendarType, EHourFormat, IDatePickerConfiguration, LCDatePickerControl } from './../lc-date-picker.module';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LCTimeSpinnerComponent } from './time-spinner.component';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';

describe('LCTimePickerComponent', () => {
  let component: LCTimePickerComponent;
  let fixture: ComponentFixture<LCTimePickerComponent>;
  let dateAdapter: LCDatePickerAdapter;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LCTimePickerComponent,
        LCTimeSpinnerComponent
      ],
      providers: [{
        provide: LCDatePickerAdapter,
        useClass: LuxonDateAdapterService
      }]
    })
      .compileComponents()
      .then(() => {
        dateAdapter = TestBed.inject(LCDatePickerAdapter);
        fixture = TestBed.createComponent(LCTimePickerComponent);
        component = fixture.componentInstance;
        const today = dateAdapter.today();

        const config: IDatePickerConfiguration = {
          value: dateAdapter.toISOString(today),
          calendarType: ECalendarType.Time,
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

  it('should create TimePicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should check 12h format', () => {
      component.control.setValue(dateAdapter.now());
      component.control.setHourFormat(EHourFormat.TWELVE_HOUR);
      component.setTimeFormat();
      expect(component.hourFormat).toBe(EHourFormat.TWELVE_HOUR);
  });

  it('should check 24h format', () => {

      component.control.setValue(dateAdapter.now());
      component.control.setHourFormat(EHourFormat.TWENTY_FOUR_HOUR);
      component.setTimeFormat();
      expect(component.hourFormat).toBe(EHourFormat.TWENTY_FOUR_HOUR);
  });

  it('should add hour on click', () => {

      component.control.setValue(dateAdapter.setParts(dateAdapter.now(), {hour: 5}));
      component.addHour();
      expect(component.control.getValue().getHour()).toBe(6);
  });

  it('should subtract hour on click', () => {

      component.control.setValue(dateAdapter.setParts(dateAdapter.now(), {hour: 5}));
      component.subtractHour();
      expect(component.control.getValue().getHour()).toBe(4);
  });

  it('should add minute on click', () => {

      component.control.setValue(dateAdapter.setParts(dateAdapter.now(), {minute: 15}));
      component.addMinute();
      expect(component.control.getValue().getMinute()).toBe(16);
  });

  it('should subtract minute on click', () => {

      component.control.setValue(dateAdapter.setParts(dateAdapter.now(), {minute: 15}));
      component.subtractMinute();
      expect(component.control.getValue().getMinute()).toBe(14);
  });

  it('should add hour on scroll up', () => {

      component.control.setValue(dateAdapter.setParts(dateAdapter.now(), {hour: 5}));
      let scrollEvent = new WheelEvent('test', { deltaY: -1 })
      component.hourScroll(scrollEvent);
      expect(component.control.getValue().getHour()).toBe(6);
  });

  it('should subtract hour on scroll down', () => {

      component.control.setValue(dateAdapter.setParts(dateAdapter.now(), {hour: 5}));
      let scrollEvent = new WheelEvent('test', { deltaY: 1 })
      component.hourScroll(scrollEvent);
      expect(component.control.getValue().getHour()).toBe(4);
  });

  it('should add minute on scroll up', () => {

      component.control.setValue(dateAdapter.setParts(dateAdapter.now(), {minute: 15}));
      let scrollEvent = new WheelEvent('test', { deltaY: -1 })
      component.minuteScroll(scrollEvent);
      expect(component.control.getValue().getMinute()).toBe(16);
  });

  it('should subtract minute on scroll down', () => {

      component.control.setValue(dateAdapter.setParts(dateAdapter.now(), {minute: 15}));
      let scrollEvent = new WheelEvent('test', { deltaY: 1 })
      component.minuteScroll(scrollEvent);
      expect(component.control.getValue().getMinute()).toBe(14);
  });

  it('should toggle meridiem on click', () => {

      component.control.setValue(dateAdapter.setParts(dateAdapter.now(), {hour: 5}));
      component.control.setHourFormat(EHourFormat.TWELVE_HOUR);
      component.setTimeFormat();
      component.toggleMeridiem();
      expect(component.control.getValue().getHour()).toBe(17);
      component.toggleMeridiem();
      expect(component.control.getValue().getHour()).toBe(5);
  });

});
