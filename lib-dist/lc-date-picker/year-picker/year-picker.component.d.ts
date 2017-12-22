import { EventEmitter, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import * as moment from 'moment';
export interface IYearobject {
    year: number;
    active?: boolean;
    disabled?: boolean;
    current?: boolean;
}
export declare class LCYearPickerComponent implements OnInit, OnChanges {
    private cd;
    tempDate: number;
    initYear: number;
    yearsArray: IYearobject[];
    yearsArrayFormated: IYearobject[][];
    newDate: moment.Moment;
    config: DatePickerConfig;
    selected: EventEmitter<moment.Moment>;
    reset: EventEmitter<void>;
    constructor(cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    checkInitYear(): void;
    formatYears(): void;
    prevYears(): void;
    nextYears(): void;
    setYear(event: any, item?: IYearobject): void;
    yearScroll(event: any): void;
    private preventDefault(e);
    private stopPropagation(e);
    resetDate(event: any): void;
}
