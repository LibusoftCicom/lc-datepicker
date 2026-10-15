import { Component, Input, Optional } from '@angular/core';
import {
  DayPicker, IDatePickerHeader, LCDatePickerControl, Panel, YearPicker, MonthPicker, DateTimePart, ECalendarType
} from '@libusoftcicom/lc-datepicker';

@Component({
  selector: '[app-custom-datepicker-header]',
  standalone: true,
  template: `
    <tr>
      <th [attr.colspan]="type === Panel.Day ? 7 : type === Panel.Year ? yearColumns : 3">
        <div class="toolbar">
          <button type="button" (click)="navigate(-1)" [disabled]="!canNavigate"
            aria-label="Previous" title="Previous">
            <i class="fa fa-angle-left" aria-hidden="true"></i>
          </button>
          <div class="period" [class.year-period]="type === Panel.Year">
            @if (type === Panel.Day) {
              <button type="button" (click)="selectPanel(Panel.Month)" aria-label="Choose month" title="Choose month">
                {{ month }}
              </button>
            }
            <button type="button" (click)="selectPanel(type === Panel.Year ? Panel.Day : Panel.Year)"
              aria-label="Choose year" title="Choose year">
              {{ year }}
            </button>
          </div>
          <button type="button" (click)="navigate(1)" [disabled]="!canNavigate"
            aria-label="Next" title="Next">
            <i class="fa fa-angle-right" aria-hidden="true"></i>
          </button>
        </div>
      </th>
    </tr>
  `,
  styles: [`
    :host { background: var(--lc-datepicker-header-background, white); }
    th { padding: var(--lc-datepicker-custom-header-padding, 4px 8px); font-weight: 400; }
    .toolbar { display: grid; grid-template-columns: 28px 1fr 28px; align-items: center;
      min-height: var(--lc-datepicker-custom-header-height, 32px); }
    button { border: 0; background: transparent; color: var(--lc-datepicker-header-color, var(--lc-datepicker-color, #364152));
      cursor: pointer; height: 28px; padding: 0; font: inherit; }
    button:disabled { visibility: hidden; }
    button:focus-visible { outline: 2px solid var(--lc-datepicker-focus-color, #4277cf); }
    .period { display: flex; align-items: center; justify-content: center; gap: 16px;
      grid-column: 2; min-width: 0; font-size: var(--lc-datepicker-font-size, 12px); }
    .toolbar > button:last-child { grid-column: 3; }
    .period button { text-transform: capitalize; white-space: nowrap;
      font-weight: var(--lc-datepicker-header-font-weight, 600); }
    .year-period { display: var(--lc-datepicker-year-title-display, flex); }
  `]
})
export class CustomHeaderComponent implements IDatePickerHeader {
  @Input() public control!: LCDatePickerControl;
  @Input() public type!: Panel;
  public readonly Panel = Panel;

  constructor(
    @Optional() private readonly dayPicker: DayPicker,
    @Optional() private readonly yearPicker: YearPicker,
    @Optional() private readonly monthPicker: MonthPicker
  ) {}

  public get month(): string {
    return this.control.getAdapter().formatDateTimePart(
      this.control.getValue(), DateTimePart.MONTH, this.control.getLocalization()
    );
  }

  public get year(): string {
    return this.control.getAdapter().formatDateTimePart(
      this.control.getValue(), DateTimePart.YEAR, this.control.getLocalization()
    );
  }

  public get canNavigate(): boolean {
    return this.type === Panel.Day || this.type === Panel.Year ||
      (this.type === Panel.Month && this.control.getCalendarType() !== ECalendarType.DateRange);
  }

  public get yearColumns(): number {
    return this.control.getViewOptions().yearColumns ?? 5;
  }

  public navigate(direction: number): void {
    if (this.type === Panel.Day) {
      direction < 0 ? this.dayPicker.previousMonth() : this.dayPicker.nextMonth();
    } else if (this.type === Panel.Year) {
      direction < 0 ? this.yearPicker.previousYears() : this.yearPicker.nextYears();
    } else if (this.type === Panel.Month) {
      direction < 0 ? this.monthPicker.previousYear() : this.monthPicker.nextYear();
    }
  }

  public selectPanel(panel: Panel): void {
    this.control.setPanel(panel);
  }
}