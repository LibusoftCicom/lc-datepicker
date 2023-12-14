import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { LCTimePickerComponent } from './time-picker.component';
import {DatePickerConfig, ECalendarType} from './../lc-date-picker.module';
import {LCDatePickerAdapter} from '../lc-date-picker-adapter.class';
import {LCTimeSpinnerComponent} from './time-spinner.component';
import {LuxonDateAdapterService} from '../../../../../../src/app/luxon-date-adapter.service';

describe('LCTimePickerComponent', () => {
    let component: LCTimePickerComponent;
    let fixture: ComponentFixture<LCTimePickerComponent>;
    let dateAdapter: LCDatePickerAdapter;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                LCTimePickerComponent,
                LCTimeSpinnerComponent
            ],
            providers: [{
                provide: LCDatePickerAdapter,
                useClass: LuxonDateAdapterService
            }]
        })
            .compileComponents()
            .then(() => {
                dateAdapter = TestBed.inject(LCDatePickerAdapter);
                fixture = TestBed.createComponent(LCTimePickerComponent);
                component = fixture.componentInstance;
                const today = dateAdapter.today();

                component.config = new DatePickerConfig();
                component.config.setCalendarType(ECalendarType.Time);
                component.config.setLocalization('hr');
                component.config.setMinDate(dateAdapter.setParts(dateAdapter.getStartOfYear(today), {year: 1900}));
                component.config.setMaxDate(dateAdapter.setParts(dateAdapter.getStartOfYear(today), {year: 2099}));
                component.config.labels = { confirmLabel: 'Odabir' };

                component.value = today;

                fixture.detectChanges();
            });
    }));

    it('should create TimePicker component', () => {
        expect(component).toBeTruthy();
    });

    it('should check 12h format', () => {
        component.value = dateAdapter.now();
        component.config.setTimeFormat(false);
        component.setTimeFormat();
        expect(component.is24HourFormat).toBeFalsy();
    });

    it('should check 24h format', () => {

        component.value = dateAdapter.now();
        component.config.setTimeFormat(true);
        component.setTimeFormat();
        expect(component.is24HourFormat).toBeTruthy();
    });

    it('should add hour on click', () => {

        component.value = dateAdapter.setParts(dateAdapter.now(), {hour: 5});
        component.addHour();
        expect(component.getValue().getHour()).toBe(6);
    });

    it('should subtract hour on click', () => {

        component.value = dateAdapter.setParts(dateAdapter.now(), {hour: 5});
        component.subtractHour();
        expect(component.getValue().getHour()).toBe(4);
    });

    it('should add minute on click', () => {

        component.value = dateAdapter.setParts(dateAdapter.now(), {minute: 15});
        component.addMinute();
        expect(component.getValue().getMinute()).toBe(16);
    });

    it('should subtract minute on click', () => {

        component.value = dateAdapter.setParts(dateAdapter.now(), {minute: 15});
        component.subtractMinute();
        expect(component.getValue().getMinute()).toBe(14);
    });

    it('should add hour on scroll up', () => {

        component.value = dateAdapter.setParts(dateAdapter.now(), {hour: 5});
        let scrollEvent = new WheelEvent('test', { deltaY: -1 })
        component.hourScroll(scrollEvent);
        expect(component.getValue().getHour()).toBe(6);
    });

    it('should subtract hour on scroll down', () => {

        component.value = dateAdapter.setParts(dateAdapter.now(), {hour: 5});
        let scrollEvent = new WheelEvent('test', { deltaY: 1 })
        component.hourScroll(scrollEvent);
        expect(component.getValue().getHour()).toBe(4);
    });

    it('should add minute on scroll up', () => {

        component.value = dateAdapter.setParts(dateAdapter.now(), {minute: 15});
        let scrollEvent = new WheelEvent('test', { deltaY: -1 })
        component.minuteScroll(scrollEvent);
        expect(component.getValue().getMinute()).toBe(16);
    });

    it('should subtract minute on scroll down', () => {

        component.value = dateAdapter.setParts(dateAdapter.now(), {minute: 15});
        let scrollEvent = new WheelEvent('test', { deltaY: 1 })
        component.minuteScroll(scrollEvent);
        expect(component.getValue().getMinute()).toBe(14);
    });

    it('should toggle meridiem on click', () => {

        component.value = dateAdapter.setParts(dateAdapter.now(), {hour: 5});
        component.config.setTimeFormat(false);
        component.setTimeFormat();
        component.toggleMeridiem();
        expect(component.getValue().getHour()).toBe(17);
        component.toggleMeridiem();
        expect(component.getValue().getHour()).toBe(5);
    });

});
