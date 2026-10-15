import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { TimePicker } from './time-picker.class';
import { LCTimePickerBaseDirective } from './time-picker-base.directive';

@Component({
  selector: 'lc-time-picker',
  templateUrl: 'time-picker.component.html',
  styleUrls: ['./time-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TimePicker]
})
export class LCTimePickerComponent extends LCTimePickerBaseDirective {
  constructor(
    cd: ChangeDetectorRef,
    timePicker: TimePicker,
  ) {
    super(cd, timePicker);
  }

  public setTimeFormat(): void {
    this.hourFormat = this.control.getHourFormat();
  }

  public resetTime(): void {
    this.control.reset();
  }

}
