"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var moment = require("moment");
var LCYearPickerComponent = (function () {
    function LCYearPickerComponent(cd) {
        this.cd = cd;
        this.yearsArray = [];
        this.selected = new core_1.EventEmitter();
        this.reset = new core_1.EventEmitter();
    }
    LCYearPickerComponent.prototype.ngOnInit = function () {
        this.tempDate = moment(this.newDate.toISOString()).year();
        this.initYear = moment(this.newDate.toISOString()).year();
        this.checkInitYear();
        this.formatYears();
    };
    LCYearPickerComponent.prototype.ngOnChanges = function (changes) {
        if (changes.newDate) {
            this.ngOnInit();
            this.cd.detectChanges();
        }
    };
    LCYearPickerComponent.prototype.checkInitYear = function () {
        var year = this.tempDate;
        if (this.config.minDate.years) {
            year = Math.max(year, this.config.minDate.years);
        }
        if (this.config.maxDate.years) {
            year = Math.min(year, this.config.maxDate.years);
        }
        this.tempDate = this.initYear = year;
    };
    LCYearPickerComponent.prototype.formatYears = function () {
        var _this = this;
        var currentYear = this.tempDate;
        for (var i = 0; i <= 12; i++) {
            this.yearsArray[12 - i] = +currentYear - i;
            this.yearsArray[12 + i] = +currentYear + i;
        }
        this.yearsArray = this.yearsArray.filter(function (year) { return year >= _this.config.minDate.years && year <= _this.config.maxDate.years; });
        while (this.yearsArray.length < 25) {
            if (this.yearsArray[0] === this.config.minDate.years) {
                this.yearsArray.push(this.yearsArray[this.yearsArray.length - 1] + 1);
            }
            else {
                this.yearsArray.unshift(this.yearsArray[0] - 1);
            }
        }
        this.yearsArrayFormated = this.yearsArray.reduce(function (rows, key, index) { return (index % 5 === 0
            ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows; }, []);
    };
    LCYearPickerComponent.prototype.prevYears = function () {
        if (this.yearsArray[0] - 1 < this.config.minDate.years) {
            return;
        }
        this.tempDate -= 25;
        this.formatYears();
        this.cd.detectChanges();
    };
    LCYearPickerComponent.prototype.nextYears = function () {
        if (this.yearsArray[this.yearsArray.length - 1] + 1 >= this.config.maxDate.years) {
            return;
        }
        this.tempDate += 25;
        this.formatYears();
        this.cd.detectChanges();
    };
    LCYearPickerComponent.prototype.setYear = function (event, item) {
        if (!item) {
            return;
        }
        this.newDate.year(item);
        this.initYear = item;
        this.selected.emit(this.newDate);
    };
    LCYearPickerComponent.prototype.yearScroll = function (event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.nextYears();
        }
        if (event.deltaY > 0) {
            this.prevYears();
        }
    };
    LCYearPickerComponent.prototype.preventDefault = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    };
    LCYearPickerComponent.prototype.stopPropagation = function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
    };
    LCYearPickerComponent.prototype.resetDate = function (event) {
        this.reset.emit();
    };
    return LCYearPickerComponent;
}());
LCYearPickerComponent.decorators = [
    { type: core_1.Component, args: [{
                moduleId: module.id,
                selector: 'lc-year-picker',
                template: "\n    <table class=\"yearsCal\" (wheel)=\"yearScroll($event)\">\n    <thead align=\"center\"  [style.background]=\"config.PrimaryColor\">\n        <tr>\n            <th colspan=\"5\">\n                <div class=\"selectbtn\" >\n                    <button (click)=\"prevYears()\"> <i class=\"fa fa-caret-left fa-lg\" aria-hidden=\"true\"></i> </button>\n                </div>\n                <div class=\"selectbtn\" (click)=\"resetDate($event)\"> <i class=\"fa fa-home\" aria-hidden=\"true\"></i> </div>\n                <div class=\"selectbtn pullRight\" >\n                    <button (click)=\"nextYears()\"> <i class=\"fa fa-caret-right fa-lg\" aria-hidden=\"true\"></i> </button>\n                </div>\n            </th>\n        </tr>\n    </thead>\n    <tbody align=\"center\">\n        <tr *ngFor=\"let row of yearsArrayFormated\">\n        <td *ngFor=\"let item of row\" (click)=\"setYear($event, item)\" [ngClass]=\"{'active': item === initYear}\">\n            <button [style.color]=\"config.FontColor\">{{item}}</button>\n        </td>\n        </tr>\n    </tbody>\n    </table>\n",
                styles: [".calendar,button,table{-webkit-box-sizing:border-box;box-sizing:border-box}button{height:100%;background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;border:0;outline:0;padding:0;width:32px}.yearsCal td{min-width:30px;padding:5px 0;outline:1px solid transparent}.calendar,table{width:220px}.calendar{-webkit-box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;display:block;font-size:12px;line-height:14px;margin:5px}table{height:220px;border-collapse:collapse;border:0}.dateTimeToggle{width:220px;height:20px;background:#e4e4e4;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#efefef}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{height:25px}thead tr,thead tr button{color:#f0f8ff}td.active{background:#e6e8ea}.selectbtn{cursor:pointer;color:#e0e0e0;float:left;width:30px}.pullRight{float:right}.monthlabel{width:80px}.yearlabel{width:50px}.yearsCal td.active,.yearsCal td:hover{outline:1px solid #5e666f}.yearsCal td.active{background:rgba(94,102,111,.05)}"],
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
LCYearPickerComponent.ctorParameters = function () { return [
    { type: core_1.ChangeDetectorRef, },
]; };
LCYearPickerComponent.propDecorators = {
    'newDate': [{ type: core_1.Input },],
    'config': [{ type: core_1.Input },],
    'selected': [{ type: core_1.Output },],
    'reset': [{ type: core_1.Output },],
};
exports.LCYearPickerComponent = LCYearPickerComponent;
//# sourceMappingURL=year-picker.component.js.map