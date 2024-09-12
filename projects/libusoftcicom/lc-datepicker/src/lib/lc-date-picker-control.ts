import { Panel } from './base-date-picker.class';
import { DateTime } from './date-time.class';
import { DateType, ECalendarNavigation, ECalendarType, EHourFormat } from './enums';
import { Observable, Subject } from 'rxjs';
import { LCDatePickerAdapter } from './lc-date-picker-adapter.class';

export interface ITime {
  hour: number;
  minute: number;
}

export interface IDisabledTimeRange {
  startTime: ITime;
  stopTime: ITime;
}

export interface ILabels {
  confirmLabel?: string;
  fromLabel?: string;
  toLabel?: string;
}

export interface IColorTheme {
  primaryColor: string;
  fontColor: string;
}

export interface IDateTimeRange {
  dateTimeFrom: DateTime;
  dateTimeTo: DateTime;
}

export interface IDatePickerConfiguration {
  value: string;
  calendarType?: ECalendarType;
  theme?: IColorTheme;
  labels?: ILabels;
  hourFormat?: EHourFormat;
  localization?: string;
  minimumDate?: string;
  maximumDate?: string;
  disabledDates?: string[];
  disabledTimeRanges?: IDisabledTimeRange[];
  timezone?: string;
  open?: boolean;
}

export class LCDatePickerControl {

  private datePickerConfiguration: IDatePickerConfiguration;
  private hostElement: HTMLElement = null;
  private panel: Panel;
  private type = DateType.REGULAR;
  private value: DateTime | IDateTimeRange;
  private minimumDate: DateTime;
  private maximumDate: DateTime;

  private readonly panelChanged: Subject<Panel> = new Subject();
  private readonly openChanged: Subject<boolean> = new Subject();
  private readonly navigationChanged: Subject<ECalendarNavigation> = new Subject();
  private readonly valueChanged: Subject<DateTime> = new Subject();
  private readonly resetChanged: Subject<void> = new Subject();

  private readonly defaultMinDate: DateTime = new DateTime(
    1900,
    0,
    1,
    0,
    0,
    0,
    0,
    'UTC'
  );
  private readonly defaultMaxDate: DateTime = new DateTime(
    2099,
    11,
    31,
    0,
    0,
    0,
    0,
    'UTC'
  );

  private dateAdapter: LCDatePickerAdapter;

  constructor(
    config: IDatePickerConfiguration,
    dateAdapter: LCDatePickerAdapter,
    type?: DateType
  ) {
    this.dateAdapter = dateAdapter;
    let disabledTimeRanges: IDisabledTimeRange[] = [];
    if (config.disabledTimeRanges) {
      disabledTimeRanges = config.disabledTimeRanges.map(timeRange => this.validateDisabledTimeRange(timeRange));
    }

    if (type) {
      this.type = type;
    }

    this.datePickerConfiguration = {
      value: config.value ?? null,
      calendarType: config.calendarType ?? ECalendarType.Date,
      theme: config.theme ? Object.assign(config.theme) : { primaryColor: '#5e666f', fontColor: '#5e666f' },
      labels: config.labels ? Object.assign(config.labels) : { confirmLabel: 'OK', fromLabel: 'From', toLabel: 'To' },
      hourFormat: config.hourFormat ?? EHourFormat.TWENTY_FOUR_HOUR,
      localization: config.localization ?? 'en',
      minimumDate: config.minimumDate ?? '',
      maximumDate: config.maximumDate ?? '',
      disabledDates: config.disabledDates ? [...config.disabledDates] : [],
      disabledTimeRanges,
      timezone: config.timezone ?? 'UTC',
      open: config.open ?? false,
    };

    this.setPanelFromCalendarType(this.datePickerConfiguration.calendarType);

    this.initializeValue();
    this.setDateBoundaries();
  }

  public getValue(): DateTime {
    switch (this.type) {
      case DateType.REGULAR:
        return (this.value as DateTime).clone();
      case DateType.FROM:
        return (this.value as IDateTimeRange).dateTimeFrom.clone();
      case DateType.TO:
        return (this.value as IDateTimeRange).dateTimeTo.clone();
    }
  }

  public getAdapter(): LCDatePickerAdapter {
    return this.dateAdapter;
  }

