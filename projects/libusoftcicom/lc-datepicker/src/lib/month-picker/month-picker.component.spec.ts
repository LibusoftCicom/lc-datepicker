import { ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { LCMonthPickerComponent } from './month-picker.component';
import {DatePickerConfig, ECalendarType,} from './../lc-date-picker.module';

import {LCMonthPickerButtonComponent} from './month-picker-button.component';
import {LCDatePickerAdapter} from '../lc-date-picker-adapter.class';
import {LuxonDateAdapterService} from '../../../../../../src/app/luxon-date-adapter.service';

describe('LCMonthPickerComponent', () => {
    let component: LCMonthPickerComponent;
    let fixture: ComponentFixture<LCMonthPickerComponent>;
    let dateAdapter: LCDatePickerAdapter;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                LCMonthPickerComponent,
                LCMonthPickerButtonComponent,
            ],
            providers: [{
                provide: LCDatePickerAdapter,
                useClass: LuxonDateAdapterService
            }]
        })
            .compileComponents()
            .then(() => {
                dateAdapter = TestBed.inject(LCDatePickerAdapter);
                fixture = TestBed.createComponent(LCMonthPickerComponent);
                component = fixture.componentInstance;
                const today = dateAdapter.today();

                component.config = new DatePickerConfig();
                component.config.setCalendarType(ECalendarType.MonthYear);
                component.config.setLocalization('hr');
                component.config.setMinDate(dateAdapter.setParts(dateAdapter.getStartOfYear(today), {year: 1900}));
                component.config.setMaxDate(dateAdapter.setParts(dateAdapter.getStartOfYear(today), {year: 2099}));
                component.config.labels = { confirmLabel: 'Odabir' };
                component.value = today;

                fixture.detectChanges();
            });
    }));

    it('should create MonthPicker component', () => {
        expect(component).toBeTruthy();
    });

    it('should format months array', () => {
        const months = component.calendarData;
        expect(months.length).toBe(4);
        expect(months[0].length).toBe(3);
        expect(months[1].length).toBe(3);
        expect(months[2].length).toBe(3);
        expect(months[3].length).toBe(3);
    });

    it('should set month on click', () => {
        const month = dateAdapter.getStartOfMonth(dateAdapter.today());
        component.value = month;
        expect(component.getValue().getMonth()).toBe(month.getMonth());
        component.selectItem({value: 1});
        expect(component.getValue().getMonth()).toBe(1);
    });

    it('should switch to previous year on scroll up', () => {
        component.value = dateAdapter.setParts(dateAdapter.today(), {month: 0, year: 2023});

        expect(component.getValue().getYear()).toBe(2023);

        const scrollEvent = new WheelEvent('test', {deltaY: 1});
        component.monthScroll(scrollEvent);

        expect(component.getValue().getYear()).toBe(2022);
    });

    it('should switch to next year on scroll down', () => {
        component.value = dateAdapter.setParts(dateAdapter.today(), {month: 0, year: 2023});

        expect(component.getValue().getYear()).toBe(2023);

        const scrollEvent = new WheelEvent('test', {deltaY: -1});
        component.monthScroll(scrollEvent);

        expect(component.getValue().getYear()).toBe(2024);
    });
});
