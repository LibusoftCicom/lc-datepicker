import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Panel } from '../base-date-picker.class';
import { LCDatePickerControl } from '../lc-date-picker-control';

@Component({
  selector: 'lc-active-calendar-panel',
  templateUrl: './active-calendar-panel.component.html',
  styleUrls: ['./active-calendar-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCActiveCalendarPanelComponent {

  @Input() public panel: Panel;
  @Input() public control: LCDatePickerControl;
  @Input() public includeTimePanel = false;
  @Input() public compactTime = false;
  @Input() public showTimeLabel = true;

  public readonly Panel = Panel;
}
