"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// import { LcKeyShortcut } from 'lcfmw/services/shortcuts/LcKeyShortcuts';
var lc_date_picker_config_helper_1 = require("./lc-date-picker-config-helper");
var moment = require("moment");
var panels;
(function (panels) {
    panels[panels["Time"] = 0] = "Time";
    panels[panels["Day"] = 1] = "Day";
    panels[panels["Month"] = 2] = "Month";
    panels[panels["Year"] = 3] = "Year";
})(panels = exports.panels || (exports.panels = {}));
var LCDatePickerComponent = (function () {
    function LCDatePickerComponent(cd, _elementRef) {
        this.cd = cd;
        this._elementRef = _elementRef;
        this.openedChange = new core_1.EventEmitter();
        this.dateChange = new core_1.EventEmitter();
        this.panels = panels;
    }
    LCDatePickerComponent.prototype.ngOnInit = function () {
        this.initCalendar();
    };
    LCDatePickerComponent.prototype.initCalendar = function () {
        var format = this.config.Format || '';
        this.locale = this.config.Localization || 'hr';
        moment.locale(this.locale);
        this.originalDate = !this.date || !moment(this.date, format).isValid() ? moment().locale(this.locale) : moment(this.date, format).locale(this.locale);
        this.newDate = !this.date || !moment(this.date, format).isValid() ? moment().locale(this.locale) : moment(this.date, format).locale(this.locale);
        this.setPanel(this.config.CalendarType);
    };
    LCDatePickerComponent.prototype.ngOnChanges = function (changes) {
        if (changes.date) {
            this.cd.markForCheck();
        }
        if (changes.opened && changes.opened.currentValue === true) {
            var windowHeight = window.innerHeight;
            var componentPosition = this._elementRef.nativeElement.parentNode.getBoundingClientRect();
            if (windowHeight - componentPosition.top > this.calendarSize(this.config.CalendarType)) {
                this.componentMargin = 0;
            }
            else {
                this.componentMargin = this.calendarSize(this.config.CalendarType) * -1 + 'px';
            }
            this.initCalendar();
            this.cd.markForCheck();
        }
    };
    LCDatePickerComponent.prototype.setPanel = function (panel) {
        switch (panel) {
            case lc_date_picker_config_helper_1.ECalendarType.DateTime: {
                this.activePanel = panels.Day;
                break;
            }
            case lc_date_picker_config_helper_1.ECalendarType.Date: {
                this.activePanel = panels.Day;
                break;
            }
            case lc_date_picker_config_helper_1.ECalendarType.MonthYear: {
                this.activePanel = panels.Month;
                break;
            }
            case lc_date_picker_config_helper_1.ECalendarType.Year: {
                this.activePanel = panels.Year;
                break;
            }
            case lc_date_picker_config_helper_1.ECalendarType.Time: {
                this.activePanel = panels.Time;
                break;
            }
        }
        this.cd.detectChanges();
    };
    LCDatePickerComponent.prototype.onTimeSelected = function (date) {
        this.newDate = date;
        // if(this.config.type !== 1){
        //     this.dateChange.emit(this.newDate.toISOString());
        // }
        if (this.config.CalendarType === lc_date_picker_config_helper_1.ECalendarType.Time) {
            this.cd.markForCheck();
        }
    };
    LCDatePickerComponent.prototype.onDaySelected = function (date) {
        this.newDate = date;
        if (this.config.CalendarType > 1) {
            this.dateChange.emit(this.newDate.toISOString());
        }
        if (this.config.CalendarType === lc_date_picker_config_helper_1.ECalendarType.Date) {
            this.confirm();
        }
    };
    LCDatePickerComponent.prototype.onMonthSelected = function (date) {
        this.newDate.month(date.month());
        if (this.config.CalendarType > 1 && this.config.CalendarType === lc_date_picker_config_helper_1.ECalendarType.MonthYear) {
            this.dateChange.emit(this.newDate.toISOString());
        }
        if (this.config.CalendarType !== lc_date_picker_config_helper_1.ECalendarType.MonthYear) {
            this.onSwitchPannel(panels.Day);
            this.cd.markForCheck();
        }
        else {
            this.confirm();
        }
    };
    LCDatePickerComponent.prototype.onYearSelected = function (date) {
        this.newDate = moment(moment.now()).year(date.year());
        if (this.config.CalendarType > 1 && this.config.CalendarType === lc_date_picker_config_helper_1.ECalendarType.Year) {
            this.dateChange.emit(this.newDate.toISOString());
        }
        if (this.config.CalendarType !== lc_date_picker_config_helper_1.ECalendarType.Year) {
            this.onSwitchPannel(panels.Month);
            this.cd.markForCheck();
        }
        else {
            this.confirm();
        }
    };
    LCDatePickerComponent.prototype.onSwitchPannel = function (panel) {
        this.activePanel = panel;
        this.cd.detectChanges();
    };
    LCDatePickerComponent.prototype.onResetDate = function () {
        this.newDate = this.isDateAvailable(moment(moment.now()));
        // this.dateChange.emit(moment(moment.now()).toISOString());
        if (this.config.CalendarType > 1) {
            this.confirm();
        }
        this.cd.markForCheck();
    };
    LCDatePickerComponent.prototype.isDateAvailable = function (date) {
        if (this.config.MinDate && this.config.MaxDate) {
            var minDate = moment(this.config.MinDate);
            var maxDate = moment(this.config.MaxDate);
            if (minDate.isSame(maxDate)) {
                return null;
            }
        }
        if (this.config.DisabledDates[date.format('YYYY-MM-DD')]) {
            return this.isDateAvailable(date.add(1, 'day'));
        }
        if (this.config.MinDate) {
            var minDate = moment(this.config.MinDate);
            if (date.isBefore(minDate)) {
                return this.isDateAvailable(date.add(1, 'day'));
            }
        }
        if (this.config.MaxDate) {
            var maxDate = moment(this.config.MaxDate);
            if (date.isAfter(maxDate)) {
                return this.isDateAvailable(date.subtract(1, 'day'));
            }
        }
        return date;
    };
    LCDatePickerComponent.prototype.confirm = function () {
        this.openedChange.emit(false);
        this.dateChange.emit(this.config.Format ? moment(this.newDate.toISOString()).format(this.config.Format) : this.newDate.toISOString());
        this.opened = false;
    };
    LCDatePickerComponent.prototype.close = function () {
        this.openedChange.emit(false);
        this.opened = false;
    };
    LCDatePickerComponent.prototype.calendarSize = function (type) {
        var height = 5;
        if (this.config.CalendarType <= 1) {
            height += 20;
        }
        switch (type) {
            case lc_date_picker_config_helper_1.ECalendarType.DateTime: {
                height += 280;
                break;
            }
            case lc_date_picker_config_helper_1.ECalendarType.Date:
            case lc_date_picker_config_helper_1.ECalendarType.MonthYear:
            case lc_date_picker_config_helper_1.ECalendarType.Year: {
                height += 240;
                break;
            }
            case lc_date_picker_config_helper_1.ECalendarType.Time: {
                height += 140;
                break;
            }
        }
        return height;
    };
    return LCDatePickerComponent;
}());
LCDatePickerComponent.decorators = [
    { type: core_1.Component, args: [{
                moduleId: module.id,
                selector: 'lc-datepicker',
                template: "\n    <div [ngSwitch]=\"activePanel\" class=\"calendar\" *ngIf=\"opened\">\n        <lc-year-picker\n            *ngSwitchCase=\"3\"\n            [newDate]=\"newDate\"\n            (selected)=\"onYearSelected($event)\"\n            (reset)=\"onResetDate($event)\"\n            [config]=\"config\"></lc-year-picker>\n\n        <lc-month-picker\n            *ngSwitchCase=\"2\"\n            [newDate]=\"newDate\"\n            (selected)=\"onMonthSelected($event)\"\n            (reset)=\"onResetDate($event)\"\n            [config]=\"config\"\n            (switchPannel)=\"onSwitchPannel($event)\"></lc-month-picker>\n\n        <lc-day-picker\n            *ngSwitchCase=\"1\"\n            [newDate]=\"newDate\"\n            (selected)=\"onDaySelected($event)\"\n            (reset)=\"onResetDate($event)\"\n            [config]=\"config\"\n            (switchPannel)=\"onSwitchPannel($event)\"></lc-day-picker>\n\n        <lc-time-picker\n            *ngSwitchCase=\"0\"\n            [config]=\"config\"\n            (selected)=\"onTimeSelected($event)\"\n            (reset)=\"onResetDate($event)\"\n            [newDate]=\"newDate\" ></lc-time-picker>\n\n        <div class=\"dateTimeToggle\" *ngIf=\"config.CalendarType === 1\">\n            <lc-time-picker-compact\n            [config]=\"config\"\n            (selected)=\"onTimeSelected($event)\"\n            [newDate]=\"newDate\" ></lc-time-picker-compact>\n        </div>\n\n        <div class=\"confirmDate\"  *ngIf=\"config.CalendarType <= 1\" [style.background]=\"config.PrimaryColor\">\n            <button (click)=\"confirm()\" >{{config.ConfirmLabel}}</button>\n        </div>\n\n    </div>\n    <div class=\"calendarBackground\" *ngIf=\"opened\" (click)=\"close()\"></div>\n    ",
                styles: [":host{position:absolute;color:#000;background:0 0;font-family:open_sans-n4,open_sans,Helvetica,Arial,sans-serif;font-size:12px;z-index:101;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host.displayDown{top:20px}:host.displayUp{bottom:20px}.calendar,button,table{-webkit-box-sizing:border-box;box-sizing:border-box}button{height:100%;background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;border:0;outline:0;width:100%}.monthCal td,.monthsCal td,.yearsCal td{min-width:30px;padding:5px 0;border:1px solid #e4e4e4}td:hover{background:#efefef}.calendar,table{width:220px}.calendar{-webkit-box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;display:block;font-size:12px;line-height:14px;margin:5px}table{height:calc(100% - 36px);border-collapse:collapse;border:0;display:table}.dateTimeToggle{width:220px;height:41px;background:#e4e4e4;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#5e666f}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef;color:#fff}thead tr{height:25px;background:#efefef}tr.days{height:25px;width:32px}tr.days td{border:0}td.active{background:#e6e8ea}.selectbtn{cursor:pointer}.rotateUp{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.rotateDown{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.calendarBackground{position:fixed;height:100%;width:100%;background:0 0;z-index:-10;top:0;bottom:0;left:0;right:0}:host>>>.fa-lg{font-size:1.5em;line-height:0}"],
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
LCDatePickerComponent.ctorParameters = function () { return [
    { type: core_1.ChangeDetectorRef, },
    { type: core_1.ElementRef, },
]; };
LCDatePickerComponent.propDecorators = {
    'componentMargin': [{ type: core_1.HostBinding, args: ['style.margin-top',] },],
    'opened': [{ type: core_1.Input },],
    'openedChange': [{ type: core_1.Output },],
    'config': [{ type: core_1.Input },],
    'date': [{ type: core_1.Input },],
    'dateChange': [{ type: core_1.Output },],
};
exports.LCDatePickerComponent = LCDatePickerComponent;
//# sourceMappingURL=lc-date-picker.component.js.map