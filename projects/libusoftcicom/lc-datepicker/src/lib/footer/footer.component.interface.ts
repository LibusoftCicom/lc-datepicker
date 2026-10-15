import { EventEmitter, InputSignal } from "@angular/core";
import { LCDatePickerControl } from "../lc-date-picker-control";


export interface IDatePickerFooter {
    control?: LCDatePickerControl | InputSignal<LCDatePickerControl | null>;
    confirm: EventEmitter<void>;
    cancel: EventEmitter<void>;
    clear?: EventEmitter<void>;
}