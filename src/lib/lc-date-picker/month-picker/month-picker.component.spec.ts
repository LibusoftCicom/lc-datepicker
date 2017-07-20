import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LCMonthPickerComponent } from './month-picker.component';
import { LcDatePickerModule } from '../../lc-date-picker.module';

import * as moment from 'moment';
export enum CalendarType {
    Time,
    DateTime,
    Date,
    Month,
    Year
}
describe('LCMonthPickerComponent', () => {
  let component: LCMonthPickerComponent;
  let element: HTMLElement;
  let fixture: ComponentFixture<LCMonthPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LCMonthPickerComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LCMonthPickerComponent);
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

  it('should create MonthPicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should format months array', () =>{
    const monthNames: string[] = component.shortMonthName;
    expect(monthNames.length).toBe(4);
    expect(monthNames[0].length).toBe(3);
    expect(monthNames[1].length).toBe(3);
    expect(monthNames[2].length).toBe(3);
    expect(monthNames[3].length).toBe(3);
  });

  it('should set month on click', () => {
      const date = moment().month(1);
      const newMonth = component.shortMonthName[1][2];
      component.setMonth(null , newMonth.index);
      expect(component.newDate.format('MMM')).toBe(newMonth.key);
  })

});
