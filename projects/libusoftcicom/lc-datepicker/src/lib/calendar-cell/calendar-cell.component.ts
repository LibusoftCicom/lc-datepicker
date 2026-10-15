import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ICalendarItem } from '../base-date-picker.class';
import { DateTimePart, LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LCDatePickerControl } from '../lc-date-picker-control';

export type LCCalendarCellKind = 'day' | 'month' | 'year';

@Component({
  selector: 'lc-calendar-cell',
  templateUrl: './calendar-cell.component.html',
  styleUrls: ['./calendar-cell.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCCalendarCellComponent {

  @Input() public item: ICalendarItem;
  @Input() public kind: LCCalendarCellKind = 'day';
  @Input() public control: LCDatePickerControl;
  @Output() public selection = new EventEmitter<void>();
  @Output() public hover = new EventEmitter<void>();
  @Output() public hoverEnd = new EventEmitter<void>();

  public get textColor(): string {
    if (this.kind === 'day' && this.item?.outsideMonth) {
      return `var(--lc-datepicker-outside-color, var(--lc-datepicker-disabled-color, ${this.control.getTheme().fontColor}))`;
    }
    if (this.item?.disabled) {
      return `var(--lc-datepicker-disabled-color, ${this.control.getTheme().fontColor})`;
    }
    const token = this.kind === 'day' ? '--lc-datepicker-color' : '--lc-datepicker-choice-color';
    return `var(${token}, ${this.control.getTheme().fontColor})`;
  }

  public get hasEvents(): boolean {
    return this.kind === 'day' && !!this.item?.events?.length;
  }

  public get eventTooltip(): string | null {
    if (!this.hasEvents) {
      return null;
    }
    return this.item.events.map(event => {
      const metadata = Object.entries(event.metadata ?? {})
        .map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
      return [event.label, event.description, ...metadata].filter(Boolean).join('\n');
    }).join('\n\n');
  }

  public get ariaLabel(): string {
    const date = this.item?.dateTime;
    if (!date) {
      return this.item?.text ?? `${this.item?.value ?? ''}`;
    }

    const adapter: LCDatePickerAdapter = this.control.getAdapter();
    const locale = this.control.getLocalization();
    const parts = this.kind === 'day'
      ? [DateTimePart.DATE, DateTimePart.MONTH, DateTimePart.YEAR]
      : this.kind === 'month'
        ? [DateTimePart.MONTH, DateTimePart.YEAR]
        : [DateTimePart.YEAR];
    const dateLabel = parts
      .map(part => adapter.formatDateTimePart(date, part, locale))
      .join(' ');

    if (this.item.rangeStart) {
      return `${dateLabel}, range start`;
    }
    if (this.item.rangeEnd) {
      return `${dateLabel}, range end`;
    }
    if (this.item.inRange) {
      return `${dateLabel}, in selected range`;
    }
    if (this.item.rangePreview) {
      return `${dateLabel}, in range preview`;
    }
    return dateLabel;
  }

  public select(): void {
    if (!this.item?.disabled) {
      this.selection.emit();
    }
  }
}
