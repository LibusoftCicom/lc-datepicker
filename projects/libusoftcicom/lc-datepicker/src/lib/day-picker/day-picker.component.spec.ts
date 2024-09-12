import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LCDayPickerComponent } from './day-picker.component';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';
import { ECalendarType } from '../enums';
import { LCDayPickerButtonComponent } from './day-picker-button.component';
import { IDatePickerConfiguration, LCDatePickerControl } from '../lc-date-picker-control';

describe('LCDayPickerComponent', () => {
    let component: LCDayPickerComponent;
    let fixture: ComponentFixture<LCDayPickerComponent>;
    let dateAdapter: LCDatePickerAdapter;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                LCDayPickerComponent,
                LCDayPickerButtonComponent,
            ],
            providers: [{provide: LCDatePickerAdapter, useClass: LuxonDateAdapterService}]
        })
            .compileComponents()
            .then(() => {
                dateAdapter = TestBed.inject(LCDatePickerAdapter);
                fixture = TestBed.createComponent(LCDayPickerComponent);
                component = fixture.componentInstance;
                const today = dateAdapter.today();

                const config:IDatePickerConfiguration = {
                  value: dateAdapter.toISOString(today),
                  calendarType: ECalendarType.Date,
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

    it('should create DayPicker component', () => {
        expect(component).toBeTruthy();
    });

    it('should set active date', () => {

        const date = dateAdapter.setParts(component.control.getValue(), {date: 2});

        component.control.setValue(date, true);

        component.getDayPicker().setSelectedDate(date);

        const activeDate = component.calendarData
            .reduce(( source, second ) => source.concat(second))
            .filter(item => item != null ? item.active : false );

        expect(activeDate.length).toBe(1);
        expect(activeDate[0].value).toBe(date.getDate());
    });

    it('should set inactive dates', () => {
        const date = dateAdapter.today();
        const minDate = dateAdapter.add(date, -10, 'day');
        const maxDate = dateAdapter.add(date, 10, 'day');

        component.control.setMinDate(minDate);
        component.control.setMaxDate(maxDate);
        component.control.setDisabledDates([
            dateAdapter.toISOString(dateAdapter.add(date, -5, 'day')),
            dateAdapter.toISOString(dateAdapter.add(date, 3, 'day')),
        ]);

        component.control.setValue(date);
        component.getDayPicker().setSelectedDate(component.control.getValue());

        const flatDates = component.calendarData.reduce(( source, second ) => [...source, ...second]);
        const activeDateIndex = flatDates.findIndex((date) => date != null ? date.active : false );

        if (flatDates[activeDateIndex + 3]) {
            expect( flatDates[activeDateIndex + 3].disabled ).toBe( true );
        }
        if (flatDates[activeDateIndex + 2]) {
            expect( flatDates[activeDateIndex + 2].disabled ).toBe( undefined );
        }
        if (flatDates[activeDateIndex + 10]) {
            expect( flatDates[activeDateIndex + 10].disabled ).toBe( undefined );
        }
        if (flatDates[activeDateIndex + 11]) {
            expect( flatDates[activeDateIndex + 11].disabled ).toBe( true );
        }
        if(flatDates[activeDateIndex - 5]){
            expect( flatDates[activeDateIndex - 5].disabled ).toBe( true );
        }
    });

    it('should switch to previous month on click', () => {
        const currentMonth = component.control.getValue().getMonth();
        component.previousMonth();

        const newMonth = component.control.getValue().getMonth();

        expect(newMonth).toBe(currentMonth === 0 ? 11 : currentMonth - 1);
    });

    it('should switch to next month on click', () => {
        const currentMonth = component.control.getValue().getMonth();
        component.nextMonth();

        const newMonth = component.control.getValue().getMonth();

        expect(newMonth).toBe( currentMonth === 11 ? 0 : currentMonth + 1);
    });

    it('should switch to previous month on scroll up', () => {
        component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {month: 4}));

        expect(component.control.getValue().getMonth()).toBe(4);

        const scrollEvent = new WheelEvent('test', {deltaY: 1});
        component.monthScroll(scrollEvent);

        expect(component.control.getValue().getMonth()).toBe(3);
    });

    it('should switch to next month on scroll down', () => {
        component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {month: 4}));

        expect(component.control.getValue().getMonth()).toBe(4);

        const scrollEvent = new WheelEvent('test', {deltaY: -1});
        component.monthScroll(scrollEvent);

        expect(component.control.getValue().getMonth()).toBe(5);
    });

    it('should set new date on click', () => {
        const date = dateAdapter.setParts(dateAdapter.today(), {date: 3});
        const newDate = dateAdapter.setParts(dateAdapter.today(), {date: 5});
        component.control.setValue(date);
        component.control.setValue(newDate, true);
        expect(component.control.getValue().getDate()).toBe(newDate.getDate());
        expect(component.control.getValue().getMonth()).toBe(newDate.getMonth());
        expect(component.control.getValue().getYear()).toBe(newDate.getYear());
    });

    it('should correctly set date when new date has less days than current date', () =>{
        component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {date: 31, month: 4}));
        component.nextMonth();
        expect(component.control.getValue().getDate()).toBe(30);
        expect(component.control.getValue().getMonth()).toBe(5);
    });
});
