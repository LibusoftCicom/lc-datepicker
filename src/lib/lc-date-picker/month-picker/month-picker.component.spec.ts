import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LCMonthPickerComponent } from './month-picker.component';
import { LcDatePickerModule, DatePickerConfig, ECalendarType } from '../../lc-date-picker.module';

import * as moment from 'moment';

describe('LCMonthPickerComponent', () => {
  let component: LCMonthPickerComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<LCMonthPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LCMonthPickerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LCMonthPickerComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    component.newDate = moment();

    component.config = new DatePickerConfig();
    component.config.CalendarType = ECalendarType.MonthYear;
    component.config.Localization = 'hr';
    component.config.MinDate = { years: 1900 };
    component.config.MaxDate = { years: 2100 };
    component.config.Labels = {
      confirmLabel: 'Odabir'
    };

    fixture.detectChanges();
  });

  it('should create MonthPicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should format months array', () => {
    const monthNames = component.shortMonthName;
    expect(monthNames.length).toBe(4);
    expect(monthNames[0].length).toBe(3);
    expect(monthNames[1].length).toBe(3);
    expect(monthNames[2].length).toBe(3);
    expect(monthNames[3].length).toBe(3);
  });

  it('should set month on click', () => {
    const date = moment().month(1);
    const newMonth = component.shortMonthName[1][2];
    component.setMonth(newMonth);
    expect(component.newDate.format('MMM')).toBe(newMonth.key);
  });
});
