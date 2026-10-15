import { ChangeDetectionStrategy, Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { IDatePickerFooter } from './footer.component.interface';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { ECalendarType } from '../enums';

@Component({
    selector: 'lc-datepicker-footer',
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCDatePickerFooterComponent implements IDatePickerFooter {

    protected readonly ECalendarType = ECalendarType;

    public control: InputSignal<LCDatePickerControl | null> = input<LCDatePickerControl | null>(null);

    @Output() public confirm: EventEmitter<void> = new EventEmitter<void>();

    @Output() public cancel: EventEmitter<void> = new EventEmitter<void>();

    public shouldShowConfirmButton(control: LCDatePickerControl): boolean {
        const calendarType = control.getCalendarType();
        return calendarType <= ECalendarType.DateTime ||
            calendarType === ECalendarType.DateRange ||
            control.isLinkedRangeSelection();
    }
}
