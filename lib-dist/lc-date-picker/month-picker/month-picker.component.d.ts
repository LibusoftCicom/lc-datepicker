import { EventEmitter, ChangeDetectorRef, OnInit, OnChanges } from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import * as moment from 'moment';
export declare enum Panels {
    Time = 0,
    Day = 1,
    Month = 2,
    Year = 3,
}
export interface IMonthObject {
    key: string;
    index: number;
    active?: boolean;
    disabled?: boolean;
    current?: boolean;
}
export declare class LCMonthPickerComponent implements OnInit, OnChanges {
    private cd;
    tempDate: moment.Moment;
    shortMonthName: Array<Array<IMonthObject>>;
    panels: typeof Panels;
    newDate: moment.Moment;
    config: DatePickerConfig;
    selected: EventEmitter<moment.Moment>;
    switchPannel: EventEmitter<Panels>;
    reset: EventEmitter<void>;
    constructor(cd: ChangeDetectorRef);
    switchPannels(event: Event, panel: Panels): void;
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    formatMonths(months: IMonthObject[]): any[];
    setMonth(event: any, item?: IMonthObject): void;
    resetDate(event: any): void;
}
