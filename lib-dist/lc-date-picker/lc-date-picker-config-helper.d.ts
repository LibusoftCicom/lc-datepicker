import * as Moment from 'moment';
export declare enum ECalendarType {
    Time = 0,
    DateTime = 1,
    Date = 2,
    MonthYear = 3,
    Year = 4,
}
export interface IDate {
    years?: number;
    months?: number;
    date?: number;
    hours?: number;
    minutes?: number;
}
export interface ILabels {
    confirmLabel?: string;
}
export interface IColorTheme {
    primaryColor: string;
    fontColor: string;
}
export interface IDisabledDates {
    [date: string]: Moment.Moment;
}
export declare class DatePickerConfig {
    private calendarType;
    private localization;
    private minDate;
    private maxDate;
    private labels;
    private theme;
    private format;
    private disabledDates;
    constructor();
    readonly DisabledDates: IDisabledDates;
    /**
     * to set list of dates which will be used as disabled
     * @param dates
     */
    setDisabledDates(dates: Array<Moment.MomentInput>): void;
    CalendarType: ECalendarType;
    Localization: string;
    MinDate: IDate;
    MaxDate: IDate;
    MinYear: number;
    MaxYear: number;
    MinMonth: number;
    /**
     * moment use 6 for 7th month, that's why we
     * subtract -1
     */
    MaxMonth: number;
    MinDay: number;
    MaxDay: number;
    MinHour: number;
    MaxHour: number;
    MinMinutes: number;
    MaxMinutes: number;
    Labels: ILabels;
    ConfirmLabel: string;
    ColorTheme: IColorTheme;
    PrimaryColor: string;
    FontColor: string;
    Format: Moment.MomentInput;
}
