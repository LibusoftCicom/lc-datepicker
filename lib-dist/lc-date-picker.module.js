"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var time_picker_component_1 = require("./lc-date-picker/time-picker/time-picker.component");
var time_picker_compact_component_1 = require("./lc-date-picker/time-picker-compact/time-picker-compact.component");
var day_picker_component_1 = require("./lc-date-picker/day-picker/day-picker.component");
var month_picker_component_1 = require("./lc-date-picker/month-picker/month-picker.component");
var year_picker_component_1 = require("./lc-date-picker/year-picker/year-picker.component");
var lc_date_picker_component_1 = require("./lc-date-picker/lc-date-picker.component");
var LcDatePickerModule = /** @class */ (function () {
    function LcDatePickerModule() {
    }
    LcDatePickerModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [
                        lc_date_picker_component_1.LCDatePickerComponent,
                        time_picker_component_1.LCTimePickerComponent,
                        time_picker_compact_component_1.LCTimePickerCompactComponent,
                        day_picker_component_1.LCDayPickerComponent,
                        month_picker_component_1.LCMonthPickerComponent,
                        year_picker_component_1.LCYearPickerComponent
                    ],
                    exports: [
                        lc_date_picker_component_1.LCDatePickerComponent,
                    ]
                },] },
    ];
    /** @nocollapse */
    LcDatePickerModule.ctorParameters = function () { return []; };
    return LcDatePickerModule;
}());
exports.LcDatePickerModule = LcDatePickerModule;
__export(require("./lc-date-picker/lc-date-picker-config-helper"));
__export(require("./lc-date-picker/lc-date-picker.component"));
//# sourceMappingURL=lc-date-picker.module.js.map