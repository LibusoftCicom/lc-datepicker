import { Panel } from './base-date-picker.class';
import { DateTime } from './date-time.class';
import { DateType, ECalendarNavigation, ECalendarType, EHourFormat } from './enums';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
  timeLabel?: string;
}

export interface IColorTheme {
  primaryColor: string;
  fontColor: string;
}

export interface IDateTimeRange {
  dateTimeFrom: DateTime;
  dateTimeTo: DateTime;
}

export interface IDatePickerEvent {
  date: string;
  label: string;
  description?: string;
  metadata?: Readonly<Record<string, unknown>>;
}

export interface IDatePickerViewOptions {
  showAdjacentDays?: boolean;
  compactWeekdays?: boolean;
  compactTime?: boolean;
  yearColumns?: 4 | 5;
  yearPageAnchor?: number;
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
  dateEvents?: IDatePickerEvent[];
  disabledTimeRanges?: IDisabledTimeRange[];
  timezone?: string;
  open?: boolean;
  selectionMode?: 'immediate' | 'explicit';
  rangeSelectionMode?: 'independent' | 'linked';
  rangeNavigationMode?: 'independent' | 'synchronized';
  view?: IDatePickerViewOptions;
}

export class LCDatePickerControl {

  private datePickerConfiguration: IDatePickerConfiguration;
  private hostElement: HTMLElement = null;
  private panel: Panel;
  private type = DateType.REGULAR;
  private value: DateTime | IDateTimeRange;
  private minimumDate: DateTime;
  private maximumDate: DateTime;
  private rangeSelectionComplete = true;
  private valueSet = true;
  private readonly rangeSelectionChanged = new BehaviorSubject<boolean>(true);

  private readonly panelChanged: Subject<Panel> = new Subject();
  private readonly openChanged: Subject<boolean> = new Subject();
  private readonly navigationChanged: Subject<ECalendarNavigation> = new Subject();
  private readonly valueChanged: Subject<DateTime> = new Subject();
  private readonly resetChanged: Subject<void> = new Subject();
  private readonly dateEventsChanged = new Subject<IDatePickerEvent[]>();
  private readonly dateEventsByDay = new Map<string, IDatePickerEvent[]>();

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
      dateEvents: config.dateEvents ? config.dateEvents.map(event => ({ ...event })) : [],
      disabledTimeRanges,
      timezone: config.timezone ?? 'UTC',
      open: config.open ?? false,
      selectionMode: config.selectionMode ?? 'immediate',
      rangeSelectionMode: config.rangeSelectionMode ?? 'independent',
      rangeNavigationMode: config.rangeNavigationMode ?? 'independent',
      view: config.view ? { ...config.view } : undefined,
    };

    this.indexDateEvents();
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

  public getViewOptions(): Readonly<IDatePickerViewOptions> {
    return this.datePickerConfiguration.view ?? {};
  }

  public getDateEvents(): IDatePickerEvent[] {
    return this.datePickerConfiguration.dateEvents.map(event => ({ ...event }));
  }

  public setDateEvents(events: IDatePickerEvent[]): void {
    this.datePickerConfiguration.dateEvents = events.map(event => ({ ...event }));
    this.indexDateEvents();
    this.dateEventsChanged.next(this.getDateEvents());
  }

  public getDateEventsChanges(): Observable<IDatePickerEvent[]> {
    return this.dateEventsChanged.asObservable();
  }

  public getDateEventsForDay(date: DateTime): IDatePickerEvent[] {
    return (this.dateEventsByDay.get(this.dateEventKey(date)) ?? []).map(event => ({ ...event }));
  }

  private indexDateEvents(): void {
    this.dateEventsByDay.clear();
    this.datePickerConfiguration.dateEvents.forEach(event => {
      const key = /^\d{4}-\d{2}-\d{2}$/.test(event.date)
        ? event.date
        : this.dateEventKey(this.dateAdapter.fromISOString(event.date, this.getTimezone()));
      const events = this.dateEventsByDay.get(key) ?? [];
      events.push({ ...event });
      this.dateEventsByDay.set(key, events);
    });
  }

  private dateEventKey(date: DateTime): string {
    return `${date.getYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  public shouldConfirmSelection(): boolean {
    return this.datePickerConfiguration.selectionMode !== 'explicit';
  }

  public isLinkedRangeSelection(): boolean {
    return this.getCalendarType() === ECalendarType.Date &&
      this.datePickerConfiguration.rangeSelectionMode === 'linked';
  }

  /** Indicates whether the current linked-range draft is ready to confirm. */
  public isRangeSelectionComplete(): boolean {
    return this.rangeSelectionComplete;
  }

  /** @internal */
  public setRangeSelectionComplete(complete: boolean): void {
    this.rangeSelectionComplete = complete;
    this.rangeSelectionChanged.next(complete);
  }

  /**
   * @internal
   * False when an independent range side has no selected date; the value is then only used for calendar navigation.
   */
  public isValueSet(): boolean {
    return this.valueSet;
  }

  /** @internal */
  public setValueSet(valueSet: boolean): void {
    this.valueSet = valueSet;
  }

  /** Emits when linked-range confirmation becomes available or unavailable. */
  public getRangeSelectionChanges(): Observable<boolean> {
    return this.rangeSelectionChanged.asObservable();
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
    this.valueSet = true;
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
      const [from, to] = (this.datePickerConfiguration.value ?? '').trim().split('/');
      if (!from && !to) {
        const today = this.adjustValueToCalendarType(this.dateAdapter.today(this.datePickerConfiguration.timezone));
        this.value = {
          dateTimeFrom: today,
          dateTimeTo: this.dateAdapter.add(today, 1, 'day'),
        };
      }
      else {
        this.value = {
          dateTimeFrom: this.adjustValueToCalendarType(this.dateAdapter.fromISOString(from || to, this.datePickerConfiguration.timezone)),
          dateTimeTo: this.adjustValueToCalendarType(this.dateAdapter.fromISOString(to || from, this.datePickerConfiguration.timezone)),
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
