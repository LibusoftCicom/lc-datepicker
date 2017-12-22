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
var LCMonthPickerComponent = (function () {
    function LCMonthPickerComponent(cd) {
        this.cd = cd;
        this.shortMonthName = [];
        this.panels = Panels;
        this.selected = new core_1.EventEmitter();
        this.switchPannel = new core_1.EventEmitter();
        this.reset = new core_1.EventEmitter();
    }
    LCMonthPickerComponent.prototype.switchPannels = function (event, panel) {
        this.switchPannel.emit(panel);
    };
    LCMonthPickerComponent.prototype.ngOnInit = function () {
        var _this = this;
        var selectedDate = this.newDate.toObject();
        var currentDate = moment(moment.now()).toObject();
        var monthNames = this.newDate.locale(this.config.Localization).localeData().monthsShort();
        var months = monthNames.map(function (key, index) {
            var month = { key: key, index: index };
            if (month.index == selectedDate.months) {
                month = __assign({}, month, { active: true });
            }
            if (month.index == currentDate.months && selectedDate.years == currentDate.years) {
                month = __assign({}, month, { current: true });
            }
            if (month.index > _this.config.MaxMonth && selectedDate.years == _this.config.MaxYear ||
                month.index < _this.config.MinMonth && selectedDate.years == _this.config.MinYear) {
                month = __assign({}, month, { disabled: true });
            }
            return month;
        });
        this.shortMonthName = this.formatMonths(months);
    };
    LCMonthPickerComponent.prototype.ngOnChanges = function (changes) {
        if (changes.newDate) {
            this.ngOnInit();
            this.cd.detectChanges();
        }
    };
    LCMonthPickerComponent.prototype.formatMonths = function (months) {
        return months.reduce(function (rows, month, index) { return (index % 3 === 0
            ? rows.push([month])
            : rows[rows.length - 1].push(month)) && rows; }, []);
    };
    LCMonthPickerComponent.prototype.setMonth = function (event, item) {
        if (!item || item.disabled) {
            return;
        }
        this.newDate.month(item.key);
        this.selected.emit(this.newDate);
    };
    LCMonthPickerComponent.prototype.resetDate = function (event) {
        this.reset.emit();
    };
    return LCMonthPickerComponent;
}());
LCMonthPickerComponent.decorators = [
    { type: core_1.Component, args: [{
                moduleId: module.id,
                selector: 'lc-month-picker',
                template: "\n    <table class=\"monthsCal\">\n        <thead align=\"center\" [style.background]=\"config.PrimaryColor\">\n            <tr>\n                <th colspan=\"4\">\n                    <div class=\"selectbtn\"> &nbsp; </div>\n                    <div class=\"selectbtn\" (click)=\"resetDate($event)\"> <i class=\"fa fa-home\" aria-hidden=\"true\"></i> </div>\n                    <div class=\"selectbtn monthlabel\"> &nbsp; </div>\n                    <div class=\"selectbtn yearlabel\" (click)=\"switchPannels($event, panels.Year)\"> {{newDate.year()}}</div>\n                </th>\n            </tr>\n        </thead>\n        <tbody align=\"center\">\n            <tr *ngFor=\"let row of shortMonthName\">\n            <td *ngFor=\"let item of row\" [ngClass]=\"{'active': item?.active, 'current': item?.current, 'disabled': item?.disabled }\">\n                <button (click)=\"setMonth($event, item)\" [style.color]=\"config.FontColor\">{{item.key}}</button>\n            </td>\n            </tr>\n        </tbody>\n    </table>\n",
                styles: [".calendar,button,table{-webkit-box-sizing:border-box;box-sizing:border-box}button{height:100%;background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;border:0;outline:0;text-transform:capitalize;width:29px}.monthsCal td{min-width:30px;padding:5px 0}td:hover{background:#efefef}.calendar,table{width:220px}.calendar{-webkit-box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;display:block;font-size:12px;line-height:14px;margin:5px}table{height:220px;border-collapse:collapse;border:0;display:table}.dateTimeToggle{width:220px;height:20px;background:#e4e4e4;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#efefef}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{color:#f0f8ff}thead tr,tr.days{height:25px}tr.days td{border:0}td.active{outline:1px solid #5e666f}td.disabled{background:rgba(234,234,234,.05)}td.current{background:rgba(94,102,111,.05)}td.disabled button{color:#bbc9d8!important}.selectbtn{cursor:pointer;color:#e0e0e0;float:left;width:30px}.pullRight{float:right}.monthlabel{width:80px}.yearlabel{width:50px}"],
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
LCMonthPickerComponent.ctorParameters = function () { return [
    { type: core_1.ChangeDetectorRef, },
]; };
LCMonthPickerComponent.propDecorators = {
    'newDate': [{ type: core_1.Input },],
    'config': [{ type: core_1.Input },],
    'selected': [{ type: core_1.Output },],
    'switchPannel': [{ type: core_1.Output },],
    'reset': [{ type: core_1.Output },],
};
exports.LCMonthPickerComponent = LCMonthPickerComponent;
//# sourceMappingURL=month-picker.component.js.map