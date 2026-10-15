import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ICalendarItem, Panel } from '../base-date-picker.class';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { MonthPicker } from './month-picker.class';
import { ECalendarType } from '../enums';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';

@Component({
  selector: 'lc-month-picker-button',
  templateUrl: 'month-picker-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCMonthPickerButtonComponent implements OnInit {

  @Input() public item: ICalendarItem;
  @Input() public row: number;
  @Input() public column: number;
  @Input() public control: LCDatePickerControl;

  constructor(
    private readonly datePicker: MonthPicker,
    private readonly dateAdapter: LCDatePickerAdapter,
  ) {}

  public ngOnInit(): void {
    this.datePicker.setControl(this.control);
  }

  public selectItem(): void {
    const item = this.datePicker.getCalendarItem(this.row, this.column);
    if (item.disabled) {
      return;
    }

    const isMonthYear = this.control.getCalendarType() === ECalendarType.MonthYear;
    this.control.setValue(
      this.dateAdapter.setParts(
        this.control.getValue(),
        { month: item.value }
      ),
      isMonthYear && this.control.shouldConfirmSelection()
    );

    if (!isMonthYear) {
      this.control.setPanel(Panel.Day);
    } else if (!this.control.shouldConfirmSelection()) {
      this.datePicker.setSelectedDate(this.control.getValue());
    }
  }
}
