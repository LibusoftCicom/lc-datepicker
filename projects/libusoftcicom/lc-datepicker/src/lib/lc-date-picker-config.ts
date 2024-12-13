import { IColorTheme, IDatePickerConfiguration, ILabels, LCDatePickerControl } from './lc-date-picker-control';
import { DateType, ECalendarNavigation, ECalendarType } from './enums';
import { map, merge, Observable } from 'rxjs';
import { Panel } from './base-date-picker.class';
import { LCDatePickerAdapter } from './lc-date-picker-adapter.class';

export class DatePickerConfig {
  private readonly control1: LCDatePickerControl;
  private readonly control2: LCDatePickerControl;

  constructor(
    private readonly config: IDatePickerConfiguration,
    dateAdapter: LCDatePickerAdapter
  ) {
    this.control1 =
      new LCDatePickerControl(
        this.config,
        dateAdapter,
        this.config.calendarType === ECalendarType.DateRange ? DateType.FROM : DateType.REGULAR
      );
    this.control2 =
      new LCDatePickerControl(
        this.config,
        dateAdapter,
        this.config.calendarType === ECalendarType.DateRange ? DateType.TO : DateType.REGULAR
      );
  }


  /** @internal */
  public setHostElement(nativeElement: HTMLElement): void {
    this.control1.setHostElement(nativeElement);
    this.control2.setHostElement(nativeElement);
  }

  /** @internal */
  public getControl(dateType: DateType = DateType.REGULAR): LCDatePickerControl {
    return dateType === DateType.TO ? this.control2 : this.control1;
  }

  /**
   * Allows subscribing to value changes of the datepicker.
   *
   * @return an observable that can be used to subscribe to value changes of the datepicker.
   */
  public getValueChanges(): Observable<string> {
    return this.control1.getValueChanges().pipe(map(value => this.control1.getAdapter().toISOString(value)));
  }

  /**
   * Allows subscribing to changes in the open state of the datepicker.
   *
   * @return an observable that can be used to subscribe to changes in the open state of the datepicker.
   */
  public getOpenChanges(): Observable<boolean> {
    return this.control1.getOpenChanges();
  }

  /**
   * Allows subscribing to changes in navigation of the datepicker.
   *
   * @return an observable that can be used to subscribe to changes in navigation of the datepicker.
   */
  public getNavigationChanges(): Observable<ECalendarNavigation> {
    return this.control1.getNavigationChanges();
  }

  /**
   * Allows subscribing to panel changes of the datepicker.
   *
   * @return an observable that can be used to subscribe to panel changes of the datepicker.
   */
  public getPanelChanges(): Observable<{ panel: Panel, dateType: DateType }> {

    if (this.control1.getCalendarType() === ECalendarType.DateRange) {
      return merge(
        this.control1.getPanelChanges().pipe(map(panel => ({panel: panel, dateType: DateType.FROM}))),
        this.control2.getPanelChanges().pipe(map(panel => ({panel: panel, dateType: DateType.TO})))
      );
    }

    return this.control1.getPanelChanges().pipe(map(panel => ({panel: panel, dateType: DateType.REGULAR})));
  }

  /**
   * Allows subscribing to reset signals of the datepicker.
   *
   * @return an observable that can be used to subscribe to reset signals of the datepicker.
   */
  public getResetChanges(): Observable<void> {
    return this.control1.getResetChanges();
  }

  /**
   * Is the datepicker open.
   *
   * @return true if the datepicker is open, false otherwise.
   */
  public isOpen(): boolean {
    return this.control1.isOpen();
  }

  /**
   * Opens or closes the datepicker.
   *
   * @param {boolean} open - whether the datepicker should be open or closed.
   */
  public setOpen(open: boolean): void {
    this.control1.setOpen(open);
    this.control2.setOpen(open, false);
  }

  /**
   * Retrieves the selected date.
   *
   * @return ISO 8601 formatted string representing the selected date.
   */
  public getValue(): string {
    if (this.control1.getCalendarType() === ECalendarType.DateRange) {
      return this.control1.getAdapter().toISOString(this.control1.getValue()) + '/' + this.control1.getAdapter().toISOString(this.control2.getValue());
    }

    return this.control1.getAdapter().toISOString(this.control1.getValue());
  }

  /**
   * Sets the selected date.
   *
   * @param {string} value - the ISO 8601 formatted string representing the new date.
   */
  public setValue(value: string): void {
    if (this.control1.getCalendarType() === ECalendarType.DateRange) {
      if (value === null || value.trim() === '') {
        const today = this.control1.getAdapter().today(this.control1.getTimezone());
        this.control1.setValue(today, false);
        this.control2.setValue(this.control1.getAdapter().add(today, 1, 'day'), false);
      }
      else {
        const dates = value.split('/');
        this.control1.setValue(this.control1.getAdapter().fromISOString(dates[0], this.control1.getTimezone()), true);
        this.control2.setValue(this.control1.getAdapter().fromISOString(dates[1], this.control2.getTimezone()), true);
      }
    } else if (value === null || value.trim() === '') {
      const today = this.control1.getAdapter().now(this.control1.getTimezone());
      this.control1.setValue(today, false);
    } else {
      this.control1.setValue(this.control1.getAdapter().fromISOString(value, this.control1.getTimezone()), true);
    }
  }

  /**
   * Retrieves the timezone of dates.
   *
   * @return the timezone.
   */
  public getTimezone(): string {
    return this.control1.getTimezone();
  }

