import { Observable, Subject } from 'rxjs';
import { Panel } from './base-date-picker.class';
import { DateTime } from './date-time.class';
import { ECalendarNavigation, ECalendarType } from './enums';

export interface ITime {
    minute: number;
    hour: number;
}

export interface IDisabledTimeRanges {
    startTime: ITime;
    stopTime: ITime;
}

export interface ILabels {
    confirmLabel?: string;
}

export interface IColorTheme {
    primaryColor: string;
    fontColor: string;
}

export class DatePickerConfig {
    private calendarType: ECalendarType = ECalendarType.Date;
    public theme: IColorTheme = {primaryColor: '#5e666f', fontColor: '#5e666f'};
    public labels: ILabels = {
        confirmLabel: 'OK'
    };
    public fromLabel = 'From';
    public toLabel = 'To';
    private use24HourFormat = true;
    private localization = 'en';
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
    private minDate: DateTime = this.defaultMinDate;
    private maxDate: DateTime = this.defaultMaxDate;
    private readonly disabledDates: DateTime[] = [];

    private disabledTimeRanges: IDisabledTimeRanges[] = [];

    private readonly navigationChanged: Subject<ECalendarNavigation> = new Subject();
    private hostElement: HTMLElement = null;

    private open = false;
    private readonly openChanges: Subject<boolean> = new Subject();
    private activePanel: Panel;
    private timezone: string = 'UTC';

    constructor() {
        this.theme = {
            primaryColor: 'black',
            fontColor: 'black'
        };

        this.setActivePanelFromCalendarType(this.calendarType);
    }

    public getTimezone(): string {
        return this.timezone;
    }

    public setTimezone(timezone: string): void {
        this.timezone = timezone;
    }

    public getDisabledDates(): DateTime[] {
        return this.disabledDates;
    }

    /**
     * to set list of dates which will be used as disabled
     * @param dates
     */
    public setDisabledDates(dates: DateTime[]): void {
        dates.forEach(date => {
            this.disabledDates.push(date.clone());
        });
    }

    public getCalendarType(): ECalendarType {
        return this.calendarType;
    }

    public setCalendarType(type: ECalendarType): void {
        this.calendarType = type;
    }

    public getLocalization(): string {
        return this.localization;
    }

    public setLocalization(localization: string): void {
        this.localization = localization;
    }

    public getDefaultMinDate(): DateTime {
        return this.defaultMinDate.clone();
    }

    public getDefaultMaxDate(): DateTime {
        return this.defaultMaxDate.clone();
    }

    public getMinDate(): DateTime {
        return this.minDate.clone();
    }

    public setMinDate(date: DateTime): void {
        this.minDate = date.clone();
    }

    public getMaxDate(): DateTime {
        return this.maxDate.clone();
    }

    public setMaxDate(date: DateTime): void {
        this.maxDate = date.clone();
    }

    public getDisabledTimeRanges(): IDisabledTimeRanges[] {
        return this.disabledTimeRanges;
    }

    public clearDisabledTimeRange(): void {
        this.disabledTimeRanges = [];
    }

    public addDisabledTimeRange(timeRange: IDisabledTimeRanges): void {
        const min = timeRange.startTime;
        const max = timeRange.stopTime;

        if (!this.isValidTime(min) || !this.isValidTime(max)) {
            throw new Error('Invalid start/stop time format');
        }

        if (!this.isValidTimeRange(min, max)) {
            throw new Error('Stop time range must be after start');
        }

        this.disabledTimeRanges.push({
            startTime: {
                hour: min.hour,
                minute: min.minute
            },
            stopTime: {
                hour: max.hour,
                minute: max.minute
            }
        });
    }

    public isOpen(): boolean {
        return this.open;
    }

    public setOpen(open: boolean): void {
        this.open = open;
        this.openChanges.next(this.open);
    }

    public setActivePanel(panel: Panel): void {
        this.activePanel = panel;
    }

    public setActivePanelFromCalendarType(calendarType: ECalendarType): void {
        switch (calendarType) {
            case ECalendarType.Date:
                this.activePanel = Panel.Day;
                break;
            case ECalendarType.Year:
                this.activePanel = Panel.Year;
                break;
            case ECalendarType.MonthYear:
                this.activePanel = Panel.Month;
                break;
            case ECalendarType.Time:
                this.activePanel = Panel.Time;
                break;
            default:
                break;
        }
    }

    public getActivePanel(): Panel {
        return this.activePanel;
    }

    public get navigationChanges(): Observable<ECalendarNavigation> {
        return this.navigationChanged.asObservable();
    }

    public getOpenChanges(): Observable<boolean> {
        return this.openChanges.asObservable();
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
        this.hostElement = hostElement;
    }

    public isFocused(): boolean {
        return document.activeElement == this.hostElement;
    }

    public focus(): void {
        this.hostElement?.focus();
    }

    public setTimeFormat(use24HourFormat: boolean): void {
        this.use24HourFormat = use24HourFormat;
    }

    public  is24HourFormat() {
        return this.use24HourFormat;
    }

    public clone(): DatePickerConfig {
        const config = new DatePickerConfig();
        config.setCalendarType(this.calendarType);
        config.setLocalization(this.localization);
        config.setMinDate(this.minDate);
        config.setMaxDate(this.maxDate);
        config.setDisabledDates(this.disabledDates);
        config.setTimezone(this.timezone);
        config.theme = Object.assign(this.theme);
        config.labels = Object.assign(this.labels);
        config.setTimeFormat(this.use24HourFormat);
        return config;
    }

    private isValidTime(time: ITime): boolean {
        return time.hour >= 0 && time.hour < 24 && time.minute >= 0 && time.minute < 60;
    }

    private isValidTimeRange(startTime: ITime, stopTime: ITime): boolean {
        return startTime.hour < stopTime.hour || (startTime.hour === stopTime.hour && startTime.minute < stopTime.minute);
    }
}
