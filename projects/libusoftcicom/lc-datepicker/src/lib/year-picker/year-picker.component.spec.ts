import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LCYearPickerComponent } from './year-picker.component';
import { LcDatePickerModule, DatePickerConfig, ECalendarType } from './../lc-date-picker.module';

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

    component.config = new DatePickerConfig();
    component.config.CalendarType = ECalendarType.Year;
    component.config.Localization = 'hr';
    component.config.MinDate = { years: 1900 };
    component.config.MaxDate = { years: 2100 };
    component.config.Labels = {
      confirmLabel: 'Odabir'
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
  })

  it('should set year on click', () => {
    component.newDate = moment().year(2017);
    const newDate = moment().year(2015);
    expect(component.newDate.year()).not.toBe(newDate.year());
    component.setYear({ year: newDate.year() });
    expect(component.newDate.year()).toBe(newDate.year());
  })

  it('should switch to previous year group on click', () => {
    const date = moment().year(2017);
    component.newDate = date;
    component.formatYears();
    const yearArray = component.yearsArrayFormated;
    component.prevYears();
    const prevYearArray = component.yearsArrayFormated;
    expect(prevYearArray[4][4].year).toBe(yearArray[0][0].year - 1)
  })

  it('should switch to next year group on click', () => {
    const date = moment().year(2017);
    component.newDate = date;
    component.formatYears();
    const yearArray = component.yearsArrayFormated;
    component.nextYears();
    const nextYearArray = component.yearsArrayFormated;
    expect(nextYearArray[0][0].year).toBe(yearArray[4][4].year + 1)
  })

  it('should switch to previous year group on scroll up', () => {
    const date = moment().year(2017);
    component.newDate = date;
    component.formatYears();
    const yearArray = component.yearsArrayFormated;
    const scrollEvent = new WheelEvent('test', { deltaY: 1 });
    component.yearScroll(scrollEvent);
    const newYearArray = component.yearsArrayFormated;
    expect(newYearArray[4][4].year).toBe(yearArray[0][0].year - 1)
  })

  it('should switch to next year group on scroll up', () => {
    const date = moment().year(2017);
    component.newDate = date;
    component.formatYears();
    const yearArray = component.yearsArrayFormated;
    const scrollEvent = new WheelEvent('test', { deltaY: -1 });
    component.yearScroll(scrollEvent);
    const newYearArray = component.yearsArrayFormated;
    expect(newYearArray[0][0].year).toBe(yearArray[4][4].year + 1)
  })

});
