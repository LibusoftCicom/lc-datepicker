import {DateTime} from '../date-time.class';
import {DateTimePart, LCDatePickerAdapter} from '../lc-date-picker-adapter.class';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { IDisabledTimeRanges } from '../lc-date-picker-config-helper';

@Injectable()
export class TimePicker {

    private readonly HOURS_IN_DAY = 24;
    private readonly HOURS_IN_DAY_AMPM = 12;
    private readonly MINUTES_IN_HOUR = 60;

    private readonly calendarChanges: Subject<void> = new Subject();

    private selectedDateTime: DateTime;
    private use24HourFormat: boolean;
    private readonly disabledTimeRanges: IDisabledTimeRanges[] = [];
    private locale: string;
    private timezone: string;

    constructor(private readonly dateAdapter: LCDatePickerAdapter) {}

    public getTimezone(): string {
        return this.timezone;
    }

    public setTimezone(timezone: string): void {
        this.timezone = timezone;
    }

    public setSelectedTime(dateTime: DateTime): void {
        this.selectedDateTime = dateTime.clone();
        this.updateTime(false);
    }

    public setDisabledTimeRanges(disabledTimeRanges: IDisabledTimeRanges[]): void {
        disabledTimeRanges.forEach((val) => this.disabledTimeRanges.push({ ...val }));
    }

    public addHour(): void {
        this.selectedDateTime =
            this.dateAdapter.setParts(
                this.selectedDateTime,
                {hour: (this.selectedDateTime.getHour() + 1) % this.HOURS_IN_DAY}
            );
        this.updateTime(false);
    }

    public subtractHour(): void {
        this.selectedDateTime =
            this.dateAdapter.setParts(
                this.selectedDateTime,
                {hour: (this.selectedDateTime.getHour() - 1 + this.HOURS_IN_DAY) % this.HOURS_IN_DAY}
            );
        this.updateTime(true);
    }

    public addMinute(): void {
        this.selectedDateTime =
            this.dateAdapter.setParts(
                this.selectedDateTime,
                {minute: (this.selectedDateTime.getMinute() + 1) % this.MINUTES_IN_HOUR}
            );
        this.updateTime(false);
    }

    public subtractMinute(): void {
        this.selectedDateTime =
            this.dateAdapter.setParts(
                this.selectedDateTime,
                {minute: (this.selectedDateTime.getMinute() - 1 + this.MINUTES_IN_HOUR) % this.MINUTES_IN_HOUR}
            );
        this.updateTime(true);
    }

    public setTimeFormat(use24HourFormat: boolean): void {
        this.use24HourFormat = use24HourFormat;
        this.updateTime(!this.use24HourFormat);
    }

    public is24HourFormat(): boolean {
        return this.use24HourFormat;
    }

    public getSelectedDateTime(): DateTime {
        return this.dateAdapter.setParts(this.selectedDateTime, {year: 1900, month: 0, date: 1});
    }

    public updateTime(reverse: boolean): void {

        let updatedTime = false;

        this.disabledTimeRanges.forEach(timeRange => {
            const currentTime =
                this.dateAdapter.setParts(
                    this.selectedDateTime,
                    {year: 1900, month: 0, date: 1, second: 0, millisecond: 0}
                );

            const minimumTime =
                this.dateAdapter.setParts(currentTime, {
                    hour: timeRange.startTime.hour,
                    minute: timeRange.startTime.minute
                });

            const maximumTime =
                this.dateAdapter.setParts(currentTime, {
                    hour: timeRange.stopTime.hour,
                    minute: timeRange.stopTime.minute
                });


            if (this.dateAdapter.isBetween(currentTime, minimumTime, maximumTime)) {

                if (reverse) {
                    this.selectedDateTime = this.dateAdapter.subtract(minimumTime, 1, 'minute');
                }
                else{
                    this.selectedDateTime = this.dateAdapter.add(maximumTime, 1, 'minute');
                }
                updatedTime = true;
            }
        })

        if (updatedTime) {
            this.updateTime(reverse);
        }
        else {
            this.calendarChanges.next();
        }
    }

    public getFormattedHour(): string {
        return this.dateAdapter.formatDateTimePart(
            this.selectedDateTime,
            this.use24HourFormat ? DateTimePart.HOUR : DateTimePart.HOUR_AMPM,
            this.locale);
    }

    public getFormattedMinute(): string {
        return this.dateAdapter.formatDateTimePart(this.selectedDateTime, DateTimePart.MINUTE, this.locale);
    }

    public getFormattedAMPM(): string {
        return this.dateAdapter.formatDateTimePart(this.selectedDateTime, DateTimePart.AMPM, this.locale);
    }

    public setLocale(locale: string): void {
        this.locale = locale;
    }

    public getLocale(): string {
        return this.locale;
    }

    public getCalendarChanges(): Observable<void> {
        return this.calendarChanges;
    }

    public toggleMeridiem(): void {
        this.selectedDateTime =
            this.dateAdapter.setParts(
                this.selectedDateTime,
                {hour: (this.selectedDateTime.getHour() + this.HOURS_IN_DAY_AMPM) % this.HOURS_IN_DAY}
            );
        this.updateTime(false);
    }
}
