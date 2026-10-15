import {
  Component,
  ChangeDetectionStrategy,
  NgZone,
} from '@angular/core';
import { LCTimeSpinnerBaseDirective } from './time-spinner-base.directive';

@Component({
  selector: 'lc-time-spinner',
  templateUrl: 'time-spinner.component.html',
  styleUrls: ['./time-spinner.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCTimeSpinnerComponent extends LCTimeSpinnerBaseDirective {
  constructor(ngZone: NgZone) {
    super(ngZone);
  }
}
