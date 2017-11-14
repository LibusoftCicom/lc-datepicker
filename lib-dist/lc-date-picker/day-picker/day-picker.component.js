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
var LCDayPickerComponent = /** @class */ (function () {
    function LCDayPickerComponent(cd) {
        this.cd = cd;
        this.panels = Panels;
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
        if (changes.newDate) {
            this.tempDate = moment(changes.newDate.currentValue.toISOString());
            this.formatMonthData();
            this.cd.detectChanges();
        }
    };
    LCDayPickerComponent.prototype.formatMonthData = function () {
        var currentDate = moment(this.tempDate.toISOString());
        var daysInPrevMonth = currentDate.startOf('month').weekday() % 7;
        var currentMonth = this.setActiveDate(this.createMonthArray());
        Array.from(Array(daysInPrevMonth).keys()).map(function (val, index) {
            currentMonth.unshift(null);
        });
        this.monthData = currentMonth.reduce(function (rows, key, index) { return (index % 7 === 0
            ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows; }, []);
        while (this.monthData[this.monthData.length - 1].length < 7) {
            this.monthData[this.monthData.length - 1].push(null);
        }
    };
    LCDayPickerComponent.prototype.createMonthArray = function () {
        var currentDate = moment(this.tempDate.toISOString());
        var daysinMonth = currentDate.daysInMonth();
        var monthObj = currentDate.startOf('month').toObject();
        return Array.from(Array(daysinMonth).keys()).map(function (val, index) {
            return __assign({}, monthObj, { date: monthObj.date + index });
        });
    };
    LCDayPickerComponent.prototype.setActiveDate = function (date) {
        var currentDate = this.newDate.toObject();
        if (currentDate.years !== date[0].years || currentDate.months !== date[0].months) {
            return date;
        }
        return date.map(function (item) {
            if (item.date === currentDate.date) {
                return __assign({}, item, { active: true });
            }
            return item;
        });
    };
    LCDayPickerComponent.prototype.nextMonth = function (event) {
        var nDate = moment(this.tempDate).add(1, 'months');
        if (nDate.year() > this.config.maxDate.year) {
            return;
        }
        this.tempDate = nDate;
        this.formatMonthData();
        this.cd.detectChanges();
    };
    LCDayPickerComponent.prototype.prevMonth = function (event) {
        var nDate = moment(this.tempDate).subtract(1, 'months');
        if (nDate.year() < this.config.minDate.year) {
            return;
        }
        this.tempDate = nDate;
        this.formatMonthData();
        this.cd.detectChanges();
    };
    LCDayPickerComponent.prototype.dayClick = function (event, item) {
        if (!item) {
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
    LCDayPickerComponent.decorators = [
        { type: core_1.Component, args: [{
                    moduleId: module.id,
                    selector: 'lc-day-picker',
                    template: "\n    <table class=\"dayPicker\" (wheel)=\"monthScroll($event)\">\n        <thead align=\"center\" [style.background]=\"config.PrimaryColor\">\n            <tr>\n                <th colspan=7>\n                    <div class=\"selectbtn\" >\n                        <button (click)=\"prevMonth($event)\"> <i class=\"fa fa-caret-left fa-lg\" aria-hidden=\"true\"></i> </button>\n                    </div>\n                    <div class=\"selectbtn\" (click)=\"resetDate($event)\">\n                        <i class=\"fa fa-home\" aria-hidden=\"true\"></i>\n                    </div>\n                    <div class=\"selectbtn monthlabel\" (click)=\"switchPannels($event, panels.Month)\">\n                        {{tempDate.format('MMMM')}}\n                    </div>\n                    <div class=\"selectbtn yearlabel\" (click)=\"switchPannels($event, panels.Year)\">\n                        {{tempDate.format('YYYY')}}\n                    </div>\n                    <div class=\"selectbtn pullRight\" >\n                        <button (click)=\"nextMonth($event)\"> <i class=\"fa fa-caret-right fa-lg\" aria-hidden=\"true\"></i> </button>\n                    </div>\n                </th>\n            </tr>\n        </thead>\n        <tbody align=\"center\" >\n            <tr class=\"days\">\n            <td *ngFor=\"let item of shortDayName\" class=\"dayName\" [style.color]=\"config.FontColor\"><span>{{item}}</span></td>\n            </tr>\n            <tr *ngFor=\"let row of monthData\">\n            <td *ngFor=\"let item of row\" (click)=\"dayClick($event, item)\" [ngClass]=\"{'active': item?.active}\">\n                <button *ngIf=\"item\" [style.color]=\"config.FontColor\">{{item?.date}}</button>\n            </td>\n            </tr>\n        </tbody>\n        </table>\n    ",
                    styles: [".calendar,button,table{-webkit-box-sizing:border-box;box-sizing:border-box}button{height:100%;background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;border:0;outline:0;width:29px}td{outline:1px solid transparent;width:32px}td:hover{background:#fff;cursor:default}td.dayName,td.dayName:hover{background:#fff;outline:0}.calendar,table{width:220px}.calendar{-webkit-box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;display:block;font-size:12px;line-height:14px;margin:5px}table{height:220px;border-collapse:collapse;border:0;text-transform:capitalize}.dateTimeToggle{width:220px;height:20px;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{height:25px}thead tr,thead tr button{color:#f0f8ff}tr.days{height:25px;border-bottom:1px solid #d8d8d8;background:#f0f8ff}tr.days td{border:0}td.active{background:rgba(94,102,111,.05)}td.active,td:hover{outline:1px solid #5e666f}.selectbtn{cursor:pointer;color:#e0e0e0;float:left;width:28px;text-align:center}.pullRight{float:right}.monthlabel{width:80px}.yearlabel{width:50px}.selectbtn:hover{color:#fbfbfb}.rotateUp{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.rotateDown{-webkit-transform:rotate(90deg);transform:rotate(90deg)}"],
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
    return LCDayPickerComponent;
}());
exports.LCDayPickerComponent = LCDayPickerComponent;
//# sourceMappingURL=day-picker.component.js.map