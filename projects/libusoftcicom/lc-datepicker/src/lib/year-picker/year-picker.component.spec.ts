import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LCYearPickerComponent } from './year-picker.component';
import { ECalendarType, IDatePickerConfiguration, LCDatePickerControl } from './../lc-date-picker.module';

import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LCYearPickerButtonComponent } from './year-picker-button.component';
import { LuxonDateAdapterService } from '../../../../../../src/app/luxon-date-adapter.service';

describe('LCYearPickerComponent', () => {
    let component: LCYearPickerComponent;
    let fixture: ComponentFixture<LCYearPickerComponent>;
    let dateAdapter: LCDatePickerAdapter;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                LCYearPickerComponent,
                LCYearPickerButtonComponent
            ],
            providers: [{
                provide: LCDatePickerAdapter,
                useClass: LuxonDateAdapterService
            }]
        })
            .compileComponents()
            .then(() => {
              dateAdapter = TestBed.inject(LCDatePickerAdapter);
              fixture = TestBed.createComponent(LCYearPickerComponent);
              component = fixture.componentInstance;
              const today = dateAdapter.today();

              const config: IDatePickerConfiguration = {
                value: dateAdapter.toISOString(today),
                calendarType: ECalendarType.Year,
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

    it('should create YearPicker component', () => {
        expect(component).toBeTruthy();
    });

    it('should format years array', () => {
        const years = component.calendarData;
        expect(years.length).toBe(5);
        expect(years[0].length).toBe(5);
    });

    it('should set year on click', () => {
        component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {year: 2017}));
        const newDate =  dateAdapter.setParts(dateAdapter.today(), {year: 2015});
        expect(component.control.getValue().getYear()).not.toBe(newDate.getYear());
        component.control.setValue(newDate, true);
        expect(component.control.getValue().getYear()).toBe(newDate.getYear());
    });

    it('should switch to previous year group on click', () => {
        component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {year: 2017}));
        const yearArray = component.calendarData;
        component.previousYears();
        const prevYearArray = component.calendarData;
        expect(prevYearArray[4][4].value).toBe(yearArray[0][0].value - 1);
    });

    it('should switch to next year group on click', () => {
        component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {year: 2017}));
        const yearArray = component.calendarData;
        component.nextYears();
        const nextYearArray = component.calendarData;
        expect(nextYearArray[0][0].value).toBe(yearArray[4][4].value + 1);
    });

    it('should switch to previous year group on scroll up', () => {
        component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {year: 2017}));
        const yearArray = component.calendarData;
        const scrollEvent = new WheelEvent('test', { deltaY: 1 });
        component.yearScroll(scrollEvent);
        const newYearArray = component.calendarData;
        expect(newYearArray[4][4].value).toBe(yearArray[0][0].value - 1);
    });

    it('should switch to next year group on scroll up', () => {
        component.control.setValue(dateAdapter.setParts(dateAdapter.today(), {year: 2017}));
        const yearArray = component.calendarData;
        const scrollEvent = new WheelEvent('test', { deltaY: -1 });
        component.yearScroll(scrollEvent);
        const newYearArray = component.calendarData;
        expect(newYearArray[0][0].value).toBe(yearArray[4][4].value + 1)
    });
});
