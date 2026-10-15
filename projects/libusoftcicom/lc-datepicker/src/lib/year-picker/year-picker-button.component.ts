import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ICalendarItem, Panel } from '../base-date-picker.class';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { YearPicker } from './year-picker.class';
import { ECalendarType } from '../enums';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';

@Component({
  selector: 'lc-year-picker-button',
  templateUrl: 'year-picker-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCYearPickerButtonComponent implements OnInit {

  @Input() public item: ICalendarItem;
  @Input() public row: number;
  @Input() public column: number;
  @Input() public control: LCDatePickerControl;

  constructor(
    private readonly datePicker: YearPicker,
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

    const isYear = this.control.getCalendarType() === ECalendarType.Year;
    this.control.setValue(
      this.dateAdapter.setParts(
        this.control.getValue(),
        { year: item.value }
      ),
      isYear && this.control.shouldConfirmSelection()
    );

    if (!isYear) {
      this.control.setPanel(Panel.Month);
    } else if (!this.control.shouldConfirmSelection()) {
      this.datePicker.setSelectedDate();
    }
  }
}
