import { InjectionToken, Provider, Type } from '@angular/core';
import { IDatePickerFooter } from './footer.component.interface';
import { LCDatePickerFooterComponent } from './footer.component';

export const DATE_PICKER_FOOTER = new InjectionToken<Type<IDatePickerFooter>>('LC_DATE_PICKER_FOOTER');

export function withDatePickerFooter(
    footer: Type<IDatePickerFooter> = LCDatePickerFooterComponent
): Provider {
    return {
        provide: DATE_PICKER_FOOTER,
        useValue: footer
    };
}