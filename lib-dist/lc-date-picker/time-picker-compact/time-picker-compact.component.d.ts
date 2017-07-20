import { EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import * as moment from 'moment';
export declare class LCTimePickerCompactComponent implements OnInit {
    private cd;
    monthData: any;
    shortDayName: any;
    shortMonthName: any;
    is24HourFormat: boolean;
    newDate: moment.Moment;
    config: any;
    selected: EventEmitter<moment.Moment>;
    constructor(cd: ChangeDetectorRef);
    ngOnInit(): void;
    setTimeFormat(): void;
    addHour(): void;
    subtractHour(): void;
    addMinute(): void;
    subtractMinute(): void;
    hourScroll(event: any): void;
    minuteScroll(event: any): void;
    toggleMeridiem(): void;
    private preventDefault(e);
    private stopPropagation(e);
}
