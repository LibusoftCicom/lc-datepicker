import { Injectable } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LCDatePickerComponent } from './lc-date-picker.component';
import { LCTimePickerComponent } from './time-picker/time-picker.component';
import { LCTimePickerCompactComponent } from './time-picker-compact/time-picker-compact.component';

import { LCDayPickerComponent } from './day-picker/day-picker.component';
import { LCMonthPickerComponent } from './month-picker/month-picker.component';
import { LCYearPickerComponent } from './year-picker/year-picker.component';
import { DatePickerConfig, ECalendarType } from './lc-date-picker-config-helper';

@Injectable()
class Lc10L10nMock {

    public getShortcutLetter(key: string): string {
        return "";
    }
}

import * as moment from 'moment';


describe('LCDatePickerComponent', () => {
  let component: LCDatePickerComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<LCDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LCDatePickerComponent,
        LCTimePickerComponent,
        LCDayPickerComponent,
        LCMonthPickerComponent,
        LCYearPickerComponent,
        LCTimePickerCompactComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LCDatePickerComponent);
    component = fixture.componentInstance;
     element = fixture.debugElement.nativeElement;
    component.config = new DatePickerConfig();
      component.config.CalendarType = ECalendarType.DateTime;
    component.config.Localization = 'hr';
    fixture.detectChanges();
  });

  it('should create DatePicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should set init date', () => {
      const date = moment();
      component.date = date;
      expect(component.date.toString()).toBe(date.toString())
  })

  it('should set new date on dayPicker click', () => {
    const date = moment();
    component.date = date;
    const newDate = moment().day('1');
    component.onDaySelected(newDate);
    expect(component.newDate.toString()).toBe(newDate.toString())
  })

   it('should set new month on monthPicker click', () => {
    const date = moment();
    date.month(3);
    date.day(5);
    component.newDate = date;
    const newDate = moment().month(1).day(1);
    component.onMonthSelected(newDate);
    expect(component.newDate.month()).toBe(newDate.month());
  })

  it('should set new year on yearPicker click', () => {
    const date = moment().month(3).day(5).year(2017);
    component.newDate = date;
    const newDate = moment().month(1).day(1).year(2016);
    component.onYearSelected(newDate);
    expect(component.newDate.year()).toBe(newDate.year());
  })

  it('should switch on Month panel on click', () => {
    component.onSwitchPannel(component.panels.Month)
    expect(component.activePanel).toBe(component.panels.Month)
  })

  it('should emit date on click', () => {
    const date = moment().minute(5).second(45);
    component.newDate = date;
    component.onDaySelected(date);
    let emitedDate: string;
    component.dateChange.subscribe((date: string) => emitedDate = date);
    component.confirm();
    expect(emitedDate).toBe(date.toISOString());
  })
});
