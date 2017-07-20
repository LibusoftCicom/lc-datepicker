import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LCYearPickerComponent } from './year-picker.component';
import { LcDatePickerModule } from '../../lc-date-picker.module';

import * as moment from 'moment';
export enum CalendarType {
    Time,
    DateTime,
    Date,
    Month,
    Year
}
describe('LCYearPickerComponent', () => {
  let component: LCYearPickerComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<LCYearPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LCYearPickerComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LCYearPickerComponent);
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

  it('should create YearPicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should format years array', () => {
    const date = component.newDate;
    const yearArray = component.yearsArrayFormated;
    expect(yearArray.length).toBe(5);
    expect(yearArray[0].length).toBe(5);
    // expect(yearArray[0][0]).toBe(component.newDate.year() - 12);
    // expect(yearArray[2][2]).toBe(component.newDate.year());
    // expect(yearArray[4][4]).toBe(component.newDate.year() + 12);
  })

  it('should set year on click', () => {
      component.newDate = moment().year(2017);
      const newDate = moment().year(2015);
      expect(component.newDate.year()).not.toBe(newDate.year());
      component.setYear(null, newDate.year());
      expect(component.newDate.year()).toBe(newDate.year());
  })

  it('should switch to previous year group on click', () => {
    const date = moment().year(2017);
    component.newDate = date;
    const yearArray = component.yearsArrayFormated;
    component.prevYears();
    const prevYearArray = component.yearsArrayFormated;
    //expect(prevYearArray[4][4]).toBe(yearArray[0][0] - 1)
  })

  it('should switch to next year group on click', () => {
    const date = moment().year(2017);
    component.newDate = date;
    const yearArray = component.yearsArrayFormated;
    component.nextYears();
    const nextYearArray = component.yearsArrayFormated;
    //expect(nextYearArray[0][0]).toBe(yearArray[4][4] + 1)
  })

  // it('should switch to previous year group on scroll up', () => {
  //     const date = moment().year(2017);
  //     component.newDate = date;
  //     const yearArray = component.yearsArray;
  //     const scrollEvent = new WheelEvent('test', {deltaY: 1});
  //     component.yearScroll(scrollEvent);
  //     const newYearArray = component.yearsArray;
  //     expect(newYearArray[4][4]).toBe(yearArray[0][0] - 1)
  // })
 
  // it('should switch to next year group on scroll up', () => {
  //     const date = moment().year(2017);
  //     component.newDate = date;
  //     const yearArray = component.yearsArray;
  //     const scrollEvent = new WheelEvent('test', {deltaY: -1});
  //     component.yearScroll(scrollEvent);
  //     const newYearArray = component.yearsArray;
  //     expect(newYearArray[0][0]).toBe(yearArray[4][4] + 1)
  // })

});
