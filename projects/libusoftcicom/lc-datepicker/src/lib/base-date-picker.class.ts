import {DateTime} from './date-time.class';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

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

    protected selectedDateTime: DateTime;
    protected calendarData: ICalendarItem[][];
    protected minDate: DateTime = null;
    protected maxDate: DateTime = null;
    protected DEFAULT_MIN_DATE: DateTime = new DateTime(
        1900,
        0,
        1,
        0,
        0,
        0,
        0,
        'UTC'
    );
    protected DEFAULT_MAX_DATE: DateTime = new DateTime(
        2099,
        0,
        1,
        0,
        0,
        0,
        0,
        'UTC'
    );
    protected locale: string;
    protected timezone: string;
    protected calendarChanges: Subject<void> = new Subject();

    public abstract getCalendarData(): ICalendarItem[][];
    public abstract setCalendarData(calendarData: ICalendarItem[][]): void;
    public abstract selectItem(item: ICalendarItem): void;
    public abstract formatCalendarData(): ICalendarItem[][];
    public abstract getSelectedDateTime(): DateTime;
    public abstract getSelectedDateTime(): DateTime;
    public abstract setCalendarBoundaries(minDateTime: DateTime, maxDateTime: DateTime): void;
    public abstract setSelectedDate(date: DateTime): void;

    public setMinDate(date: DateTime): void {
        this.minDate = date.clone();
    }

    public setMaxDate(date: DateTime): void {
        this.maxDate = date.clone();
    }

    public getLocale(): string {
        return this.locale;
    }

    public setLocale(locale: string): void {
        this.locale = locale;
    }

    public getTimezone(): string {
        return this.timezone;
    }

    public setTimezone(timezone: string): void {
        this.timezone = timezone;
    }

    public getCalendarChanges(): Observable<void> {
        return this.calendarChanges;
    }
}
