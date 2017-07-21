import * as Moment from 'moment';

export enum ECalendarType {
    Time,
    DateTime,
    Date,
    MonthYear,
    Year
}

export interface IDate {
    years?: number,
    months?: number,
    date?: number,
    hours?: number,
    minutes?: number
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

export class DatePickerConfig {
    private calendarType: ECalendarType;
    private localization: string;
    private minDate: IDate;
    private maxDate: IDate;
    private labels: ILabels;
    private theme: IColorTheme; 
    private format : Moment.MomentInput;

    constructor() { 
        this.theme = {
            primaryColor: 'black',
            fontColor: 'black'
        };
    }

    get CalendarType() {
        return this.calendarType;
    }

    set CalendarType(type: ECalendarType) {
        this.calendarType = type;
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

    set MinDate(date: IDate) {
        this.minDate = date;
    }

    get MaxDate() {
        return this.maxDate;
    }

    set MaxDate(date: IDate) {
        this.maxDate = date;
    }

    get MinYear() {
        return this.minDate.years;
    }

    set MinYear(minYear: number) {
        this.minDate.years = minYear;
    }

    get MaxYear() {
        return this.maxDate.years;
    }

    set MaxYear(minYear: number) {
        this.maxDate.years = minYear;
    }

    get MinMonth() {
        return this.minDate.months;
    }

    set MinMonth(minMonth: number) {
        this.minDate.months = minMonth;
    }

    get MaxMonth() {
        return this.maxDate.months;
    }

    set MaxMonth(minMonth: number) {
        this.maxDate.months = minMonth;
    }

    get MinDay() {
        return this.minDate.date;
    }

    set MinDay(minDay: number) {
        this.minDate.date = minDay;
    }

    get MaxDay() {
        return this.maxDate.date;
    }

    set MaxDay(maxDay: number) {
        this.maxDate.date = maxDay;
    }

    get MinHour() {
        return this.minDate.hours;
    }

    set MinHour(minHour: number) {
        this.minDate.hours = minHour;
    }

    get MaxHour() {
        return this.maxDate.hours;
    }

    set MaxHour(maxHour: number) {
        this.maxDate.hours = maxHour;
    }

    get MinMinutes() {
        return this.minDate.minutes;
    }

    set MinMinutes(minMinutes: number) {
        this.minDate.minutes = minMinutes;
    }

    get MaxMinutes() {
        return this.maxDate.minutes;
    }

    set MaxMinutes(maxMinutes: number) {
        this.maxDate.minutes = maxMinutes;
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

    set Format(val: Moment.MomentInput) {
        this.format = val
    }
}
