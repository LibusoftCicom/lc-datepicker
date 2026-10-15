import { InjectionToken, Provider, Type } from '@angular/core';
import { IDatePickerHeader } from './lc-date-picker-header.interface';
import { LcDatePickerBasicHeaderComponent } from './lc-date-picker-basic-header.component';

export const DATE_PICKER_HEADER = new InjectionToken<Type<IDatePickerHeader>>('LC_DATE_PICKER_HEADER');

export function withDatePickerHeader(
    header: Type<IDatePickerHeader> = LcDatePickerBasicHeaderComponent
): Provider {
    return {
        provide: DATE_PICKER_HEADER,
        useValue: header
    };
}