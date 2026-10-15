import {
  Component,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { LCTimeSpinnerBaseDirective } from '../time-picker/time-spinner-base.directive';

@Component({
  selector: 'lc-time-spinner-compact',
  templateUrl: 'time-spinner-compact.component.html',
  styleUrls: ['./time-spinner-compact.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCTimeSpinnerCompactComponent extends LCTimeSpinnerBaseDirective {
  constructor(ngZone: NgZone) {
    super(ngZone);
  }

  public override get arrowColor(): string {
    return `var(--lc-datepicker-color, ${this.control.getTheme().fontColor})`;
  }

  public override get valueColor(): string {
    return `var(--lc-datepicker-time-value-color, ${this.control.getTheme().fontColor})`;
  }
}