  public setValue(value: DateTime, shouldEmit: boolean = false): void {
    const adjustDateTime = this.adjustValueToCalendarType(value);
    switch (this.type) {
      case DateType.REGULAR:
        this.value = adjustDateTime.clone();
        break;
      case DateType.FROM:
        (this.value as IDateTimeRange).dateTimeFrom = adjustDateTime.clone();
        break;
      case DateType.TO:
        (this.value as IDateTimeRange).dateTimeTo = adjustDateTime.clone();
        break;
    }

    if (shouldEmit) {
      this.valueChanged.next(value);
    }
  }

  public setPanelFromCalendarType(calendarType: ECalendarType): void {
    switch (calendarType) {
      case ECalendarType.DateTime:
      case ECalendarType.Date:
      case ECalendarType.DateRange:
        this.setPanel(Panel.Day);
        break;
      case ECalendarType.MonthYear:
        this.setPanel(Panel.Month);
        break;
      case ECalendarType.Year:
        this.setPanel(Panel.Year);
        break;
      case ECalendarType.Time:
        this.setPanel(Panel.Time);
        break;
    }
  }

  public getPanel(): Panel {
    return this.panel;
  }

  public setPanel(panel: Panel): void {
    this.panel = panel;
    this.panelChanged.next(this.panel);
  }

  public getTimezone(): string {
    return this.datePickerConfiguration.timezone;
  }

  public getDisabledDates(): string[] {
    return [...this.datePickerConfiguration.disabledDates];
  }

  public setDisabledDates(dates: string[]): void {
    this.datePickerConfiguration.disabledDates = [...dates];
  }

  public getCalendarType(): ECalendarType {
    return this.datePickerConfiguration.calendarType;
  }

  public setCalendarType(calendarType: ECalendarType): void {
    this.datePickerConfiguration.calendarType = calendarType;
    this.setPanelFromCalendarType(this.datePickerConfiguration.calendarType);
  }

  public getLocalization(): string {
    return this.datePickerConfiguration.localization;
  }

  public setLocalization(localization: string): void {
    this.datePickerConfiguration.localization = localization;
  }

  public getDefaultMinDate(): DateTime {
    return this.defaultMinDate.clone();
  }

  public getDefaultMaxDate(): DateTime {
    return this.defaultMaxDate.clone();
  }

  public getMinDate(): DateTime {
    return this.minimumDate.clone();
  }

  public setMinDate(date: DateTime): void {
    this.minimumDate = date.clone();
  }

  public getMaxDate(): DateTime {
    return this.maximumDate.clone();
  }

  public setMaxDate(date: DateTime): void {
    this.maximumDate = date.clone();
  }

  public getDisabledTimeRanges(): IDisabledTimeRange[] {
    return [...this.datePickerConfiguration.disabledTimeRanges];
  }

  public  getHourFormat(): EHourFormat {
    return this.datePickerConfiguration.hourFormat;
  }

  public  setHourFormat(hourFormat: EHourFormat): void {
    this.datePickerConfiguration.hourFormat = hourFormat;
  }

  public getLabels(): ILabels {
    return Object.assign(this.datePickerConfiguration.labels);
  }

  public setLabels(labels: ILabels): void {
    this.datePickerConfiguration.labels = Object.assign(labels);
  }

  public getTheme(): IColorTheme {
    return Object.assign(this.datePickerConfiguration.theme);
  }

  public setTheme(theme: IColorTheme): void {
    this.datePickerConfiguration.theme = Object.assign(theme);
  }

  public isOpen(): boolean {
    return this.datePickerConfiguration.open;
  }

  public setOpen(open: boolean, emit: boolean = true): void {
    this.datePickerConfiguration.open = open;
    if (emit) {
      this.openChanged.next(this.datePickerConfiguration.open);
    }
  }

  public isFocused(): boolean {
    return document.activeElement == this.hostElement;
  }

  public focus(): void {
    this.hostElement?.focus();
  }

  public setHostElement(hostElement: HTMLElement): void {
    if (!this.hostElement) {
      this.hostElement = hostElement;
    }
  }

  public getNavigationChanges(): Observable<ECalendarNavigation> {
    return this.navigationChanged.asObservable();
  }

  public getPanelChanges(): Observable<Panel> {
    return this.panelChanged.asObservable();
  }

  public getOpenChanges(): Observable<boolean> {
    return this.openChanged.asObservable();
  }

  public getValueChanges(): Observable<DateTime> {
    return this.valueChanged.asObservable();
  }

