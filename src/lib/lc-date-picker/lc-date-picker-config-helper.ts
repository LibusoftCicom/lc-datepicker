import moment from 'moment-es6';
import { Subject, Observable } from 'rxjs';

export enum ECalendarType {
  Time,
  DateTime,
  Date,
  MonthYear,
  Year
}

export interface IDate {
  years?: number;
  months?: number;
  date?: number;
}

export interface ITime {
  minute: number;
  hour: number;
}

export interface IDisabledTimeRanges {
  startTime: ITime;
  stopTime: ITime;
}

interface IDateRange {
  minDate: IDate;
  maxDate: IDate;
}

export interface ILabels {
  confirmLabel?: string;
}

export interface IColorTheme {
  primaryColor: string;
  fontColor: string;
}

export interface IDisabledDates {
  [date: string]: moment.Moment;
}

export enum ECalendarNavigation {
  Up,
  Right,
  Down,
  Left,
  PageUp,
  PageDown,
  Confirm,
  Close
}

export class DatePickerConfig {
  private calendarType: ECalendarType = ECalendarType.Date;
  private localization: string = 'en';
  private defaultMinDate: IDate = {
    date: 1,
    months: 0,
    years: 1900
  };
  private defaultMaxDate: IDate = {
    date: 31,
    months: 11,
    years: 2099
  };
  private minDate: IDate = this.defaultMinDate;
  private maxDate: IDate = this.defaultMaxDate;
  private labels: ILabels = {
    confirmLabel: 'Ok'
  };
  private theme: IColorTheme;
  private format: moment.MomentInput;
  private disabledDates: IDisabledDates = {};

  private disabledTimeRanges: IDisabledTimeRanges[] = [];

  private readonly navigationChanged: Subject<ECalendarNavigation> = new Subject();
  public readonly panelChanges: Subject<ECalendarType> = new Subject();
  private hostElement: HTMLElement = null;

  constructor() {
    this.theme = {
      primaryColor: 'black',
      fontColor: 'black'
    };
  }

  get DisabledDates(): IDisabledDates {
    return this.disabledDates;
  }

  /**
   * to set list of dates which will be used as disabled
   * @param dates
   */
  setDisabledDates(dates: Array<moment.MomentInput>) {
    dates.forEach(date => {
      let d = moment(date);
      this.disabledDates[d.format('YYYY-MM-DD')] = d;
    });
  }

  get CalendarType() {
    return this.calendarType;
  }

  set CalendarType(type: ECalendarType) {
    this.calendarType = type;
    this.panelChanges.next(this.calendarType);
  }

  get Localization() {
    return this.localization;
  }

  set Localization(localization: string) {
    this.localization = localization;
  }

  get MinDate() {
    return this.minDate;
  }

  get DefaultMinDate() {
    return this.defaultMinDate;
  }

  set MinDate(date: IDate) {
    let d = moment(date);

    if (!d.isValid()) {
      throw 'Invalid MinDate format';
    }

    this.minDate = date;
  }

  get MaxDate() {
    return this.maxDate;
  }

  get DefaultMaxDate() {
    return this.defaultMaxDate;
  }

  set MaxDate(date: IDate) {
    let d = moment(date);

    if (!d.isValid()) {
      throw 'Invalid MaxDate format';
    }
    this.maxDate = date;
  }

  get MinYear() {
    return this.minDate && this.minDate.years;
  }

  set MinYear(minYear: number) {
    this.minDate.years = minYear;
  }

  get MaxYear() {
    return this.maxDate && this.maxDate.years;
  }

  set MaxYear(minYear: number) {
    this.maxDate.years = minYear;
  }

  get MinMonth() {
    return this.minDate && this.minDate.months;
  }

  set MinMonth(minMonth: number) {
    this.minDate.months = minMonth;
  }

  get MaxMonth() {
    return this.maxDate && this.maxDate.months;
  }

  /**
   * moment use 6 for 7th month, that's why we
   * subtract -1
   */
  set MaxMonth(minMonth: number) {
    this.maxDate.months = minMonth - 1;
  }

  get MinDay() {
    return this.minDate && this.minDate.date;
  }

  set MinDay(minDay: number) {
    this.minDate.date = minDay;
  }

  get MaxDay() {
    return this.maxDate && this.maxDate.date;
  }

  set MaxDay(maxDay: number) {
    this.maxDate.date = maxDay;
  }

  get Labels() {
    return this.labels;
  }

  set Labels(label: ILabels) {
    this.labels = label;
  }

  get ConfirmLabel() {
    return this.labels.confirmLabel;
  }

  set ConfirmLabel(confirmLabel: string) {
    this.labels.confirmLabel = confirmLabel;
  }

  get ColorTheme() {
    return this.theme;
  }

  set ColorTheme(theme: IColorTheme) {
    this.theme = theme;
  }

  get PrimaryColor() {
    return this.theme.primaryColor;
  }

  set PrimaryColor(primaryColor: string) {
    this.theme.primaryColor = primaryColor;
  }

  get FontColor() {
    return this.theme.fontColor;
  }

  set FontColor(fontColor: string) {
    this.theme.fontColor = fontColor;
  }

  get Format() {
    return this.format;
  }

  set Format(val: moment.MomentInput) {
    this.format = val;
  }

  get DisabledTimeRanges() {
    return this.disabledTimeRanges;
  }

  public clearDisabledTimeRange() {
    this.disabledTimeRanges = [];
  }

  public addDisabledTimeRange(start: moment.MomentInput, stop: moment.MomentInput) {
    let min = moment(start, 'HH:mm');
    let max = moment(stop, 'HH:mm');

    if (!min.isValid() || !max.isValid()) {
      throw 'Invalid start/stop time format';
    }

    if (min.diff(max) > 0) {
      throw 'Stop time range must be after start';
    }

    this.disabledTimeRanges.push({
      startTime: {
        hour: min.hour(),
        minute: min.minutes()
      },
      stopTime: {
        hour: max.hours(),
        minute: max.minutes()
      }
    });
  }

  public get navigationChanges(): Observable<ECalendarNavigation> {
    return this.navigationChanged.asObservable();
  }

  public navigateRight(): void {
    this.navigationChanged.next(ECalendarNavigation.Right);
  }

  public navigateLeft(): void {
    this.navigationChanged.next(ECalendarNavigation.Left);
  }

  public navigateUp(): void {
    this.navigationChanged.next(ECalendarNavigation.Up);
  }

  public navigateDown(): void {
    this.navigationChanged.next(ECalendarNavigation.Down);
  }

  public nextPage(): void {
    this.navigationChanged.next(ECalendarNavigation.PageUp);
  }

  public previousPage(): void {
    this.navigationChanged.next(ECalendarNavigation.PageDown);
  }

  public confirm(): void {
    this.navigationChanged.next(ECalendarNavigation.Confirm);
  }

  public close(): void {
    this.navigationChanged.next(ECalendarNavigation.Close);
  }

  /** @internal */
  public setHostElement(hostElement: HTMLElement): void {
    if (!this.hostElement) {
      this.hostElement = hostElement;
    }
  }

  public isFocused(): boolean {
    return document.activeElement == this.hostElement;
  }

  public focus(): void {
    this.hostElement && this.hostElement.focus();
  }
}
