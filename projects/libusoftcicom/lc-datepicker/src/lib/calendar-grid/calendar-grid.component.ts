import { ChangeDetectionStrategy, Component, ElementRef, Input, TemplateRef, ViewChild } from '@angular/core';
import { ICalendarItem, Panel } from '../base-date-picker.class';
import { LCDatePickerControl } from '../lc-date-picker-control';

export type LCCalendarGridKind = 'day' | 'month' | 'year';

@Component({
  selector: 'lc-calendar-grid',
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCCalendarGridComponent {

  @Input() public kind: LCCalendarGridKind;
  @Input() public headerType: Panel;
  @Input() public control: LCDatePickerControl;
  @Input() public rows: ICalendarItem[][];
  @Input() public weekdayLabels: string[] = [];
  @Input() public cellTemplate: TemplateRef<unknown>;

  @ViewChild('calendarTable', { static: true })
  public tableElement: ElementRef<HTMLTableElement>;

  public readonly dayPanel = Panel.Day;
  public readonly monthPanel = Panel.Month;
  public readonly yearPanel = Panel.Year;

  public trackIndex(index: number): number {
    return index;
  }

  public isRangeCell(item: ICalendarItem | null | undefined): boolean {
    return this.kind === 'day' && !!(item?.rangeStart || item?.rangeEnd || item?.inRange || item?.rangePreview);
  }

  public isRangeBoundary(row: ICalendarItem[], index: number, offset: number): boolean {
    return this.isRangeCell(row[index]) && !this.isRangeCell(row[index + offset]);
  }

  public get weekdayColor(): string {
    return `var(--lc-datepicker-weekday-color, ${this.control.getTheme().fontColor})`;
  }
}
