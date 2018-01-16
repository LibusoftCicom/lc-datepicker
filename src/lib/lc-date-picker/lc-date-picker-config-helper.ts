import moment from 'moment-es6';




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

export interface IDisabledDates {
    [date:string]: moment.Moment;
}

export class DatePickerConfig {
    private calendarType: ECalendarType = ECalendarType.Date;
    private localization: string = 'en';
    private minDate: IDate = null;
    private maxDate: IDate = null;
    private labels: ILabels = {
        confirmLabel: 'Ok'
    };
    private theme: IColorTheme; 
    private format : moment.MomentInput;
    private disabledDates: IDisabledDates = {};

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
    setDisabledDates( dates: Array<moment.MomentInput> ) {
        dates.forEach(( date ) => {
            let d = moment(date);
            this.disabledDates[ d.format('YYYY-MM-DD') ] = d;
        });
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

    get MinHour() {
        return this.minDate && this.minDate.hours;
    }

    set MinHour(minHour: number) {
        this.minDate.hours = minHour;
    }

    get MaxHour() {
        return this.maxDate && this.maxDate.hours;
    }

    set MaxHour(maxHour: number) {
        this.maxDate.hours = maxHour;
    }

    get MinMinutes() {
        return this.minDate && this.minDate.minutes;
    }

    set MinMinutes(minMinutes: number) {
        this.minDate.minutes = minMinutes;
    }

    get MaxMinutes() {
        return this.maxDate && this.maxDate.minutes;
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

    set Format(val: moment.MomentInput) {
        this.format = val
    }
}
