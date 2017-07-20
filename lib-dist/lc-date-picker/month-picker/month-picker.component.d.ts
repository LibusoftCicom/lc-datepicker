/// <reference types="moment" />
import { EventEmitter, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';
export declare enum Panels {
    Time = 0,
    Day = 1,
    Month = 2,
    Year = 3,
}
export declare class LCMonthPickerComponent implements OnInit, OnChanges {
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
    switchPannels(event: Event, panel: Panels): void;
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    formatMonths(months: string[]): any[];
    setMonth(event: any, item: any): void;
    resetDate(event: any): void;
}
