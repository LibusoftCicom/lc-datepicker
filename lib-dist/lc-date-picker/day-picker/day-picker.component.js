"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment");
var Panels;
(function (Panels) {
    Panels[Panels["Time"] = 0] = "Time";
    Panels[Panels["Day"] = 1] = "Day";
    Panels[Panels["Month"] = 2] = "Month";
    Panels[Panels["Year"] = 3] = "Year";
})(Panels = exports.Panels || (exports.Panels = {}));
var LCDayPickerComponent = (function () {
    function LCDayPickerComponent(cd) {
        this.cd = cd;
        this.panels = Panels;
        this.currentDate = moment(moment.now()).startOf('day');
        this.minDate = null;
        this.maxDate = null;
        this.selected = new core_1.EventEmitter();
        this.switchPannel = new core_1.EventEmitter();
        this.reset = new core_1.EventEmitter();
    }
    LCDayPickerComponent.prototype.ngOnInit = function () {
        this.shortDayName = moment.weekdaysShort(true);
        this.tempDate = moment(this.newDate.toISOString());
        this.formatMonthData();
        this.cd.detectChanges();
    };
    LCDayPickerComponent.prototype.ngOnChanges = function (changes) {
        // ignore initial detection
        if (changes.newDate && !changes.newDate.firstChange) {
            this.tempDate = moment(changes.newDate.currentValue.toISOString());
            this.formatMonthData();
            this.cd.detectChanges();
        }
    };
    LCDayPickerComponent.prototype.formatMonthData = function () {
        var currentDate = moment(this.tempDate.toISOString());
        var daysInPrevMonth = currentDate.startOf('month').weekday() % 7;
        this.prepareMaxMinDates();
        var currentMonth = this.createMonthArray();
        Array.from(Array(daysInPrevMonth).keys()).map(function (val, index) {
            currentMonth.unshift(null);
        });
        this.monthData = currentMonth.reduce(function (rows, key, index) { return (index % 7 === 0
            ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows; }, []);
        // if final week is shorter than should be
        while (this.monthData[this.monthData.length - 1].length < 7) {
            this.monthData[this.monthData.length - 1].push(null);
        }
    };
    LCDayPickerComponent.prototype.createMonthArray = function () {
        var _this = this;
        var selectedDate = this.newDate.toObject();
        // day used to create calendar
        var date = moment(this.tempDate.toISOString());
        var daysinMonth = date.daysInMonth();
        var monthObj = date.startOf('month').toObject();
        // create date objects
        return Array.from(Array(daysinMonth).keys()).map(function (val, index) {
            var date = __assign({}, monthObj, { date: monthObj.date + index });
            if (date.date === selectedDate.date) {
                date = __assign({}, date, { active: true });
            }
            // mark current date
            if (_this.isCurrentDate(date)) {
                date = __assign({}, date, { current: true });
            }
            // if date isn't in allowed range
            if (_this.isDateDisabled(date)) {
                date = __assign({}, date, { disabled: true });
            }
            return date;
        });
    };
    LCDayPickerComponent.prototype.isCurrentDate = function (date) {
        return moment(date).isSame(this.currentDate);
    };
    LCDayPickerComponent.prototype.isDateDisabled = function (date) {
        var momentDate = moment(date);
        var disabled = this.config.DisabledDates[momentDate.format('YYYY-MM-DD')];
        if (disabled != null) {
            return disabled.isSame(momentDate);
        }
        var maxDate = this.maxDate;
        if (maxDate && maxDate.isValid() && maxDate.isBefore(momentDate)) {
            return true;
        }
        var minDate = this.minDate;
        if (minDate && minDate.isValid() && minDate.isAfter(momentDate)) {
            return true;
        }
        return false;
    };
    LCDayPickerComponent.prototype.prepareMaxMinDates = function () {
        var minDate = this.minDate = this.config.MinDate ? moment(this.config.MinDate) : null;
        var maxDate = this.maxDate = this.config.MaxDate ? moment(this.config.MaxDate) : null;
        if (maxDate) {
            /**
             * if year is known and month isn't set maxDate to the end of year
             */
            if (this.config.MaxYear != null && this.config.MaxMonth == null) {
                maxDate = maxDate.endOf('year');
            }
            /**
             * if month is known and date isn't, set maxDate to the end of month
             */
            if (this.config.MaxMonth != null && this.config.MaxDay == null) {
                maxDate = maxDate.endOf('month');
            }
        }
        if (minDate) {
            /**
             * if year is known and month isn't set minDate to first day of the year
             */
            if (this.config.MinYear != null && this.config.MinMonth == null) {
                minDate = minDate.startOf('year');
            }
            /**
             * if month is known and date isn't set minDate to first day of the month
             */
            if (this.config.MinMonth != null && this.config.MinDay == null) {
                minDate = minDate.startOf('month');
            }
        }
    };
    LCDayPickerComponent.prototype.nextMonth = function (event) {
        var nDate = moment(this.tempDate).add(1, 'months');
        this.tempDate = nDate;
        this.formatMonthData();
        this.cd.detectChanges();
    };
    LCDayPickerComponent.prototype.prevMonth = function (event) {
        var nDate = moment(this.tempDate).subtract(1, 'months');
        this.tempDate = nDate;
        this.formatMonthData();
        this.cd.detectChanges();
    };
    LCDayPickerComponent.prototype.dayClick = function (event, item) {
        if (!item || item.disabled) {
            return;
        }
        var date = moment(this.newDate.toISOString());
        date.date(item.date);
        date.month(item.months);
        date.year(item.years);
        this.newDate = date;
        this.tempDate = date;
        this.selected.emit(date);
        this.formatMonthData();
        this.cd.markForCheck();
    };
    LCDayPickerComponent.prototype.monthScroll = function (event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.nextMonth();
        }
        if (event.deltaY > 0) {
            this.prevMonth();
        }
    };
    LCDayPickerComponent.prototype.switchPannels = function (event, panel) {
        this.switchPannel.emit(panel);
    };
    LCDayPickerComponent.prototype.preventDefault = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    };
    LCDayPickerComponent.prototype.stopPropagation = function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
    };
    LCDayPickerComponent.prototype.resetDate = function (event) {
        this.reset.emit();
    };
    return LCDayPickerComponent;
}());
LCDayPickerComponent.decorators = [
    { type: core_1.Component, args: [{
                moduleId: module.id,
                selector: 'lc-day-picker',
                template: "\n    <table class=\"dayPicker\" (wheel)=\"monthScroll($event)\">\n        <thead align=\"center\" [style.background]=\"config.PrimaryColor\">\n            <tr>\n                <th colspan=7>\n                    <div class=\"selectbtn\" >\n                        <button (click)=\"prevMonth($event)\"> <i class=\"fa fa-caret-left fa-lg\" aria-hidden=\"true\"></i> </button>\n                    </div>\n                    <div class=\"selectbtn\" (click)=\"resetDate($event)\">\n                        <i class=\"fa fa-home\" aria-hidden=\"true\"></i>\n                    </div>\n                    <div class=\"selectbtn monthlabel\" (click)=\"switchPannels($event, panels.Month)\">\n                        {{tempDate.format('MMMM')}}\n                    </div>\n                    <div class=\"selectbtn yearlabel\" (click)=\"switchPannels($event, panels.Year)\">\n                        {{tempDate.format('YYYY')}}\n                    </div>\n                    <div class=\"selectbtn pullRight\" >\n                        <button (click)=\"nextMonth($event)\"> <i class=\"fa fa-caret-right fa-lg\" aria-hidden=\"true\"></i> </button>\n                    </div>\n                </th>\n            </tr>\n        </thead>\n        <tbody align=\"center\" >\n            <tr class=\"days\">\n            <td *ngFor=\"let item of shortDayName\" class=\"dayName\" [style.color]=\"config.FontColor\"><span>{{item}}</span></td>\n            </tr>\n            <tr *ngFor=\"let row of monthData\">\n            <td *ngFor=\"let item of row\" (click)=\"dayClick($event, item)\" [ngClass]=\"{'active': item?.active, 'disabled': item?.disabled, 'current': item?.current}\">\n                <button *ngIf=\"item\" [style.color]=\"config.FontColor\">{{item?.date}}</button>\n            </td>\n            </tr>\n        </tbody>\n        </table>\n    ",
                styles: [".calendar,button,table{-webkit-box-sizing:border-box;box-sizing:border-box}button{height:100%;background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;border:0;outline:0;width:29px}td{outline:1px solid transparent;width:32px}td:hover{background:#fff;cursor:default}td.dayName,td.dayName:hover{background:#fff;outline:0}.calendar,table{width:220px}.calendar{-webkit-box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;display:block;font-size:12px;line-height:14px;margin:5px}table{height:220px;border-collapse:collapse;border:0;text-transform:capitalize}.dateTimeToggle{width:220px;height:20px;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{height:25px}thead tr,thead tr button{color:#f0f8ff}tr.days{height:25px;border-bottom:1px solid #d8d8d8;background:#f0f8ff}tr.days td{border:0}td.active{outline:1px solid #5e666f}td.disabled{background:rgba(234,234,234,.05)}td.current{background:rgba(94,102,111,.05)}td.disabled button{color:#bbc9d8!important;cursor:default}td:not(.disabled):hover{outline:1px solid #5e666f}.selectbtn{cursor:pointer;color:#e0e0e0;float:left;width:28px;text-align:center}.pullRight{float:right}.monthlabel{width:80px}.yearlabel{width:50px}.selectbtn:hover{color:#fbfbfb}.rotateUp{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.rotateDown{-webkit-transform:rotate(90deg);transform:rotate(90deg)}"],
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
LCDayPickerComponent.ctorParameters = function () { return [
    { type: core_1.ChangeDetectorRef, },
]; };
LCDayPickerComponent.propDecorators = {
    'newDate': [{ type: core_1.Input },],
    'config': [{ type: core_1.Input },],
    'selected': [{ type: core_1.Output },],
    'switchPannel': [{ type: core_1.Output },],
    'reset': [{ type: core_1.Output },],
};
exports.LCDayPickerComponent = LCDayPickerComponent;
//# sourceMappingURL=day-picker.component.js.map