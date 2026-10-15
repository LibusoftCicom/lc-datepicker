import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDatePickerFooter, LCDatePickerControl } from '@libusoftcicom/lc-datepicker';

@Component({
  selector: 'app-custom-datepicker-footer',
  standalone: true,
  template: `
    <div class="actions">
      <button type="button" class="clear" (click)="clear.emit()">Clear</button>
      <button type="button" class="cancel" (click)="cancel.emit()">Cancel</button>
      <button type="button" class="apply" [disabled]="!control.isRangeSelectionComplete()"
        (click)="confirm.emit()">{{ control.getLabels().confirmLabel }}</button>
    </div>
  `,
  styles: [`
    :host { display: block; font-size: var(--lc-datepicker-font-size, 12px); line-height: 1.4; }
    .actions { display: flex; justify-content: flex-end;
      gap: var(--lc-datepicker-footer-gap, 8px); padding: var(--lc-datepicker-footer-padding, 8px);
      border-top: 1px solid var(--lc-datepicker-border-color, #e5e7eb);
      background: var(--lc-datepicker-surface, white); }
    button { min-width: var(--lc-datepicker-footer-button-width, 64px);
      flex: var(--lc-datepicker-footer-button-flex, initial);
      height: var(--lc-datepicker-footer-button-height, 28px);
      border: 1px solid var(--lc-datepicker-border-color, #d9dde3);
      border-radius: 3px; padding: 0 12px; font: inherit; cursor: pointer; }
    .clear { background: #f5f6f8; color: var(--lc-datepicker-color, #364152); }
    .cancel { background: var(--lc-datepicker-surface, white); color: var(--lc-datepicker-color, #364152); }
    .apply { background: var(--lc-datepicker-primary-color, #4277cf); color: white; border-color: transparent; }
    .apply:disabled { opacity: 0.5; cursor: not-allowed; }
    button:focus-visible { outline: 2px solid var(--lc-datepicker-focus-color, #4277cf); outline-offset: 2px; }
  `]
})
export class CustomFooterComponent implements IDatePickerFooter {
  @Input() public control!: LCDatePickerControl;
  @Output() public confirm = new EventEmitter<void>();
  @Output() public cancel = new EventEmitter<void>();
  @Output() public clear = new EventEmitter<void>();
}