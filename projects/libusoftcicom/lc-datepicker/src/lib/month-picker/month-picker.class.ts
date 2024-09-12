import {DateTime} from '../date-time.class';
import {LCDatePickerAdapter} from '../lc-date-picker-adapter.class';
import {Injectable} from '@angular/core';
import {BaseDatePicker, ICalendarItem} from '../base-date-picker.class';

@Injectable()
export class MonthPicker extends BaseDatePicker {

	public ROW_LENGTH = 3;

	constructor(
    private readonly dateAdapter: LCDatePickerAdapter,
  ) {
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

	public formatCalendarData(): ICalendarItem[][] {
		const monthArray: ICalendarItem[][] = [];

		const months = this.dateAdapter.getLocalizedMonthsShort(this.control.getLocalization());

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

	public previousYear(): void {

		this.control.setValue(this.dateAdapter.subtract(this.control.getValue(), 1, 'years'));
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public nextYear(): void {

		this.control.setValue(this.dateAdapter.add(this.control.getValue(), 1, 'years'));
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
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
			date = this.dateAdapter.getStartOfMonth(this.dateAdapter.today(this.control.getTimezone()));
		}

		if (this.control.getMinDate() && this.dateAdapter.isBefore(date, this.control.getMinDate())) {
			this.control.setValue(this.dateAdapter.getStartOfMonth(this.control.getMinDate()));
		}
		else if (this.control.getMaxDate() && this.dateAdapter.isAfter(date, this.control.getMaxDate())) {
			this.control.setValue(this.dateAdapter.getStartOfMonth(this.control.getMaxDate()));
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
		this.control.setValue(this.dateAdapter.add(this.control.getValue(), amount, 'months'));
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	private subtractMonths(amount: number): void {
		this.addMonths(-amount);
	}

	private createCalendarItem(months: string[], i: number): ICalendarItem {
		const item: ICalendarItem = { value: i, text: months[i] };

		const startOfMonth = this.dateAdapter.setParts(this.control.getValue(), {month: i, date: 1});

		if (this.isMonthDisabled(startOfMonth)) {
			item.disabled = true;
		}

		if (
			this.dateAdapter.isSame(
				startOfMonth,
				this.dateAdapter.getStartOfMonth(this.dateAdapter.today(this.control.getTimezone()))
			)
		) {
			item.current = true;
		}

		if (
      startOfMonth.getMonth() === this.control.getValue().getMonth() &&
      startOfMonth.getYear() === this.control.getValue().getYear()
    ) {
			item.active = true;
		}
		return item;
	}

	private isMonthDisabled(date: DateTime): boolean {
		if (
      this.control.getMinDate() &&
      this.dateAdapter.isBefore(date, this.dateAdapter.getStartOfMonth(this.control.getMinDate()))
    ) {
			return true;
		}

		return (
      this.control.getMaxDate() &&
      this.dateAdapter.isAfter(date, this.dateAdapter.getEndOfMonth(this.control.getMaxDate()))
    );
	}
}
