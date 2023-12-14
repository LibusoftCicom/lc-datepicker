import {DateTime} from './date-time.class';
import { ITimeUnit } from './base-date-picker.class';

/**
 * Represents different parts of a date and time.
 *
 * @enum {number}
 */
export enum DateTimePart {
    YEAR,
    MONTH,
    DATE,
    HOUR,
    HOUR_AMPM,
    MINUTE,
    AMPM
}

/**
 * The abstract class LCDatePickerAdapter provides a set of methods
 * for manipulating and formatting date and time values.
 * This class serves as a base class for different Datepicker adapters.
 *
 * @abstract
 */
export abstract class LCDatePickerAdapter {

    /**
     * Represents the number of days in a week.
     *
     * @constant {number}
     * @default 7
     */
    public readonly DAYS_IN_WEEK = 7;

    /**
     * Returns the current DateTime in the specified timezone.
     *
     * @param {string} timezone - The timezone to use for the DateTime.
     * If not specified, it will be implementation specific.
     *
     * @return {DateTime} - The current DateTime object.
     */
    public abstract now(timezone?: string): DateTime;

    /**
     * Calculates the current date without the time component in the specified timezone.
     *
     * @param {string} timezone - The timezone to calculate the current date in.
     * If not specified, it will be implementation specific.
     *
     * @returns {DateTime} - The current date in the specified timezone.
     */
    public abstract today(timezone?: string): DateTime;

