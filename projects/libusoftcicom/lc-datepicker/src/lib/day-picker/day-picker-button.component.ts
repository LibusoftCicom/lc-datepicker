import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DayPicker } from './day-picker.class';
import { ICalendarItem } from '../base-date-picker.class';
import { DateTime } from '../date-time.class';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { ECalendarType } from '../enums';

@Component({
  selector: 'lc-day-picker-button',
  templateUrl: 'day-picker-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCDayPickerButtonComponent implements OnInit {

  @Input() public item: ICalendarItem;
  @Input() public row: number;
  @Input() public column: number;
  @Input() public control: LCDatePickerControl;
  @Output() public selected = new EventEmitter<DateTime>();
  @Output() public preview = new EventEmitter<DateTime | null>();

  constructor(
    private readonly datePicker: DayPicker,
    private readonly dateAdapter: LCDatePickerAdapter,
  ) {}

  public ngOnInit(): void {
    this.datePicker.setControl(this.control);
  }

  public selectItem(): void {
    const item = this.datePicker.getCalendarItem(this.row, this.column);
    if (item.value === null || item.disabled) {
      return;
    }

    const newDate = item.dateTime ?? this.dateAdapter.setParts(
      this.control.getValue(),
      { date: item.value }
    );

    this.control.setValueSet(true);
    this.control.setValue(
      newDate,
      this.control.getCalendarType() === ECalendarType.Date && this.control.shouldConfirmSelection()
    );
    this.selected.emit(newDate);
    this.datePicker.setSelectedDate(newDate);
  }

  public previewItem(): void {
    const item = this.datePicker.getCalendarItem(this.row, this.column);
    if (item.dateTime && !item.disabled) {
      this.preview.emit(item.dateTime);
    }
  }

  public clearPreview(): void {
    this.preview.emit(null);
  }

}
