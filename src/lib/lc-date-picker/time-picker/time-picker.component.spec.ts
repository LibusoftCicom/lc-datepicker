import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LCTimePickerComponent } from './time-picker.component';
import { LcDatePickerModule, DatePickerConfig, ECalendarType } from '../../lc-date-picker.module';

import * as moment from 'moment';

describe('LCTimePickerComponent', () => {
  let component: LCTimePickerComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<LCTimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LCTimePickerComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LCTimePickerComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    component.newDate = moment();

    component.config = new DatePickerConfig();
    component.config.CalendarType = ECalendarType.Time;
    component.config.Localization = 'hr';
    component.config.MinDate = { years: 1900 };
    component.config.MaxDate = { years: 2100 };
    component.config.Labels = {
      confirmLabel: 'Odabir'
    };

    fixture.detectChanges();
  });

  it('should create TimePicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should check 12h format', () => {
      const date = moment().locale('en');
      component.newDate = date;
      component.setTimeFormat();
      expect(component.is24HourFormat).toBeFalsy();
  })
  
  it('should check 24h format', () => {
      const date = moment().locale('hr');
      component.newDate = date;
      component.setTimeFormat();
      expect(component.is24HourFormat).toBeTruthy();
  })

  it('should add hour on click', () => {
      const date = moment().hour(5);
      component.newDate = date;
      component.addHour();
      expect(component.newDate.hour()).toBe(6);
  })
  
  it('should subtract hour on click', () => {
      const date = moment().hour(5);
      component.newDate = date;
      component.subtractHour();
      expect(component.newDate.hour()).toBe(4);
  })
  
  it('should add minute on click', () => {
      const date = moment().minute(15);
      component.newDate = date;
      component.addMinute();
      expect(component.newDate.minute()).toBe(16);
  })
  
  it('should subtract minute on click', () => {
      const date = moment().minute(15);
      component.newDate = date;
      component.subtractMinute();
      expect(component.newDate.minute()).toBe(14);
  })
  
//   it('should add hour on scroll up', () => {
//       const date = moment().hour(5);
//       component.newDate = date;
//       let scrollEvent = new WheelEvent('test', {deltaY: -1})
//       component.hourScroll(scrollEvent);
//       expect(component.newDate.hour()).toBe(6);
//   })
  
//   it('should subtract hour on scroll down', () => {
//       const date = moment().hour(5);
//       component.newDate = date;
//       let scrollEvent = new WheelEvent('test', {deltaY: 1})
//       component.hourScroll(scrollEvent);
//       expect(component.newDate.hour()).toBe(4);
//   })

//   it('should add minute on scroll up', () => {
//       const date = moment().minute(15);
//       component.newDate = date;
//       let scrollEvent = new WheelEvent('test', {deltaY: -1})
//       component.minuteScroll(scrollEvent);
//       expect(component.newDate.minute()).toBe(16);
//   })
  
//   it('should subtract minute on scroll down', () => {
//       const date = moment().minute(15);
//       component.newDate = date;
//       let scrollEvent = new WheelEvent('test', {deltaY: 1})
//       component.minuteScroll(scrollEvent);
//       expect(component.newDate.minute()).toBe(14);
//   })
  
//   it('should toggle meridiem on click', () => {
//       const date = moment().locale('en').hour(5);
//       component.newDate = date;
//       component.toggleMeridiem();
//       expect(component.newDate.hour()).toBe(17);
//       component.toggleMeridiem();
//       expect(component.newDate.hour()).toBe(5);
//   })

});
