import { EventEmitter, ChangeDetectorRef, ElementRef, OnInit, OnChanges } from '@angular/core';
import { DatePickerConfig, ECalendarType } from './lc-date-picker-config-helper';
import * as moment from 'moment';
export declare enum panels {
    Time = 0,
    Day = 1,
    Month = 2,
    Year = 3,
}
export declare class LCDatePickerComponent implements OnInit, OnChanges {
    private cd;
    private _elementRef;
    originalDate: moment.Moment;
    newDate: moment.Moment;
    activePanel: panels;
    panels: any;
    locale: any;
    componentMargin: any;
    opened: boolean;
    openedChange: EventEmitter<boolean>;
    config: DatePickerConfig;
    date: moment.Moment;
    dateChange: EventEmitter<string>;
    constructor(cd: ChangeDetectorRef, _elementRef: ElementRef);
    ngOnInit(): void;
    initCalendar(): void;
    ngOnChanges(changes: any): void;
    setPanel(panel: ECalendarType): void;
    onTimeSelected(date: moment.Moment): void;
    onDaySelected(date: moment.Moment): void;
    onMonthSelected(date: moment.Moment): void;
    onYearSelected(date: moment.Moment): void;
    onSwitchPannel(panel: panels): void;
    onResetDate(): void;
    private isDateAvailable(date);
    confirm(): void;
    close(): void;
    calendarSize(type: ECalendarType): number;
}
