import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LCDayPickerComponent } from './day-picker.component';

import { LcDatePickerModule, DatePickerConfig, ECalendarType } from '../../lc-date-picker.module';
import * as moment from 'moment';


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

    component.config = new DatePickerConfig();
    component.config.CalendarType = ECalendarType.Date;
    component.config.Localization = 'hr';
    component.config.MinDate = { years: 1900 };
    component.config.MaxDate = { years: 2100 };
    component.config.Labels = {
      confirmLabel: 'Odabir'
    };

    fixture.detectChanges();
  });

  it('should create DayPicker component', () => {
    expect(component).toBeTruthy();
  });

  it('should set active date', () => {
    const date = moment().date(5);
    component.newDate = date;
    component.formatMonthData();
    const activeDate = component.monthData.reduce(( source, second ) => source.concat(second)).filter(item => item != null ? item.active === true : false );

    expect(activeDate.length).toBe(1);
    expect(activeDate[0].date).toBe(date.toObject().date);
  });

  it('should set inactive dates', () => {
    const date = moment();
    const minDate = moment().add(-10, 'day');
    const maxDate = moment().add(10, 'day');

    component.newDate = date;
    component.config.MinDate = minDate.toObject();
    component.config.MaxDate = maxDate.toObject();
    component.config.setDisabledDates([ moment().add(-5, 'day').format('YYYY-MM-DD'), moment().add(3, 'day').format('YYYY-MM-DD') ]);

    component.formatMonthData();

    const flatDates = component.monthData.reduce(( source, second ) => [...source, ...second]);
    const activeDateIndex = flatDates.findIndex((date) => date != null ? date.active == true : false );

    if(flatDates[activeDateIndex+3] ){
      expect( flatDates[activeDateIndex+3].disabled ).toBe( true );
    }
    if(flatDates[activeDateIndex+2] ){
      expect( flatDates[activeDateIndex+2].disabled ).toBe( undefined );
    }
    if(flatDates[activeDateIndex+10] ){
      expect( flatDates[activeDateIndex+10].disabled ).toBe( undefined );
    }
    if(flatDates[activeDateIndex+11] ){
      expect( flatDates[activeDateIndex+11].disabled ).toBe( true );
    }
    if(flatDates[activeDateIndex-5]){
      expect( flatDates[activeDateIndex-5].disabled ).toBe( true );
    }
  });

  it('should switch to previous month on click', () => {
    const currentMonth = component.newDate.month();
    component.prevMonth();
    const monthArray = component.monthData.reduce(( source, second ) => source.concat(second));
    expect(monthArray[10].months).toBe(currentMonth == 0 ? 11 : currentMonth - 1);
  })

  it('should switch to next month on click', () => {
    const currentMonth = component.newDate.month();
    component.nextMonth();
    const monthArray = component.monthData.reduce(( source, second ) => source.concat(second));
    expect(monthArray[10].months).toBe( currentMonth == 11 ? 0 : currentMonth + 1);
  })

  it('should switch to previous month on scroll up', () => {
    const date = moment().month(3);
    component.newDate = date;
    const InitMonthArray = component.createMonthArray();
    expect(InitMonthArray[0].months).toBe(4);
    let scrollEvent = new WheelEvent('test', {deltaY: 1})
    component.monthScroll(scrollEvent);
    const monthArray = component.createMonthArray();
    expect(monthArray[0].months).toBe(3);
  })

  it('should switch to next month on scroll down', () => {
    const date = moment().month(3);
    component.newDate = date;
    const InitMonthArray = component.createMonthArray();
    expect(InitMonthArray[0].months).toBe(4);
    let scrollEvent = new WheelEvent('test', {deltaY: -1})
    component.monthScroll(scrollEvent);
    const monthArray = component.createMonthArray();
    expect(monthArray[0].months).toBe(5);
  })

  it('should set new date on click', () => {
    const date = moment().date(3);
    const newDate = moment().date(5).month(6).year(2017).toObject();
    component.newDate = date;
    component.dayClick(null, newDate);
    expect(component.newDate.date()).toBe(newDate.date);
    expect(component.newDate.month()).toBe(newDate.months);
    expect(component.newDate.year()).toBe(newDate.years);
  })


  it('should correctly set date when new date has less days than current date', () =>{
    const date = moment().year(2018).month(3).date(30);
    const newDate = moment().year(2018).month(2).date(31).toObject();
    component.newDate = date;
    component.dayClick(null, newDate);
    expect(component.newDate.date()).toBe(newDate.date);
    expect(component.newDate.month()).toBe(newDate.months);
    expect(component.newDate.year()).toBe(newDate.years);
  })
});