  /**
   * Retrieves the type of the calendar.
   *
   * @return the type of the calendar.
   */
  public getCalendarType(): ECalendarType {
    return this.control1.getCalendarType();
  }

  /**
   * Sets the type of the calendar.
   *
   * @param {ECalendarType} type - the type of the calendar.
   */
  public setCalendarType(type: ECalendarType): void {
    this.control1.setCalendarType(type);
    this.control2.setCalendarType(type);
  }

  /**
   * Retrieves the currently active panel, depending on which part of the date the user is currently trying to set.
   * E.g. If the type of calendar is Month picker, and the user is currently setting the year, the active panel
   * will be Year, otherwise it will be Month.
   *
   * @param {DateType} dateType - type of the datepicker calendar,
   * with FROM and TO being for the date range picker and REGULAR (default) for the date picker.
   * @return the current panel.
   */
  public getPanel(dateType: DateType = DateType.REGULAR): Panel {
    return dateType === DateType.TO ? this.control2.getPanel() : this.control1.getPanel();
  }

  /**
   * Retrieves the localization of the datepicker.
   *
   * @return the ISO 639-1 language code.
   */
  public getLocalization(): string {
    return this.control1.getLocalization();
  }

  /**
   * Sets the localization of the datepicker.
   *
   * @param {string} localization - the ISO 639-1 language code.
   */
  public setLocalization(localization: string): void {
    this.control1.setLocalization(localization);
    this.control2.setLocalization(localization);
  }

  /**
   * Retrieves the labels of the datepicker.
   *
   * @return - an object containing the labels.
   */
  public getLabels(): ILabels {
    return this.control1.getLabels();
  }

  /**
   * Sets the labels of the datepicker.
   *
   * @param {ILabels} labels - an object containing the labels.
   */
  public setLabels(labels: ILabels): void {
    this.control1.setLabels(labels);
    this.control2.setLabels(labels);
  }

  /**
   * Retrieves the color theme of the datepicker.
   *
   * @return an object containing the color theme.
   */
  public getTheme(): IColorTheme {
    return this.control1.getTheme();
  }

  /**
   * Sets the color theme of the datepicker.
   *
   * @param {IColorTheme} theme - an object containing the color theme.
   */
  public setTheme(theme: IColorTheme): void {
    this.control1.setTheme(theme);
    this.control2.setTheme(theme);
  }

  /**
   * Retrieves the minimum date of the datepicker.
   *
   * @return the minimum date.
   */
  public getMinDate(): string {
    return this.control1.getAdapter().toISOString(this.control1.getMinDate());
  }

  /**
   * Sets the minimum date of the datepicker.
   *
   * @param {string} date - the ISO 8601 formatted string representing the minimum date.
   */
  public setMinDate(date: string): void {
    this.control1.setMinDate(this.control1.getAdapter().fromISOString(date, this.getTimezone()));
    this.control2.setMinDate(this.control2.getAdapter().fromISOString(date, this.getTimezone()));
  }

  /**
   * Retrieves the maximum date of the datepicker.
   *
   * @return the maximum date.
   */
  public getMaxDate(): string {
    return this.control1.getAdapter().toISOString(this.control1.getMaxDate());
  }

  /**
   * Sets the maximum date of the datepicker.
   *
   * @param {string} date - the ISO 8601 formatted string representing the maximum date.
   */
  public setMaxDate(date: string): void {
    this.control1.setMaxDate(this.control1.getAdapter().fromISOString(date));
    this.control2.setMaxDate(this.control2.getAdapter().fromISOString(date));
  }

  /**
   * Retrieves a list of disabled dates.
   *
   * @return ISO 8601 formatted string list of disabled dates.
   */
  public getDisabledDates(): string[] {
    return this.control1.getDisabledDates();
  }

  /**
   * Sets the disabled dates.
   *
   * @param {string[]} dates - ISO 8601 formatted string list of disabled dates.
   */
  public setDisabledDates(dates: string[]): void {
    this.control1.setDisabledDates(dates);
    this.control2.setDisabledDates(dates);
  }

  /**
   * Is the datepicker focused.
   *
   * @return true if the datepicker is focused, false otherwise.
   */
  public isFocused(): boolean {
    return this.control1.isFocused();
  }

  /**
   * Sets the focus on the datepicker.
   */
  public focus(): void {
    this.control1.focus();
  }

  /**
   * Navigates up on the calendar grid.
   */
  public navigateUp(): void {
    this.control1.navigateUp();
  }

  /**
   * Navigates down on the calendar grid.
   */
  public navigateDown(): void {
    this.control1.navigateDown();
  }

  /**
   * Navigates right on the calendar grid.
   */
  public navigateRight(): void {
    this.control1.navigateRight();
  }

  /**
   * Navigates left on the calendar grid.
   */
  public navigateLeft(): void {
    this.control1.navigateLeft();
  }

  /**
   * Closes the datepicker.
   */
  public close(): void {
    this.control1.close();
  }

  /**
   * Closes the datepicker and emit the currently selected date.
   */
  public confirm(): void {
    this.control1.confirm();
    this.control2.confirm();
  }

  /**
   * Go to the next grid of the calendar (e.g. next month).
   */
  public nextPage(): void {
    this.control1.nextPage();
  }

  /**
   * Go to the previous grid of the calendar (e.g. previous month).
   */
  public previousPage(): void {
    this.control1.previousPage();
  }
}
