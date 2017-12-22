import { EventEmitter, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import * as moment from 'moment';
export declare enum Panels {
    Time = 0,
    Day = 1,
    Month = 2,
    Year = 3,
}
export interface IDateObject {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    date: number;
    months: number;
    years: number;
    active?: boolean;
    disabled?: boolean;
    current?: boolean;
}
export declare class LCDayPickerComponent implements OnInit, OnChanges {
    private cd;
    tempDate: moment.Moment;
    monthData: Array<Array<IDateObject>>;
    shortDayName: any;
    shortMonthName: any;
    panels: typeof Panels;
    private currentDate;
    private minDate;
    private maxDate;
    newDate: moment.Moment;
    config: DatePickerConfig;
    selected: EventEmitter<moment.Moment>;
    switchPannel: EventEmitter<Panels>;
    reset: EventEmitter<void>;
    constructor(cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    formatMonthData(): void;
    createMonthArray(): IDateObject[];
    private isCurrentDate(date);
    private isDateDisabled(date);
    private prepareMaxMinDates();
    nextMonth(event?: any): void;
    prevMonth(event?: any): void;
    dayClick(event: Event, item: any): void;
    monthScroll(event: WheelEvent): void;
    switchPannels(event: Event, panel: Panels): void;
    private preventDefault(e);
    private stopPropagation(e);
    resetDate(event: any): void;
}
