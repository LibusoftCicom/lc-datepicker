"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ECalendarType;
(function (ECalendarType) {
    ECalendarType[ECalendarType["Time"] = 0] = "Time";
    ECalendarType[ECalendarType["DateTime"] = 1] = "DateTime";
    ECalendarType[ECalendarType["Date"] = 2] = "Date";
    ECalendarType[ECalendarType["MonthYear"] = 3] = "MonthYear";
    ECalendarType[ECalendarType["Year"] = 4] = "Year";
})(ECalendarType = exports.ECalendarType || (exports.ECalendarType = {}));
var DatePickerConfig = /** @class */ (function () {
    function DatePickerConfig() {
        this.theme = {
            primaryColor: 'black',
            fontColor: 'black'
        };
    }
    Object.defineProperty(DatePickerConfig.prototype, "CalendarType", {
        get: function () {
            return this.calendarType;
        },
        set: function (type) {
            this.calendarType = type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "Localization", {
        get: function () {
            return this.localization;
        },
        set: function (localization) {
            this.localization = localization;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MinDate", {
        get: function () {
            return this.minDate;
        },
        set: function (date) {
            this.minDate = date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MaxDate", {
        get: function () {
            return this.maxDate;
        },
        set: function (date) {
            this.maxDate = date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MinYear", {
        get: function () {
            return this.minDate.years;
        },
        set: function (minYear) {
            this.minDate.years = minYear;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MaxYear", {
        get: function () {
            return this.maxDate.years;
        },
        set: function (minYear) {
            this.maxDate.years = minYear;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MinMonth", {
        get: function () {
            return this.minDate.months;
        },
        set: function (minMonth) {
            this.minDate.months = minMonth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MaxMonth", {
        get: function () {
            return this.maxDate.months;
        },
        set: function (minMonth) {
            this.maxDate.months = minMonth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MinDay", {
        get: function () {
            return this.minDate.date;
        },
        set: function (minDay) {
            this.minDate.date = minDay;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MaxDay", {
        get: function () {
            return this.maxDate.date;
        },
        set: function (maxDay) {
            this.maxDate.date = maxDay;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MinHour", {
        get: function () {
            return this.minDate.hours;
        },
        set: function (minHour) {
            this.minDate.hours = minHour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MaxHour", {
        get: function () {
            return this.maxDate.hours;
        },
        set: function (maxHour) {
            this.maxDate.hours = maxHour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MinMinutes", {
        get: function () {
            return this.minDate.minutes;
        },
        set: function (minMinutes) {
            this.minDate.minutes = minMinutes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "MaxMinutes", {
        get: function () {
            return this.maxDate.minutes;
        },
        set: function (maxMinutes) {
            this.maxDate.minutes = maxMinutes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "Labels", {
        get: function () {
            return this.labels;
        },
        set: function (label) {
            this.labels = label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "ConfirmLabel", {
        get: function () {
            return this.labels.confirmLabel;
        },
        set: function (confirmLabel) {
            this.labels.confirmLabel = confirmLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "ColorTheme", {
        get: function () {
            return this.theme;
        },
        set: function (theme) {
            this.theme = theme;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "PrimaryColor", {
        get: function () {
            return this.theme.primaryColor;
        },
        set: function (primaryColor) {
            this.theme.primaryColor = primaryColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "FontColor", {
        get: function () {
            return this.theme.fontColor;
        },
        set: function (fontColor) {
            this.theme.fontColor = fontColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DatePickerConfig.prototype, "Format", {
        get: function () {
            return this.format;
        },
        set: function (val) {
            this.format = val;
        },
        enumerable: true,
        configurable: true
    });
    return DatePickerConfig;
}());
exports.DatePickerConfig = DatePickerConfig;
//# sourceMappingURL=lc-date-picker-config-helper.js.map