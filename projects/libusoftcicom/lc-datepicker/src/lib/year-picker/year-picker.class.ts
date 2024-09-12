import {DateTime} from '../date-time.class';
import {LCDatePickerAdapter} from '../lc-date-picker-adapter.class';
import { EventEmitter, Injectable } from '@angular/core';
import {BaseDatePicker, ICalendarItem} from '../base-date-picker.class';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class YearPicker extends BaseDatePicker {

	public readonly YEARS_PER_CALENDAR = 25;
	public readonly YEARS_PER_ROW = 5;

  public selectedChanged: Subject<ICalendarItem> = new EventEmitter<ICalendarItem>();

	constructor(
    private readonly dateAdapter: LCDatePickerAdapter,
  ) {
		super();
	}

  public getSelectedChanged(): Observable<ICalendarItem> {
    return this.selectedChanged.asObservable();
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

	public setCalendarItem(row: number, column: number): void {
    const item = this.calendarData[row][column];
    if (!item || item.disabled) {
      return;
    }

    this.selectedChanged.next(item);
	}

	public formatCalendarData(): ICalendarItem[][] {

		const yearsArray: ICalendarItem[][] = [];

    const currentYear = (this.control.getValue() as DateTime).getYear();

		const minYear =
      currentYear - currentYear % this.YEARS_PER_CALENDAR;
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
		const minCalendarYear =
      this.control.getMaxDate().getYear() - this.control.getMaxDate().getYear() % this.YEARS_PER_CALENDAR;
		if (this.control.getValue().getYear() >= minCalendarYear) {
			return;
		}

		this.control.setValue(this.dateAdapter.add(this.control.getValue(),this.YEARS_PER_CALENDAR, 'years'));
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public previousYears(): void {

		// If the year of min date is e.g. 1912, this will return 1900 (assuming 25 years per group),
		// i.e. the year in the top left corner of the calendar.
		// This year is then used to prevent the user from going past the screen with the minimum date.
		const minCalendarYear =
      this.control.getMinDate().getYear() - this.control.getMinDate().getYear() % this.YEARS_PER_CALENDAR;
		if (this.control.getValue().getYear() < minCalendarYear + this.YEARS_PER_CALENDAR) {
			return;
		}

		this.control.setValue(this.dateAdapter.subtract(this.control.getValue(), this.YEARS_PER_CALENDAR, 'years'));
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
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

	public setSelectedDate(): void {

		if (
      this.control.getMinDate() &&
      this.control.getMaxDate() &&
      this.dateAdapter.isSame(this.control.getMinDate(), this.control.getMaxDate())
    ) {
			return;
		}

		if (
      this.control.getMinDate() &&
      this.dateAdapter.isBefore(this.control.getValue(), this.control.getMinDate())
    ) {
			this.control.setValue(this.dateAdapter.getStartOfYear(this.control.getMinDate()));
		}
		else if (
      this.control.getMaxDate() &&
      this.dateAdapter.isAfter(this.control.getValue(), this.control.getMaxDate())
    ) {
			this.control.setValue(this.dateAdapter.getStartOfYear(this.control.getMaxDate()));
		}
		else {
			this.control.setValue(this.dateAdapter.getStartOfYear(this.control.getValue()));
		}

		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public addYears(amount: number): void {

		const newYear = this.dateAdapter.add(this.control.getValue(), amount, 'years');

		if (
      newYear.getYear() < this.control.getMinDate().getYear() ||
      newYear.getYear() > this.control.getMaxDate().getYear()
    ) {
			return;
		}

		this.control.setValue(newYear);
		this.calendarData = this.formatCalendarData();
		this.calendarChanges.next();
	}

	public subtractYears(amount: number): void {
		this.addYears(-amount);
	}

	private isYearDisabled(date: DateTime): boolean {
		if (
      this.control.getMinDate() &&
      this.dateAdapter.isBefore(date, this.dateAdapter.getStartOfYear(this.control.getMinDate()))
    ) {
			return true;
		}

		return (
      this.control.getMaxDate() &&
      this.dateAdapter.isAfter(date, this.dateAdapter.getEndOfYear(this.control.getMaxDate()))
    );
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
			this.control.getValue().getTimeZone()
		);

		if (this.isYearDisabled(startOfYear)) {
			item.disabled = true;
		}

		if (
			this.dateAdapter.isSame(
				startOfYear,
				this.dateAdapter.getStartOfYear(this.dateAdapter.today(this.control.getTimezone()))
			)
		) {
			item.current = true;
		}

		if (this.dateAdapter.isSame(startOfYear, this.control.getValue())) {
			item.active = true;
		}
		return item;
	}
}
