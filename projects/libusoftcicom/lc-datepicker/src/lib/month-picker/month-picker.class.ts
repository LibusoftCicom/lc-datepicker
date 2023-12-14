import {DateTime} from '../date-time.class';
import {DateTimePart, LCDatePickerAdapter} from '../lc-date-picker-adapter.class';
import {Injectable} from '@angular/core';
import {BaseDatePicker, ICalendarItem} from '../base-date-picker.class';

@Injectable()
export class MonthPicker extends BaseDatePicker {

	public ROW_LENGTH = 3;

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
		this.selectedDateTime = this.dateAdapter.setParts(this.selectedDateTime, {month: item.value});
	}

	public formatCalendarData(): ICalendarItem[][] {
		const monthArray: ICalendarItem[][] = [];

		const months = this.dateAdapter.getLocalizedMonthsShort(this.locale);

		let row: ICalendarItem[] = [];

		for (let i = 0; i < months.length; i++) {
			const item = this.createCalendarItem(months, i);

			row.push(item);

			if (row.length === this.ROW_LENGTH) {
				monthArray.push(row);
				row = [];
			}
		}

		return monthArray;
	}

	public getSelectedDateTime(): DateTime {
		return this.selectedDateTime.clone();
	}

	public getFormattedYear(): string {
		return this.dateAdapter.formatDateTimePart(this.selectedDateTime, DateTimePart.YEAR, this.locale);
	}

	public previousYear(): void {

		this.selectedDateTime = this.dateAdapter.subtract(this.selectedDateTime, 1, 'years');
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public nextYear(): void {

		this.selectedDateTime = this.dateAdapter.add(this.selectedDateTime, 1, 'years');
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}
	public setCalendarBoundaries(minDateTime: DateTime, maxDateTime: DateTime): void {

		if (this.dateAdapter.isSame(
			this.dateAdapter.getStartOfMonth(minDateTime),
			this.dateAdapter.getStartOfMonth(maxDateTime)
		)) {
			this.minDate = this.dateAdapter.getStartOfMonth(this.DEFAULT_MIN_DATE);
			this.maxDate = this.dateAdapter.getStartOfMonth(this.DEFAULT_MAX_DATE);
			throw new Error('Invalid min/max date. Max date should be at least 1 day after min date');
		}

		this.minDate = this.dateAdapter.getStartOfMonth(minDateTime);
		this.maxDate = this.dateAdapter.getStartOfMonth(maxDateTime);
	}

	public setSelectedDate(date: DateTime): void {

		if (this.minDate && this.maxDate && this.dateAdapter.isSame(this.minDate, this.maxDate)) {
			return;
		}

		if (date === undefined) {
			date = this.dateAdapter.getStartOfMonth(this.dateAdapter.today(this.timezone));
		}

		if (this.minDate && this.dateAdapter.isBefore(date, this.minDate)) {
			this.selectedDateTime = this.dateAdapter.getStartOfMonth(this.minDate);
		}
		else if (this.maxDate && this.dateAdapter.isAfter(date, this.maxDate)) {
			this.selectedDateTime = this.dateAdapter.getStartOfMonth(this.maxDate);
		}
		else {
			this.selectedDateTime = this.dateAdapter.getStartOfMonth(date);
		}

		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public previousMonth(): void {
		this.addMonths(-1);
	}

	public nextMonth(): void {
		this.addMonths(1);
	}

	public previousRow(): void {
		this.addMonths(-this.ROW_LENGTH);
	}

	public nextRow(): void {
		this.addMonths(this.ROW_LENGTH);
	}

	private addMonths(amount: number): void {
		this.selectedDateTime = this.dateAdapter.add(this.selectedDateTime, amount, 'months')
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	private subtractMonths(amount: number): void {
		this.addMonths(-amount);
	}

	private createCalendarItem(months: string[], i: number): ICalendarItem {
		const item: ICalendarItem = { value: i, text: months[i] };

		const startOfMonth = this.dateAdapter.setParts(this.selectedDateTime, {month: i, date: 1});

		if (this.isMonthDisabled(startOfMonth)) {
			item.disabled = true;
		}

		if (
			this.dateAdapter.isSame(
				startOfMonth,
				this.dateAdapter.getStartOfMonth(this.dateAdapter.today(this.timezone))
			)
		) {
			item.current = true;
		}

		if (this.dateAdapter.isSame(startOfMonth, this.selectedDateTime)) {
			item.active = true;
		}
		return item;
	}

	private isMonthDisabled(date: DateTime): boolean {
		if (this.minDate && this.dateAdapter.isBefore(date, this.dateAdapter.getStartOfMonth(this.minDate))) {
			return true;
		}

		return this.maxDate && this.dateAdapter.isAfter(date, this.dateAdapter.getEndOfMonth(this.maxDate));
	}
}
