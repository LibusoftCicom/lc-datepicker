/**
 * Represents a specific date and time.
 */
export class DateTime {

    private readonly year: number;
    private readonly month: number;
    private readonly date: number;
    private readonly hour: number;
    private readonly minute: number;
    private readonly second: number;
    private readonly millisecond: number;
    private readonly timezone: string;

    /**
     * Creates a new instance of the DateTime class.
     *
     * @param {number} year - The year of the date.
     * @param {number} month - The month of the date (0-11).
     * @param {number} date - The day of the month.
     * @param {number} hour - The hour of the day (0-23).
     * @param {number} minute - The minutes.
     * @param {number} second - The seconds.
     * @param {number} millisecond - The milliseconds.
     * @param {string} timezone - The name of the timezone of the date (e.g. 'GMT', 'UTC', 'America/New_York').
     *
     * @return {void}
     */
    constructor(
        year: number,
        month: number,
        date: number,
        hour: number,
        minute: number,
        second: number,
        millisecond: number,
        timezone: string,
    ) {
        this.year = year;
        this.month = month;
        this.date = date;
        this.hour = hour ?? 0;
        this.minute = minute ?? 0;
        this.second = second ?? 0;
        this.millisecond = millisecond ?? 0;
        this.timezone = timezone ?? 'UTC';
    }

    /**
     * Retrieves the year of the given date.
     *
     * @returns {number} The year.
     */
    public getYear(): number {
        return this.year;
    }

    /**
     * Retrieves the month of the given date.
     *
     * @returns {number} The month (0-11).
     */
    public getMonth(): number {
        return this.month;
    }

    /**
     * Retrieves the day of the month.
     *
     * @return {number} The day of the month.
     */
    public getDate(): number {
        return this.date;
    }

    /**
     * Retrieves the hour of the day.
     *
     * @return {number} The hour of the day (0-23).
     */
    public getHour(): number {
        return this.hour;
    }

    /**
     * Retrieves the minutes.
     *
     * @return {number} The minutes.
     */
    public getMinute(): number {
        return this.minute;
    }

    /**
     * Retrieves the seconds.
     *
     * @return {number} The seconds.
     */
    public getSecond(): number {
        return this.second;
    }

    /**
     * Retrieves the milliseconds.
     *
     * @return {number} The milliseconds.
     */
    public getMillisecond(): number {
        return this.millisecond;
    }

    /**
     * Retrieves the name of the timezone of the date (e.g. 'GMT', 'UTC', 'America/New_York').
     *
     * @return {number} The timezone.
     */
    public getTimeZone(): string {
        return this.timezone;
    }

    /**
     * Returns a new DateTime object with the same properties as the current instance.
     *
     * @returns {DateTime} A new DateTime object cloned from the current instance.
     */
    public clone(): DateTime {
        return new DateTime(
            this.year,
            this.month,
            this.date,
            this.hour,
            this.minute,
            this.second,
            this.millisecond,
            this.timezone,
        );
    }
}

