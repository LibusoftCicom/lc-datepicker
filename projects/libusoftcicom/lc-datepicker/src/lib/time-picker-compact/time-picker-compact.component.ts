import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { TimePicker } from '../time-picker/time-picker.class';
import { LCTimePickerBaseDirective } from '../time-picker/time-picker-base.directive';

@Component({
  selector: 'lc-time-picker-compact',
  templateUrl: './time-picker-compact.component.html',
  styleUrls: ['./time-picker-compact.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TimePicker],
})
export class LCTimePickerCompactComponent extends LCTimePickerBaseDirective {

  @Input() public showLabel = true;

  constructor(
    cd: ChangeDetectorRef,
    timePicker: TimePicker,
  ) {
    super(cd, timePicker);
  }

  public override get panelTextColor(): string {
    return `var(--lc-datepicker-color, ${this.control.getTheme().fontColor})`;
  }
}
