import { DateTime } from '../date-time.class';
import { DateTimePart, LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { Injectable } from '@angular/core';
import { BaseDatePicker, ICalendarItem } from '../base-date-picker.class';
import { ECalendarType } from '../enums';

@Injectable()
export class DayPicker extends BaseDatePicker {

  public readonly DAYS_IN_WEEK = 7;

  private daysOfWeek: string[];

  constructor(
    private readonly dateAdapter: LCDatePickerAdapter,
  ) {
    super();
  }

  public setSelectedDate(date: DateTime): void {
    if (
      this.control.getMinDate() &&
      this.control.getMaxDate() &&
      this.dateAdapter.isSame(this.control.getMinDate(), this.control.getMaxDate())
    ) {
      return;
    }

    if (date === undefined) {
      date = this.dateAdapter.today(this.control.getTimezone());
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
    this.daysOfWeek = this.dateAdapter.getLocalizedWeekdaysShort(this.control.getLocalization());
  }

  public formatCalendarData(): ICalendarItem[][] {

    const monthStartDate = this.dateAdapter.setParts(this.control.getValue(), {date: 1});

    const monthArray: ICalendarItem[][] = [];

    const difference =
      this.dateAdapter.getWeekday(monthStartDate) -
      this.dateAdapter.getFirstDayOfWeek(this.control.getLocalization());
    const offset = difference > 0 ? difference : difference + this.DAYS_IN_WEEK;

    let week: ICalendarItem[] =
      new Array(
        offset)
        .fill(null);

    if (week.length === this.DAYS_IN_WEEK) {
      monthArray.push(week);
      week = [];
    }

    for (let i = 1; i <= this.dateAdapter.getEndOfMonth(this.control.getValue()).getDate(); i++) {

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

    this.control.setValue(this.dateAdapter.add(this.control.getValue(),1, 'month'));
    this.calendarData = this.formatCalendarData();
    this.calendarChanges.next();
  }

  public previousMonth(): void {

    this.control.setValue(this.dateAdapter.subtract(this.control.getValue(),1, 'month'));
    this.calendarData = this.formatCalendarData();
    this.calendarChanges.next();
  }

  public getFormattedMonth(): string {
    return this.dateAdapter.formatDateTimePart(
      this.control.getValue(),
      DateTimePart.MONTH,
      this.control.getLocalization()
    );
  }

  public getFormattedYear(): string {
    return this.dateAdapter.formatDateTimePart(
      this.control.getValue(),
      DateTimePart.YEAR,
      this.control.getLocalization()
    );
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

  public isDateDisabled(date: DateTime): boolean {

    if (this.control.getMinDate() && this.dateAdapter.isBefore(date, this.control.getMinDate())) {
      return true;
    }

    if (this.control.getMaxDate() && this.dateAdapter.isAfter(date, this.control.getMaxDate())) {
      return true;
    }

    return this.control.getDisabledDates()
      .some(disabledDate =>
        this.dateAdapter.isSame(
          this.dateAdapter.setParts(date, {hour: 0, minute: 0, second: 0, millisecond: 0}),
          this.dateAdapter.fromISOString(disabledDate, this.control.getTimezone())
        )
      );
  }

  private addDays(amount: number): void {
    this.control.setValue(this.dateAdapter.add(this.control.getValue(), amount, 'days'));
    this.calendarData = this.formatCalendarData();
    this.calendarChanges.next();
  }

  private subtractDays(amount: number): void {
    this.addDays(-amount);
  }

  private initializeDate(date: DateTime) {

    if (this.control.getCalendarType() === ECalendarType.DateTime) {
      date = this.dateAdapter.setParts(date, {second: 0, millisecond: 0});
    }
    else {
      date = this.dateAdapter.setParts(date, {hour: 0, minute: 0, second: 0, millisecond: 0});
    }


    while (this.control.getDisabledDates().some(disabledDate =>
      this.dateAdapter.isSame(date, this.dateAdapter.fromISOString(disabledDate, this.control.getTimezone())))) {
      date = this.dateAdapter.add(date, 1, 'day');
    }

    if (this.control.getMinDate() && this.dateAdapter.isBefore(date, this.control.getMinDate())) {
      this.control.setValue(this.control.getMinDate().clone());
    } else if (this.control.getMaxDate() && this.dateAdapter.isAfter(date, this.control.getMaxDate())) {
      this.control.setValue(this.control.getMaxDate().clone());
    } else {
      this.control.setValue(date.clone());
    }
  }

  private createCalendarItem(monthStartDate: DateTime, date: number): ICalendarItem {
    const item: ICalendarItem = {value: date};

    const dateTime = this.dateAdapter.add(monthStartDate, date - 1, 'days');

    if (this.isDateDisabled(dateTime)) {
      item.disabled = true;
    }

    if (this.dateAdapter.isSame(dateTime, this.dateAdapter.today(this.control.getTimezone()))) {
      item.current = true;
    }

    if (this.dateAdapter.isSame(dateTime, this.control.getValue())) {
      item.active = true;
    }

    return item;
  }
}
