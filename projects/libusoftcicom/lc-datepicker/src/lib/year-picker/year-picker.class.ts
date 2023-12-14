import {DateTime} from '../date-time.class';
import {LCDatePickerAdapter} from '../lc-date-picker-adapter.class';
import {Injectable} from '@angular/core';
import {BaseDatePicker, ICalendarItem} from '../base-date-picker.class';

@Injectable()
export class YearPicker extends BaseDatePicker {

	public readonly YEARS_PER_CALENDAR = 25;
	public readonly YEARS_PER_ROW = 5;

	constructor(private readonly dateAdapter: LCDatePickerAdapter) {
		super();
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

	public selectItem(item: ICalendarItem): void {
		this.selectedDateTime = this.dateAdapter.setParts(this.selectedDateTime, {year: item.value});
	}

	public formatCalendarData(): ICalendarItem[][] {

		const yearsArray: ICalendarItem[][] = [];

		const minYear =
			this.getSelectedDateTime().getYear() - this.getSelectedDateTime().getYear() % this.YEARS_PER_CALENDAR;
		const maxYear = minYear + this.YEARS_PER_CALENDAR;

		let yearsRow: ICalendarItem[] = [];

		for (let i = minYear; i < maxYear; i++) {
			const item = this.createCalendarItem(i);
			yearsRow.push(item);

			if (yearsRow.length === this.YEARS_PER_ROW) {
				yearsArray.push(yearsRow);
				yearsRow = [];
			}
		}

		return yearsArray;
	}

	public nextYears(): void {

		// If the year of max date is e.g. 2021, this will return 2000 (assuming 25 years per group),
		// i.e. the year in the top left corner of the calendar.
		// This year is then used to prevent the user from going past the screen with the maximum date.
		const minCalendarYear = this.maxDate.getYear() - this.maxDate.getYear() % this.YEARS_PER_CALENDAR;
		if (this.selectedDateTime.getYear() >= minCalendarYear) {
			return;
		}

		this.selectedDateTime = this.dateAdapter.add(this.selectedDateTime,this.YEARS_PER_CALENDAR, 'years');
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public previousYears(): void {

		// If the year of min date is e.g. 1912, this will return 1900 (assuming 25 years per group),
		// i.e. the year in the top left corner of the calendar.
		// This year is then used to prevent the user from going past the screen with the minimum date.
		const minCalendarYear = this.minDate.getYear() - this.minDate.getYear() % this.YEARS_PER_CALENDAR;
		if (this.selectedDateTime.getYear() < minCalendarYear + this.YEARS_PER_CALENDAR) {
			return;
		}

		this.selectedDateTime = this.dateAdapter.subtract(this.selectedDateTime, this.YEARS_PER_CALENDAR, 'years');
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public getSelectedDateTime(): DateTime {
		return this.selectedDateTime.clone();
	}

	public setSelectedDateTime(dateTime: DateTime): void {
		this.selectedDateTime = dateTime.clone();
	}

	public setCalendarBoundaries(minDateTime: DateTime, maxDateTime: DateTime): void {
		if (this.dateAdapter.isSame(
			this.dateAdapter.getStartOfYear(minDateTime),
			this.dateAdapter.getStartOfYear(maxDateTime)
		)) {
			this.minDate = this.dateAdapter.getStartOfYear(this.DEFAULT_MIN_DATE);
			this.maxDate = this.dateAdapter.getStartOfYear(this.DEFAULT_MAX_DATE);
			throw new Error('Invalid min/max date. Max date should be at least 1 day after min date');
		}

		this.minDate = this.dateAdapter.getStartOfYear(minDateTime);
		this.maxDate = this.dateAdapter.getStartOfYear(maxDateTime);
	}

	public previousYear(): void {
		this.addYears(-1);
	}

	public nextYear(): void {
		this.addYears(1);
	}

	public previousRow(): void {
		this.addYears(-this.YEARS_PER_ROW);

	}

	public nextRow(): void {
		this.addYears(this.YEARS_PER_ROW);
	}

	public setSelectedDate(date: DateTime): void {

		if (this.minDate && this.maxDate && this.dateAdapter.isSame(this.minDate, this.maxDate)) {
			return;
		}

		if (date === undefined) {
			date = this.dateAdapter.getStartOfYear(this.dateAdapter.today(this.timezone));
		}

		if (this.minDate && this.dateAdapter.isBefore(date, this.minDate)) {
			this.selectedDateTime = this.dateAdapter.getStartOfYear(this.minDate);
		}
		else if (this.maxDate && this.dateAdapter.isAfter(date, this.maxDate)) {
			this.selectedDateTime = this.dateAdapter.getStartOfYear(this.maxDate);
		}
		else {
			this.selectedDateTime = this.dateAdapter.getStartOfYear(date);
		}

		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public addYears(amount: number): void {

		const newYear = this.dateAdapter.add(this.selectedDateTime, amount, 'years');

		if ((newYear.getYear() < this.minDate.getYear()) || (newYear.getYear() > this.maxDate.getYear())) {
			return;
		}

		this.selectedDateTime =  newYear;
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public subtractYears(amount: number): void {
		this.addYears(-amount);
	}

	private isYearDisabled(date: DateTime): boolean {
		if (this.minDate && this.dateAdapter.isBefore(date, this.dateAdapter.getStartOfYear(this.minDate))) {
			return true;
		}

		return this.maxDate && this.dateAdapter.isAfter(date, this.dateAdapter.getEndOfYear(this.maxDate));
	}

	private createCalendarItem(i: number): ICalendarItem {

		const item: ICalendarItem = { value: i };

		const startOfYear = new DateTime(
			i,
			0,
			1,
			0,
			0,
			0,
			0,
			this.selectedDateTime.getTimeZone()
		);

		if (this.isYearDisabled(startOfYear)) {
			item.disabled = true;
		}

		if (
			this.dateAdapter.isSame(
				startOfYear,
				this.dateAdapter.getStartOfYear(this.dateAdapter.today(this.timezone))
			)
		) {
			item.current = true;
		}

		if (this.dateAdapter.isSame(startOfYear, this.selectedDateTime)) {
			item.active = true;
		}
		return item;
	}
}
