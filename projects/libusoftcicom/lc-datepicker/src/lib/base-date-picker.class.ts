import {DateTime} from './date-time.class';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { LCDatePickerControl } from './lc-date-picker-control';

export interface ICalendarItem {
    value: number;
    text?: string;
    active?: boolean;
    disabled?: boolean;
    current?: boolean;
}

const ITimeUnits = [
    'year', 'years', 'y',
    'month', 'months', 'M',
    'week', 'weeks', 'w',
    'day', 'days', 'd',
    'hour', 'hours', 'h',
    'minute', 'minutes', 'm',
    'second', 'seconds', 's',
    'millisecond', 'milliseconds', 'ms',
] as const;
export type ITimeUnit = typeof ITimeUnits[number];


export enum Panel {
    Time,
    Day,
    Month,
    Year,
}

@Injectable()
export abstract class BaseDatePicker {

    protected calendarData: ICalendarItem[][];
    protected control: LCDatePickerControl;
    protected calendarChanges: Subject<void> = new Subject();

    public abstract getCalendarData(): ICalendarItem[][];
    public abstract setCalendarData(calendarData: ICalendarItem[][]): void;
    public abstract formatCalendarData(dateTime: DateTime): ICalendarItem[][];
    public abstract setSelectedDate(date: DateTime): void;

    public getCalendarChanges(): Observable<void> {
        return this.calendarChanges;
    }

    public setControl(control: LCDatePickerControl): void {
      this.control = control;
    }
}
