import {DateTime} from '../date-time.class';
import {DateTimePart, LCDatePickerAdapter} from '../lc-date-picker-adapter.class';
import {Injectable} from '@angular/core';
import {BaseDatePicker, ICalendarItem} from '../base-date-picker.class';

@Injectable()
export class DayPicker extends BaseDatePicker {

    public readonly DAYS_IN_WEEK = 7;

    private readonly disabledDates: Set<string> = new Set<string>();
    private daysOfWeek: string[];

    constructor(private readonly dateAdapter: LCDatePickerAdapter) {
        super();
    }

    public setSelectedDate(date: DateTime): void {
        if (this.minDate && this.maxDate && this.dateAdapter.isSame(this.minDate, this.maxDate)) {
            return;
        }

        if (date === undefined) {
            date = this.dateAdapter.today(this.timezone);
        }

        this.initializeDate(date);
        this.calendarData = this.formatCalendarData();
        this.calendarChanges.next();
    }

    public getCalendarData(): ICalendarItem[][] {
        return this.calendarData;
    }

    public setCalendarData(calendarData: ICalendarItem[][]): void {
        this.calendarData = calendarData;
        this.calendarChanges.next();
    }

    public getCalendarItem(row: number, column: number): ICalendarItem {
        return this.calendarData[row][column];
    }

    public getShortDaysOfWeek(): string[] {
        return this.daysOfWeek;
    }

    public initializeDaysOfWeek(): void {
        this.daysOfWeek = this.dateAdapter.getLocalizedWeekdaysShort(this.locale);
    }

    public selectItem(item: ICalendarItem): void {
        this.selectedDateTime = this.dateAdapter.setParts(this.selectedDateTime, {date: item.value});
    }

    public formatCalendarData(): ICalendarItem[][] {

        const monthStartDate = this.dateAdapter.setParts(this.selectedDateTime, {date: 1});

        const monthArray: ICalendarItem[][] = [];

        const difference =
            this.dateAdapter.getWeekday(monthStartDate) - this.dateAdapter.getFirstDayOfWeek(this.locale);
        const offset = difference > 0 ? difference : difference + this.DAYS_IN_WEEK;

        let week: ICalendarItem[] =
            new Array(
                offset)
                .fill(null);

        if (week.length === this.DAYS_IN_WEEK) {
            monthArray.push(week);
            week = [];
        }

        for (let i = 1; i <= this.dateAdapter.getEndOfMonth(this.selectedDateTime).getDate(); i++) {

            week.push(this.createCalendarItem(monthStartDate, i));
            if (week.length === this.DAYS_IN_WEEK) {
                monthArray.push(week);
                week = [];
            }
        }

        if (week.length !== 0) {
            while (week.length < this.DAYS_IN_WEEK) {
                week.push(null);
            }

            monthArray.push(week);
        }

        return monthArray;
    }

    public nextMonth(): void {

        this.selectedDateTime = this.dateAdapter.add(this.selectedDateTime,1, 'month');
        this.calendarData = this.formatCalendarData();
        this.calendarChanges.next();
    }
    public previousMonth(): void {

        this.selectedDateTime = this.dateAdapter.subtract(this.selectedDateTime,1, 'month');
        this.calendarData = this.formatCalendarData();
        this.calendarChanges.next();
    }

    public getSelectedDateTime(): DateTime {
        return this.selectedDateTime.clone();
    }

    public setCalendarBoundaries(minDateTime: DateTime, maxDateTime: DateTime): void {
        if (this.dateAdapter.isSame(minDateTime, maxDateTime)) {
            this.minDate = this.DEFAULT_MIN_DATE.clone();
            this.maxDate = this.DEFAULT_MAX_DATE.clone();
            throw new Error('Invalid min/max date. Max date should be at least 1 day after min date');
        }

        this.minDate = minDateTime.clone();
        this.maxDate = maxDateTime.clone();
    }

    public getFormattedMonth(): string {
        return this.dateAdapter.formatDateTimePart(this.selectedDateTime, DateTimePart.MONTH, this.locale);
    }

    public getFormattedYear(): string {
        return this.dateAdapter.formatDateTimePart(this.selectedDateTime, DateTimePart.YEAR, this.locale);
    }

    public previousDate(): void {
        this.addDays(-1);
    }

    public nextDate(): void {
        this.addDays(1);
    }

    public previousWeek(): void {
        this.addDays(-this.DAYS_IN_WEEK);
    }

    public nextWeek(): void {
        this.addDays(this.DAYS_IN_WEEK);
    }

    public setDisabledDates(dates: DateTime[]): void {
        this.disabledDates.clear();
        dates.forEach(date => this.disabledDates.add(this.dateAdapter.toISOString(date)));
    }

    private addDays(amount: number): void {
        this.selectedDateTime = this.dateAdapter.add(this.selectedDateTime, amount, 'days');
        this.calendarData = this.formatCalendarData();
        this.calendarChanges.next();
    }

    private subtractDays(amount: number): void {
        this.addDays(-amount);
    }

    private initializeDate(date: DateTime) {

        date = this.dateAdapter.setParts(date, {hour: 0, minute: 0, second: 0, millisecond: 0});

        while (this.disabledDates.has(this.dateAdapter.toISOString(date))) {
            date = this.dateAdapter.add(date, 1, 'day');
        }

        if (this.minDate && this.dateAdapter.isBefore(date, this.minDate)) {
            this.selectedDateTime = this.minDate.clone();
        } else if (this.maxDate && this.dateAdapter.isAfter(date, this.maxDate)) {
            this.selectedDateTime = this.maxDate.clone();
        } else {
            this.selectedDateTime = date.clone();
        }
    }

    private isDateDisabled(date: DateTime): boolean {

        if (this.minDate && this.dateAdapter.isBefore(date, this.minDate)) {
            return true;
        }

        if (this.maxDate && this.dateAdapter.isAfter(date, this.maxDate)) {
            return true;
        }

        return this.disabledDates.has(this.dateAdapter.toISOString(date));
    }

    private createCalendarItem(monthStartDate: DateTime, date: number): ICalendarItem {
        const item: ICalendarItem = {value: date};

        const dateTime = this.dateAdapter.add(monthStartDate, date - 1, 'days');

        if (this.isDateDisabled(dateTime)) {
            item.disabled = true;
        }

        if (this.dateAdapter.isSame(dateTime, this.dateAdapter.today(this.timezone))) {
            item.current = true;
        }

        if (this.dateAdapter.isSame(dateTime, this.selectedDateTime)) {
            item.active = true;
        }

        return item;
    }
}
