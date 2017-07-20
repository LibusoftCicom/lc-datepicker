import { EventEmitter, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';
export declare enum Panels {
    Time = 0,
    Day = 1,
    Month = 2,
    Year = 3,
}
export declare class LCDayPickerComponent implements OnInit, OnChanges {
    private cd;
    tempDate: moment.Moment;
    monthData: any;
    shortDayName: any;
    shortMonthName: any;
    panels: typeof Panels;
    newDate: moment.Moment;
    config: any;
    selected: EventEmitter<moment.Moment>;
    switchPannel: EventEmitter<Panels>;
    reset: EventEmitter<void>;
    constructor(cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    formatMonthData(): void;
    createMonthArray(): {
        date: number;
        years: number;
        months: number;
        hours: number;
        minutes: number;
        seconds: number;
        milliseconds: number;
    }[];
    setActiveDate(date: any): any;
    nextMonth(event?: any): void;
    prevMonth(event?: any): void;
    dayClick(event: Event, item: any): void;
    monthScroll(event: WheelEvent): void;
    switchPannels(event: Event, panel: Panels): void;
    private preventDefault(e);
    private stopPropagation(e);
    resetDate(event: any): void;
}