  public getResetChanges(): Observable<void> {
    return this.resetChanged.asObservable();
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

  public reset(): void {
    switch (this.getCalendarType()) {
      case ECalendarType.Date:
        this.setValue(this.dateAdapter.today(this.getTimezone()), true);
        break;
      case ECalendarType.DateRange:
        this.setValue(this.dateAdapter.today(this.getTimezone()));
        break;
      case ECalendarType.DateTime:
      case ECalendarType.Time:
        this.setValue(this.dateAdapter.now(this.getTimezone()));
        break;
      case ECalendarType.MonthYear:
        this.setValue(
          this.dateAdapter.getStartOfMonth(this.dateAdapter.today(this.getTimezone())), true);
        break;
      case ECalendarType.Year:
        this.setValue(
          this.dateAdapter.getStartOfYear(this.dateAdapter.today(this.getTimezone())), true);
        break;
    }

    this.resetChanged.next();
  }

  private adjustValueToCalendarType(dateTime: DateTime): DateTime {
    switch (this.getCalendarType()) {
      case ECalendarType.Date:
      case ECalendarType.DateRange:
        return this.dateAdapter.setParts(dateTime, {hour: 0, minute: 0, second: 0, millisecond: 0});
      case ECalendarType.DateTime:
      case ECalendarType.Time:
        return this.dateAdapter.setParts(dateTime, {second: 0, millisecond: 0});
      case ECalendarType.MonthYear:
        return this.dateAdapter.setParts(dateTime, {date: 1, hour: 0, minute: 0, second: 0, millisecond: 0});
      case ECalendarType.Year:
        return this.dateAdapter.setParts(dateTime, {month: 0, date: 1, hour: 0, minute: 0, second: 0, millisecond: 0});
    }
  }

  private initializeValue(): void {

    if (this.datePickerConfiguration.calendarType === ECalendarType.DateRange) {
      if (this.datePickerConfiguration.value.trim() === '') {
        const today = this.adjustValueToCalendarType(this.dateAdapter.today(this.datePickerConfiguration.timezone));
        this.value = {
          dateTimeFrom: today,
          dateTimeTo: this.dateAdapter.add(today, 1, 'day'),
        };
      }
      else {
        const dates = this.datePickerConfiguration.value.split('/');
        this.value = {
          dateTimeFrom: this.adjustValueToCalendarType(this.dateAdapter.fromISOString(dates[0], this.datePickerConfiguration.timezone)),
          dateTimeTo: this.adjustValueToCalendarType(this.dateAdapter.fromISOString(dates[1], this.datePickerConfiguration.timezone)),
        };
      }
    }
    else {
      this.value =
        this.adjustValueToCalendarType(this.dateAdapter.fromISOString(this.datePickerConfiguration.value, this.datePickerConfiguration.timezone));
    }
  }

  private setDateBoundaries(): void {
    this.minimumDate =
      this.datePickerConfiguration.minimumDate.trim() !== ''
        ? this.dateAdapter.fromISOString(
          this.datePickerConfiguration.minimumDate,
          this.datePickerConfiguration.timezone
        )
        : this.defaultMinDate;

    this.maximumDate =
      this.datePickerConfiguration.maximumDate.trim() !== ''
        ? this.dateAdapter.fromISOString(
          this.datePickerConfiguration.maximumDate,
          this.datePickerConfiguration.timezone
        )
        : this.defaultMaxDate;
  }

  private validateDisabledTimeRange(timeRange: IDisabledTimeRange): IDisabledTimeRange {
    const min = timeRange.startTime;
    const max = timeRange.stopTime;

    if (!this.isValidTime(min) || !this.isValidTime(max)) {
      throw new Error('Invalid start/stop time format');
    }

    if (!this.isValidTimeRange(min, max)) {
      throw new Error('Stop time range must be after start');
    }

    return {
      startTime: {
        hour: min.hour,
        minute: min.minute
      },
      stopTime: {
        hour: max.hour,
        minute: max.minute
      }
    };
  }

  private isValidTime(time: ITime): boolean {
    return time.hour >= 0 && time.hour < 24 && time.minute >= 0 && time.minute < 60;
  }

  private isValidTimeRange(startTime: ITime, stopTime: ITime): boolean {
    return startTime.hour < stopTime.hour || (startTime.hour === stopTime.hour && startTime.minute < stopTime.minute);
  }
}
