import { EventEmitter, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';
export declare class LCYearPickerComponent implements OnInit, OnChanges {
    private cd;
    tempDate: number;
    initYear: number;
    yearsArray: number[];
    yearsArrayFormated: number[][];
    newDate: moment.Moment;
    config: any;
    selected: EventEmitter<moment.Moment>;
    reset: EventEmitter<void>;
    constructor(cd: ChangeDetectorRef);
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    checkInitYear(): void;
    formatYears(): void;
    prevYears(): void;
    nextYears(): void;
    setYear(event: any, item: any): void;
    yearScroll(event: any): void;
    private preventDefault(e);
    private stopPropagation(e);
    resetDate(event: any): void;
}
