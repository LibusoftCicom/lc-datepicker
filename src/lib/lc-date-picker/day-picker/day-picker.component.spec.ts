import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LCDayPickerComponent } from './day-picker.component';

import { LcDatePickerModule } from '../../lc-date-picker.module';
import * as moment from 'moment';
export enum CalendarType {
    Time,
    DateTime,
    Date,
    Month,
    Year
}
describe('LCDayPickerComponent', () => {
  let component: LCDayPickerComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<LCDayPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LCDayPickerComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LCDayPickerComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    component.newDate = moment();
    component.config ={
        type: CalendarType.Date,
        localization: 'hr',
        minDate: {
            year: 1900
        },
        maxDate: {
            year: 2100
        },
        labels: {
            date: 'Datum',
            time: 'Vrijeme',
            confirm: 'Odabir'
        }
    };
    fixture.detectChanges();
  });

  it('should create DayPicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should set active date', () => {
    const date = moment().date(5);
    component.newDate = date;
    const monthArray = component.createMonthArray();
    const activeDate = component.setActiveDate(monthArray).filter(item => item.active === true);
    expect(activeDate.length).toBe(1);
    expect(activeDate[0].date).toBe(date.toObject().date);
  })

  it('should switch to previous month on click', () => {
    const currentMonth = component.newDate.month();
    component.prevMonth();
    const monthArray = component.createMonthArray();
    expect(monthArray[0].months).toBe(currentMonth - 1);
  })

  it('should switch to next month on click', () => {
    const currentMonth = component.newDate.month();
    component.nextMonth();
    const monthArray = component.createMonthArray();
    expect(monthArray[0].months).toBe(currentMonth + 1);
  })
  
  // it('should switch to previous month on scroll up', () => {
  //   const date = moment().month(3);
  //   component.newDate = date;
  //   let scrollEvent = new WheelEvent('test', {deltaY: 1})
  //   component.monthScroll(scrollEvent);
  //   const monthArray = component.createMonthArray();
  //   expect(monthArray[0].months).toBe(2);
  // })  

  // it('should switch to next month on scroll down', () => {
  //   const date = moment().month(3);
  //   component.newDate = date;
  //   let scrollEvent = new WheelEvent('test', {deltaY: -1})
  //   component.monthScroll(scrollEvent);
  //   const monthArray = component.createMonthArray();
  //   expect(monthArray[0].months).toBe(4);
  // })  

  // it('should set new date on click', () => {
  //   const date = moment().date(3);
  //   const newDate = moment().date(5).month(6).year(2017).toObject();
  //   component.newDate = date;
  //   component.dayClick(null, newDate);
  //   expect(component.newDate.date()).toBe(newDate.date);
  //   expect(component.newDate.month()).toBe(newDate.months);
  //   expect(component.newDate.year()).toBe(newDate.years);
  // })

  // it('should update active date on click', () =>{
  //   const date = moment().date(3).month(6).year(2017);
  //   const newDate = moment().date(5).month(6).year(2017).toObject();
  //   component.tempDate = date;
  //   component.dayClick(null, newDate);
  //   const monthArray = component.createMonthArray();
  //   const activeDate = component.setActiveDate(monthArray).filter(item => item.active === true);
  //   expect(activeDate.length).toBe(1);
  //   expect(activeDate[0].date).toBe(newDate.date);
  //   expect(activeDate[0].months).toBe(newDate.months);
  //   expect(activeDate[0].years).toBe(newDate.years);
  // })
});