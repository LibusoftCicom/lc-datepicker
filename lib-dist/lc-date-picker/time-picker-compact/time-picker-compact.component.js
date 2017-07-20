"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var LCTimePickerCompactComponent = (function () {
    function LCTimePickerCompactComponent(cd) {
        this.cd = cd;
        this.selected = new core_1.EventEmitter();
    }
    LCTimePickerCompactComponent.prototype.ngOnInit = function () {
        this.setTimeFormat();
    };
    LCTimePickerCompactComponent.prototype.setTimeFormat = function () {
        this.is24HourFormat = this.newDate.format('LT').indexOf('M') === -1;
    };
    LCTimePickerCompactComponent.prototype.addHour = function () {
        var hour = this.newDate.hour();
        this.newDate.hour(++hour % 24);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerCompactComponent.prototype.subtractHour = function () {
        var hour = this.newDate.hour();
        this.newDate.hour((--hour + 24) % 24);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerCompactComponent.prototype.addMinute = function () {
        var minute = this.newDate.minutes();
        this.newDate.minute(++minute % 60);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerCompactComponent.prototype.subtractMinute = function () {
        var minute = this.newDate.minute();
        this.newDate.minute((--minute + 60) % 60);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerCompactComponent.prototype.hourScroll = function (event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.addHour();
        }
        if (event.deltaY > 0) {
            this.subtractHour();
        }
    };
    LCTimePickerCompactComponent.prototype.minuteScroll = function (event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.addMinute();
        }
        if (event.deltaY > 0) {
            this.subtractMinute();
        }
    };
    LCTimePickerCompactComponent.prototype.toggleMeridiem = function () {
        this.newDate.hour((this.newDate.hour() + 12) % 24);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    };
    LCTimePickerCompactComponent.prototype.preventDefault = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    };
    LCTimePickerCompactComponent.prototype.stopPropagation = function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
    };
    return LCTimePickerCompactComponent;
}());
LCTimePickerCompactComponent.decorators = [
    { type: core_1.Component, args: [{
                moduleId: module.id,
                selector: 'lc-time-picker-compact',
                template: "\n    <table class=\"timePicker\">\n    <tbody align=\"center\">\n        <tr>\n        <td rowspan=\"2\" class=\"clockCell\">\n            <i class=\"fa fa-clock-o fa-2x\" aria-hidden=\"true\"></i>\n        </td>\n        <td rowspan=\"2\" class=\"timeLabel\" (wheel)=\"hourScroll($event)\">\n            {{is24HourFormat ? newDate.format('HH') : newDate.format('hh')}}\n        </td>\n        <td class=\"selectbtn\" (click)=\"addHour()\" (wheel)=\"hourScroll($event)\">\n            <i class=\"fa fa-caret-up fa-2x\" aria-hidden=\"true\"></i>\n        </td>\n        <td rowspan=\"2\" class=\"divider\">:</td>\n        <td rowspan=\"2\" class=\"timeLabel\" (wheel)=\"minuteScroll($event)\">{{newDate.format('mm')}}</td>\n        <td class=\"selectbtn\" (click)=\"addMinute()\" (wheel)=\"minuteScroll($event)\">\n            <i class=\"fa fa-caret-up fa-2x\" aria-hidden=\"true\"></i>\n        </td>\n        <td rowspan=\"2\" class=\"timeLabel\" (wheel)=\"toggleMeridiem($event)\" *ngIf=\"!is24HourFormat\">{{newDate.format('A')}}</td>\n        <td class=\"selectbtn\" (click)=\"toggleMeridiem()\" (wheel)=\"toggleMeridiem($event)\" *ngIf=\"!is24HourFormat\">\n            <i class=\"fa fa-caret-up fa-2x\" aria-hidden=\"true\"></i>\n        </td>\n        <td rowspan=\"2\" ></td>\n        </tr>\n        <tr>\n        <td class=\"selectbtn\" (click)=\"subtractHour()\" (wheel)=\"hourScroll($event)\">\n            <i class=\"fa fa-caret-down fa-2x\" aria-hidden=\"true\"></i>\n        </td>\n        <td class=\"selectbtn\" (click)=\"subtractMinute()\" (wheel)=\"minuteScroll($event)\">\n            <i class=\"fa fa-caret-down fa-2x\" aria-hidden=\"true\"></i>\n        </td>\n        <td class=\"selectbtn\" (click)=\"toggleMeridiem()\" (wheel)=\"toggleMeridiem($event)\" *ngIf=\"!is24HourFormat\">\n            <i class=\"fa fa-caret-down fa-2x\" aria-hidden=\"true\"></i>\n        </td>\n        </tr>\n    </tbody>\n    </table>\n",
                styles: ["button,table{width:100%;border:0;-webkit-box-sizing:border-box;box-sizing:border-box}button{background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;outline:0;height:100%}.monthCal td,.monthsCal td,.yearsCal td{min-width:30px;padding:5px 0;border:1px solid #e4e4e4}table{height:40px;border-collapse:collapse;display:table;overflow:hidden}.dateTimeToggle{width:220px;height:20px;background:#e4e4e4;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#efefef}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{border-bottom:1px solid #efefef}thead tr,tr.days{height:25px}tr.days td{border:0}td.active{background:#e6e8ea}.selectbtn{cursor:pointer;font-size:10px;width:18px;padding:0 5px;color:#5e666f}.timeLabel{font-size:x-large;text-align:right;width:30px}.divider{width:10px;font-size:xx-large}.clockCell{width:50px}"],
                changeDetection: core_1.ChangeDetectionStrategy.OnPush
            },] },
];
/** @nocollapse */
LCTimePickerCompactComponent.ctorParameters = function () { return [
    { type: core_1.ChangeDetectorRef, },
]; };
LCTimePickerCompactComponent.propDecorators = {
    'newDate': [{ type: core_1.Input },],
    'config': [{ type: core_1.Input },],
    'selected': [{ type: core_1.Output },],
};
exports.LCTimePickerCompactComponent = LCTimePickerCompactComponent;
//# sourceMappingURL=time-picker-compact.component.js.map