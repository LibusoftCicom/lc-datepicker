"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var LCTimePickerComponent = (function () {
    function LCTimePickerComponent(cd) {
        this.cd = cd;
        this.selected = new core_1.EventEmitter();
        this.reset = new core_1.EventEmitter();
    }
    LCTimePickerComponent.prototype.ngOnInit = function () {
        this.setTimeFormat();
        this.cd.detectChanges();
    };
    LCTimePickerComponent.prototype.ngOnChanges = function (changes) {
        if (changes.newDate) {
            this.cd.detectChanges();
        }
    };
    LCTimePickerComponent.prototype.setTimeFormat = function () {
        this.is24HourFormat = this.newDate.format('LT').indexOf('M') === -1;
    };
    LCTimePickerComponent.prototype.addHour = function () {
        var hour = this.newDate.hour();
        this.newDate.hour(++hour % 24);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerComponent.prototype.subtractHour = function () {
        var hour = this.newDate.hour();
        this.newDate.hour((--hour + 24) % 24);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerComponent.prototype.addMinute = function () {
        var minute = this.newDate.minutes();
        this.newDate.minute(++minute % 60);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerComponent.prototype.subtractMinute = function () {
        var minute = this.newDate.minute();
        this.newDate.minute((--minute + 60) % 60);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerComponent.prototype.hourScroll = function (event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.addHour();
        }
        if (event.deltaY > 0) {
            this.subtractHour();
        }
    };
    LCTimePickerComponent.prototype.minuteScroll = function (event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.addMinute();
        }
        if (event.deltaY > 0) {
            this.subtractMinute();
        }
    };
    LCTimePickerComponent.prototype.toggleMeridiem = function (event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        this.newDate.hour((this.newDate.hour() + 12) % 24);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerComponent.prototype.preventDefault = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    };
    LCTimePickerComponent.prototype.stopPropagation = function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
    };
    LCTimePickerComponent.prototype.resetDate = function (event) {
        this.reset.emit();
    };
    return LCTimePickerComponent;
}());
LCTimePickerComponent.decorators = [
    { type: core_1.Component, args: [{
                moduleId: module.id,
                selector: 'lc-time-picker',
                template: "\n    <table>\n        <thead align=\"center\"  [style.background]=\"config.PrimaryColor\">\n            <tr>\n            <th [attr.colspan]=\"is24HourFormat ? 5 : 6\">\n                <div class=\"resetBtn\"> &nbsp; </div>\n                <div class=\"resetBtn\" (click)=\"resetDate($event)\"> <i class=\"fa fa-home\" aria-hidden=\"true\"></i> </div>\n            </th></tr>\n        </thead>\n        <tbody align=\"center\" [style.color]=\"config.FontColor\">\n            <tr>\n            <td rowspan=\"3\"></td>\n            <td class=\"selectbtn\" (click)=\"addHour()\" (wheel)=\"hourScroll($event)\" >\n                <i class=\"fa fa-caret-up\" aria-hidden=\"true\" [style.color]=\"config.FontColor\"></i>\n            </td>\n            <td rowspan=\"3\" class=\"divider\">:</td>\n            <td class=\"selectbtn\" (click)=\"addMinute()\" (wheel)=\"minuteScroll($event)\" [style.color]=\"config.FontColor\">\n                <i class=\"fa fa-caret-up\" aria-hidden=\"true\"></i>\n            </td>\n            <td class=\"selectbtn\" (click)=\"toggleMeridiem()\" (wheel)=\"toggleMeridiem($event)\" *ngIf=\"!is24HourFormat\" [style.color]=\"config.FontColor\">\n                <i class=\"fa fa-caret-up\" aria-hidden=\"true\"></i>\n            </td>\n            <td rowspan=\"3\"></td>\n            </tr>\n            <tr>\n            <td class=\"timeDigit\" (wheel)=\"hourScroll($event)\">{{is24HourFormat ? newDate.format('HH') : newDate.format('hh')}}</td>\n            <td class=\"timeDigit\" (wheel)=\"minuteScroll($event)\">{{newDate.format('mm')}}</td>\n            <td class=\"timeDigit\" (wheel)=\"toggleMeridiem($event)\" *ngIf=\"!is24HourFormat\">{{newDate.format('A')}}</td>\n            </tr>\n            <tr>\n            <td class=\"selectbtn\" (click)=\"subtractHour()\" (wheel)=\"hourScroll($event)\" [style.color]=\"config.FontColor\">\n                <i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>\n            </td>\n            <td class=\"selectbtn\" (click)=\"subtractMinute()\" (wheel)=\"minuteScroll($event)\" [style.color]=\"config.FontColor\">\n                <i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>\n            </td>\n            <td class=\"selectbtn\" (click)=\"toggleMeridiem()\" (wheel)=\"toggleMeridiem($event)\" *ngIf=\"!is24HourFormat\" [style.color]=\"config.FontColor\">\n                <i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>\n                </td>\n            </tr>\n        </tbody>\n        </table>\n",
                styles: ["button,table{border:0;-webkit-box-sizing:border-box;box-sizing:border-box}button{background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;outline:0;width:29px;height:100%}td{padding:1px}table{width:220px;height:100px;border-collapse:collapse;overflow:hidden;font-size:large}.dateTimeToggle{width:220px;height:20px;background:#e4e4e4;position:absolute;bottom:20px;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#efefef}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{color:#f0f8ff}thead tr,tr.days{height:25px}tr.days td{border:0}td.active{background:rgba(94,102,111,.05)}.resetBtn{cursor:pointer;color:#e0e0e0;float:left;width:30px;font-size:initial}.selectbtn{cursor:pointer;color:#5e666f;width:20px;font-size:xx-large}.pullRight{float:right}.rotateUp{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.rotateDown{-webkit-transform:rotate(-90deg) scaleX(-1);transform:rotate(-90deg) scaleX(-1)}.divider{width:10px;font-size:xx-large}.timeDigit{width:75px;font-size:larger}"],
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
LCTimePickerComponent.ctorParameters = function () { return [
    { type: core_1.ChangeDetectorRef, },
]; };
LCTimePickerComponent.propDecorators = {
    'newDate': [{ type: core_1.Input },],
    'config': [{ type: core_1.Input },],
    'selected': [{ type: core_1.Output },],
    'reset': [{ type: core_1.Output },],
};
exports.LCTimePickerComponent = LCTimePickerComponent;
//# sourceMappingURL=time-picker.component.js.map