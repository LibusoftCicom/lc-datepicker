import {Injectable} from '@angular/core';
import {DateTimePart, LCDatePickerAdapter, DateTime, ITimeUnit} from '@libusoftcicom/lc-datepicker';
import {DateTime as LuxonDateTime, Info} from 'luxon';


@Injectable()
export class LuxonDateAdapterService extends LCDatePickerAdapter {

  public now(timezone?: string): DateTime {
    return this.setParts(this.fromLuxonDateTime(LuxonDateTime.local()), {second: 0, millisecond: 0});
  }

  public today(timezone?: string): DateTime {
    const date = LuxonDateTime.local();
    return new DateTime(
      date.year,
      date.month - 1,
      date.day,
      0,
      0,
      0,
      0,
      date.zoneName
    );
  }

  public setParts(
    dateTime: DateTime,
    update: {
      year?: number,
      month?: number,
      date?: number,
      hour?: number,
      minute?: number,
      second?: number,
      millisecond?: number,
      timezone?: string,
    } = {}): DateTime {

    const updateCopy: any = {...update};

    if ('date' in update) {
      updateCopy.day = update.date;
      delete updateCopy.date;
    }
    if ('month' in update) {
      updateCopy.month += 1;
    }

    let timezone: string = null;

    if (updateCopy.timezone) {
      timezone = updateCopy.timezone;
      delete updateCopy.timezone;
    }

    let updatedDateTime = this.toLuxonDateTime(dateTime).set(updateCopy);

    if (timezone !== null) {
      updatedDateTime = updatedDateTime.setZone(timezone);
    }

    return this.fromLuxonDateTime(updatedDateTime);
  }

  public getWeekday(date: DateTime): number {
    return this.toLuxonDateTime(date).weekday - 1 % this.DAYS_IN_WEEK;
  }

  public getFirstDayOfWeek(locale: string): number {
    return Info.getStartOfWeek({locale}) - 1 % this.DAYS_IN_WEEK;
  }

  public getStartOfYear(date: DateTime): DateTime {
    return this.fromLuxonDateTime(this.toLuxonDateTime(date).startOf('year'));
  }

  public getEndOfYear(date: DateTime): DateTime {
    return this.fromLuxonDateTime(this.toLuxonDateTime(date).endOf('year'));
  }

  public getStartOfMonth(date: DateTime): DateTime {
    return this.fromLuxonDateTime(this.toLuxonDateTime(date).startOf('month'));
  }

  public getEndOfMonth(date: DateTime): DateTime {
    return this.fromLuxonDateTime(this.toLuxonDateTime(date).endOf('month'));
  }

  public add(dateTime: DateTime, amount: number, unit: ITimeUnit): DateTime {
    return this.fromLuxonDateTime(this.toLuxonDateTime(dateTime).plus({[unit]: amount}));
  }
  public subtract(dateTime: DateTime, amount: number, unit: ITimeUnit): DateTime {
    return this.add(dateTime, -amount, unit);
  }

  public isBefore(dateTime: DateTime, otherDateTime: DateTime): boolean {

    const date1 = this.toLuxonDateTime(dateTime);
    const date2 = this.toLuxonDateTime(otherDateTime);

    return date1 < date2;
  }
  public isAfter(dateTime: DateTime, otherDateTime: DateTime): boolean {

    const date1 = this.toLuxonDateTime(dateTime);
    const date2 = this.toLuxonDateTime(otherDateTime);

    return date1 > date2;
  }

  public isSame(dateTime: DateTime, otherDateTime: DateTime): boolean {

    const luxonFirstDate = this.toLuxonDateTime(dateTime);
    const luxonSecondDate = this.toLuxonDateTime(otherDateTime);

    return luxonFirstDate.toMillis() === luxonSecondDate.toMillis();
  }

  public isBetween(dateTime: DateTime, minimumDateTime: DateTime, maximumDateTime: DateTime): boolean {
    return this.toLuxonDateTime(dateTime) >= this.toLuxonDateTime(minimumDateTime)
      &&  this.toLuxonDateTime(dateTime) <= this.toLuxonDateTime(maximumDateTime);
  }

  public toISOString(date: DateTime, keepOffset?: boolean): string {
    return keepOffset ? this.toLuxonDateTime(date).toISO() : this.toLuxonDateTime(date).toUTC().toISO();
  }

  public getLocalizedWeekdaysShort(locale: string): string[] {
    const weekdays: string[] = Info.weekdays('short', {locale});
    const firstDayOfWeek = this.getFirstDayOfWeek(locale);

    for (let i = 0; i < this.DAYS_IN_WEEK - firstDayOfWeek % this.DAYS_IN_WEEK; i++) {
      weekdays.unshift(weekdays.pop());
    }

    return weekdays;
  }

  public formatDateTimePart(dateTime: DateTime, dateTimePart: DateTimePart, locale?: string): string {

    switch (dateTimePart) {
      case DateTimePart.YEAR:
        return this.formatDateTime(dateTime, 'yyyy', locale);
      case DateTimePart.MONTH:
        return this.formatDateTime(dateTime, 'LLLL', locale);
      case DateTimePart.DATE:
        return this.formatDateTime(dateTime, 'dd', locale);
      case DateTimePart.HOUR:
        return this.formatDateTime(dateTime, 'HH', locale);
      case DateTimePart.HOUR_AMPM:
        return this.formatDateTime(dateTime, 'hh', locale);
      case DateTimePart.MINUTE:
        return this.formatDateTime(dateTime, 'mm', locale);
      case DateTimePart.AMPM:
        return this.formatDateTime(dateTime, 'a', locale);
    }
  }

  public parseString(dateTime: string, format: string, locale?: string): DateTime {
    return this.fromLuxonDateTime(LuxonDateTime.fromFormat(dateTime, format, locale));
  }

  public getLocalizedMonthsShort(locale: string): string[] {
    return Info.months('short', {locale});
  }

  public formatDateTime(dateTime: DateTime, format: string, locale?: string): string {

    let luxonDateTime = this.toLuxonDateTime(dateTime);

    if (locale) {
      luxonDateTime = luxonDateTime.setLocale(locale);
    }

    return luxonDateTime.toFormat(format);
  }

  public fromISOString(dateTime: string, timezone?: string): DateTime {
    return this.fromLuxonDateTime(LuxonDateTime.fromISO(dateTime));
  }

  private fromLuxonDateTime(date: LuxonDateTime): DateTime {
    return new DateTime(
      date.year,
      date.month - 1,
      date.day,
      date.hour,
      date.minute,
      date.second,
      date.millisecond,
      date.zoneName
    )
  }

  private toLuxonDateTime(date: DateTime): LuxonDateTime {
    return LuxonDateTime.fromObject(
      {
        year: date.getYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHour(),
        minute: date.getMinute(),
        second: date.getSecond(),
        millisecond: date.getMillisecond(),
      },
      {
        zone: date.getTimeZone()
      }
    );
  }
}