    /**
     * Sets the specified parts of the date and time represented by this DateTime object.
     *
     * @param {DateTime} dateTime - The DateTime object to set the parts on.
     * @param {Object} update - An object containing the parts to update. Each part is optional and can include:
     *                          - year: The year value.
     *                          - month: The month value (0-11).
     *                          - date: The day of the month value (1-31).
     *                          - hour: The hour value (0-23).
     *                          - minute: The minute value (0-59).
     *                          - second: The second value (0-59).
     *                          - millisecond: The millisecond value (0-999).
     *                          - timezone: The timezone value (e.g. 'GMT', 'UTC', 'America/New_York').
     *
     * @return {DateTime} A new DateTime object with the specified parts updated.
     * The original DateTime object is not modified.
     */
    public abstract setParts(
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
        }): DateTime;

    /**
     * Adds the specified amount of the specified time unit to the given date and time.
     *
     * @param {DateTime} dateTime - The date and time to add the duration to.
     * @param {number} amount - The amount to add.
     * @param {ITimeUnit} unit - The time unit to add.
     * @return {DateTime} The updated date and time after adding the duration.
     */
    public abstract add(dateTime: DateTime, amount: number, unit: ITimeUnit): DateTime;

    /**
     * Subtracts the specified amount of time units from the given date and time.
     *
     * @param {DateTime} dateTime - The date and time from which to subtract the duration.
     * @param {number} amount - The amount to subtract.
     * @param {ITimeUnit} unit - The time unit to subtract.
     *
     * @return {DateTime} - The updated date and time after subtracting the duration.
     */
    public abstract subtract(dateTime: DateTime, amount: number, unit: ITimeUnit): DateTime;

    /**
     * Returns the weekday of the given date, where 0 represents Monday, 1 represents Tuesday, etc.
     *
     * @param {DateTime} date - The date for which to find the weekday.
     * @return {number} - The weekday number.
     */
    public abstract getWeekday(date: DateTime): number;

    /**
     * Returns the first day of the week for the given locale, where 0 represents Monday, 1 represents Tuesday, etc.
     *
     * @param {string} locale - The locale for which to retrieve the first day of the week.
     *
     * @return {number} - The first day of the week for the given locale.
     */
    public abstract getFirstDayOfWeek(locale: string): number;

    /**
     * Returns the start of the year for a given date.
     *
     * @param {DateTime} date - The date for which to determine the start of the year.
     * @return {DateTime} The start of the year for the given date.
     */
    public abstract getStartOfYear(date: DateTime): DateTime;

    /**
     * Returns the end of the year for the given date.
     *
     * @param {DateTime} date The date for which to determine the end of the year.
     *
     * @return {DateTime} The end of the year for the given date.
     */
    public abstract getEndOfYear(date: DateTime): DateTime;

    /**
     * Retrieves the start of the month for the given date.
     *
     * @param {DateTime} date - The date for which to retrieve the start of the month.
     * @return {DateTime} - The start of the month for the given date.
     */
    public abstract getStartOfMonth(date: DateTime): DateTime;

    /**
     * Returns the end of the month for the given date.
     *
     * @param {DateTime} date - The date for which to retrieve the end of the month.
     * @return {DateTime} - The end of the month for the given date.
     */
    public abstract getEndOfMonth(date: DateTime): DateTime;

    /**
     * Determines if the given date is chronologically before another date.
     *
     * @param {DateTime} dateTime - The date to check.
     * @param {DateTime} otherDateTime - The date to compare against.
     * @return {boolean} - True if date is before the other date, false otherwise.
     */
    public abstract isBefore(dateTime: DateTime, otherDateTime: DateTime): boolean;

    /**
     * Determines whether the given date is chronologically after another date.
     *
     * @param {DateTime} dateTime - The date to check.
     * @param {DateTime} otherDateTime - The date to compare against.
     *
     * @return {boolean} - True if the date is after the other date, false otherwise.
     */
    public abstract isAfter(dateTime: DateTime, otherDateTime: DateTime): boolean;

    /**
     * Checks if the given date is chronologically the same as another date.
     *
     * @param {DateTime} dateTime - The date to check.
     * @param {DateTime} otherDateTime - The date to compare against.
     * @return {boolean} - True if the date objects are chronologically the same, false otherwise.
     */
    public abstract isSame(dateTime: DateTime, otherDateTime: DateTime): boolean;

    /**
     * Determines whether a given date falls between a minimum and maximum date (inclusive).
     *
     * @param {DateTime} dateTime - The date to check.
     * @param {DateTime} minimumDateTime - The minimum date.
     * @param {DateTime} maximumDateTime - The maximum date.
     *
     * @returns {boolean} - True if the date is between the minimum and maximum dates;
     * otherwise, false.
     */
    public abstract isBetween(dateTime: DateTime, minimumDateTime: DateTime, maximumDateTime: DateTime): boolean;

    /**
     * Converts a DateTime object to its equivalent string representation in ISO 8601 format.
     *
     * @param {DateTime} date - The DateTime object to convert.
     * @param {boolean} [keepOffset=false] - If true, the original offset of the DateTime object will be displayed,
     *  otherwise it will be converted to UTC.
     * @returns {string} The string representation of the date in ISO 8601 format.
     */
    public abstract toISOString(date: DateTime, keepOffset?: boolean): string;

    /**
     * Retrieves an array of abbreviated localized weekdays.
     *
     * @param {string} locale - The locale for which the weekdays should be retrieved.
     *
     * @return {string[]} - An array of abbreviated localized weekdays.
     */
    public abstract getLocalizedWeekdaysShort(locale: string): string[];

    /**
     * Retrieves an array of abbreviated localized month names.
     *
     * @param {string} locale - The locale for which the months should be retrieved.
     *
     * @return {string[]} An array of abbreviated localized month names.
     */
    public abstract getLocalizedMonthsShort(locale: string): string[];

    /**
     * Formats a specific part of a date according to the given locale.
     *
     * @param {DateTime} dateTime - The date to be formatted.
     * @param {DateTimePart} dateTimePart - The specific part of the date to format.
     * @param {string} [locale] - The locale to use for formatting. Optional, default is implementation specific.
     * @returns {string} - The formatted string representation of the specified date part.
     */
    public abstract formatDateTimePart(dateTime: DateTime, dateTimePart: DateTimePart, locale?: string): string;

    /**
     * Parses the given date string using the provided format and locale,
     * and returns a DateTime object.
     *
     * @param {string} dateTime The string representation of the date and time.
     * @param {string} format The format of the dateTime string. Must be compatible
     * with the formatting patterns supported by the underlying implementation.
     * @param {string} [locale] The locale to use for parsing the date string.
     * Optional, default is implementation specific.
     *
     * @return {DateTime} A DateTime object representing the parsed date and time.
     */
    public abstract parseString(dateTime: string, format: string, locale?: string): DateTime;

    /**
     * Formats a DateTime object into a string representation according to the specified format and locale.
     *
     * @param {DateTime} dateTime - The date to be formatted.
     * @param {string} format - The format string pattern used for the formatting. Must be compatible
     * with the formatting patterns supported by the underlying implementation.
     * @param {string} [locale] - The locale to be used for the formatting.
     * Optional, default is implementation specific.
     *
     * @return {string} The formatted string representation of the date.
     */
    public abstract formatDateTime(dateTime: DateTime, format: string, locale?: string): string;
}
