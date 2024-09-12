import {Injectable} from '@angular/core';
import {DateTimePart, LCDatePickerAdapter, DateTime, ITimeUnit} from '@libusoftcicom/lc-datepicker';
import moment from 'moment';
import 'moment/locale/hr';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/ja';
import 'moment/locale/pt';
import 'moment/locale/ru';
import 'moment-timezone';


@Injectable()
export class MomentDateAdapterService extends LCDatePickerAdapter {
  public now(timezone?: string): DateTime {
    const date = timezone ? moment().tz(timezone) : moment()
    return this.setParts(
      this.fromMomentDateTime(date),
      { second: 0, millisecond: 0 }
    );
  }

  public today(timezone?: string): DateTime {
    const date = timezone ? moment().tz(timezone) : moment();
    return this.setParts(
      this.fromMomentDateTime(date),
      { hour: 0, minute: 0, second: 0, millisecond: 0 }
    );
  }

  public setParts(
    dateTime: DateTime,
    update: {
      year?: number;
      month?: number;
      date?: number;
      hour?: number;
      minute?: number;
      second?: number;
      millisecond?: number;
      timezone?: string;
    } = {}
  ): DateTime {
    let updatedDateTime = this.toMomentDateTime(dateTime).set(update);

    if (update.timezone) {
      updatedDateTime = this.setMomentTimezone(updatedDateTime, update.timezone);
    }

    return this.fromMomentDateTime(updatedDateTime);
  }

  public getWeekday(date: DateTime): number {
    return (this.toMomentDateTime(date).day() + this.DAYS_IN_WEEK - 1) % this.DAYS_IN_WEEK;
  }

  public getFirstDayOfWeek(locale: string): number {
    const firstDayOfWeek = moment.localeData(locale).firstDayOfWeek();
    return (firstDayOfWeek + this.DAYS_IN_WEEK - 1) % this.DAYS_IN_WEEK;
  }

  public getStartOfYear(date: DateTime): DateTime {
    return this.fromMomentDateTime(this.toMomentDateTime(date).startOf('year'));
  }

  public getEndOfYear(date: DateTime): DateTime {
    return this.fromMomentDateTime(this.toMomentDateTime(date).endOf('year'));
  }

  public getStartOfMonth(date: DateTime): DateTime {
    return this.fromMomentDateTime(this.toMomentDateTime(date).startOf('month'));
  }

  public getEndOfMonth(date: DateTime): DateTime {
    return this.fromMomentDateTime(this.toMomentDateTime(date).endOf('month'));
  }

  public add(dateTime: DateTime, amount: number, unit: ITimeUnit): DateTime {
    return this.fromMomentDateTime(this.toMomentDateTime(dateTime).add(amount, unit));
  }
  public subtract(dateTime: DateTime, amount: number, unit: ITimeUnit): DateTime {
    return this.add(dateTime, -amount, unit);
  }

  public isBefore(dateTime: DateTime, otherDateTime: DateTime): boolean {
    const date1 = this.toMomentDateTime(dateTime);
    const date2 = this.toMomentDateTime(otherDateTime);

    return date1.isBefore(date2);
  }
  public isAfter(dateTime: DateTime, otherDateTime: DateTime): boolean {
    const date1 = this.toMomentDateTime(dateTime);
    const date2 = this.toMomentDateTime(otherDateTime);

    return date1.isAfter(date2);
  }

  public isSame(dateTime: DateTime, otherDateTime: DateTime): boolean {
    const date1 = this.toMomentDateTime(dateTime);
    const date2 = this.toMomentDateTime(otherDateTime);

    return date1.isSame(date2);
  }

  public isBetween(dateTime: DateTime, minimumDateTime: DateTime, maximumDateTime: DateTime): boolean {
    const momentDateTime = this.toMomentDateTime(dateTime);
    const momentMinimumDateTime = this.toMomentDateTime(minimumDateTime);
    const momentMaximumDateTime = this.toMomentDateTime(maximumDateTime);

    return !momentDateTime.isBefore(momentMinimumDateTime) && !momentDateTime.isAfter(momentMaximumDateTime);
  }

  public toISOString(date: DateTime, keepOffset?: boolean): string {
    return keepOffset ? this.toMomentDateTime(date).toISOString() : this.toMomentDateTime(date).utc().toISOString();
  }

  public getLocalizedWeekdaysShort(locale: string): string[] {

    const weekdays: string[] = [...moment.localeData(locale).weekdaysShort()];
    const firstDayOfWeek = this.getFirstDayOfWeek(locale);

    for (let i = 0; i < (this.DAYS_IN_WEEK - firstDayOfWeek - 1) % this.DAYS_IN_WEEK; i++) {
      weekdays.unshift(weekdays.pop());
    }

    return weekdays;
  }

  public formatDateTimePart(dateTime: DateTime, dateTimePart: DateTimePart, locale?: string): string {
    switch (dateTimePart) {
      case DateTimePart.YEAR:
        return this.formatDateTime(dateTime, 'YYYY', locale);
      case DateTimePart.MONTH:
        return this.formatDateTime(dateTime, 'MMMM', locale);
      case DateTimePart.DATE:
        return this.formatDateTime(dateTime, 'D', locale);
      case DateTimePart.HOUR:
        return this.formatDateTime(dateTime, 'HH', locale);
      case DateTimePart.HOUR_AMPM:
        return this.formatDateTime(dateTime, 'hh', locale);
      case DateTimePart.MINUTE:
        return this.formatDateTime(dateTime, 'mm', locale);
      case DateTimePart.AMPM:
        return this.formatDateTime(dateTime, 'A', locale);
    }
  }

  public parseString(dateTime: string, format: string, locale?: string): DateTime {
    return this.fromMomentDateTime(moment(dateTime, format, locale));
  }

  public getLocalizedMonthsShort(locale: string): string[] {
    return moment.localeData(locale).monthsShort();
  }

  public formatDateTime(dateTime: DateTime, format: string, locale?: string): string {
    let momentDateTime = this.toMomentDateTime(dateTime);

    if (locale) {
      momentDateTime = momentDateTime.locale(locale);
    }

    return momentDateTime.format(format);
  }

  public fromISOString(dateTime: string, timezone?: string): DateTime {
    return this.fromMomentDateTime(moment(dateTime).tz(timezone));
  }

  private fromMomentDateTime(date: moment.Moment): DateTime {
    return new DateTime(
      date.year(),
      date.month(),
      date.date(),
      date.hour(),
      date.minute(),
      date.second(),
      date.millisecond(),
      date.tz()
    );
  }

  private toMomentDateTime(date: DateTime): moment.Moment {
    return moment
      .utc([
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHour(),
        date.getMinute(),
        date.getSecond(),
        date.getMillisecond(),
      ])
      .tz(date.getTimeZone(), true);
  }

  private setMomentTimezone(
    updatedDateTime: moment.Moment,
    timezone: string
  ): moment.Moment {
    const originalOffset = updatedDateTime.utcOffset();
    const newOffset = updatedDateTime.clone().tz(timezone).utcOffset();

    updatedDateTime = updatedDateTime.add(newOffset - originalOffset, 'minutes');
    updatedDateTime.tz(timezone);

    return updatedDateTime.clone();
  }
}
