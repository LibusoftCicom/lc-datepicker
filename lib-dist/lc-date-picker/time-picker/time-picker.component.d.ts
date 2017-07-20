import { EventEmitter, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';
export declare class LCTimePickerComponent implements OnInit, OnChanges {
    private cd;
    is24HourFormat: boolean;
    newDate: moment.Moment;
    config: any;
    selected: EventEmitter<moment.Moment>;
    reset: EventEmitter<void>;
    constructor(cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    setTimeFormat(): void;
    addHour(): void;
    subtractHour(): void;
    addMinute(): void;
    subtractMinute(): void;
    hourScroll(event: any): void;
    minuteScroll(event: any): void;
    toggleMeridiem(event: any): void;
    private preventDefault(e);
    private stopPropagation(e);
    resetDate(event: any): void;
}
