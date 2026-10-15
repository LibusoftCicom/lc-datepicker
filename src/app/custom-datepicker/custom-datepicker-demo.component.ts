import { Component } from '@angular/core';
import {
  DatePickerConfig,
  ECalendarType,
  LCDatePickerAdapter,
  withDatePickerFooter,
  withDatePickerHeader
} from '@libusoftcicom/lc-datepicker';
import { CustomFooterComponent } from './custom-footer.component';
import { CustomHeaderComponent } from './custom-header.component';

@Component({
  selector: 'app-custom-datepicker-demo',
  templateUrl: './custom-datepicker-demo.component.html',
  styleUrls: ['./custom-datepicker-demo.component.css'],
  providers: [
    withDatePickerHeader(CustomHeaderComponent),
    withDatePickerFooter(CustomFooterComponent)
  ]
})
export class CustomDatepickerDemoComponent {
  public singleDateConfig: DatePickerConfig;
  public linkedRangeConfig: DatePickerConfig;
  public singleDateValue: string;
  public linkedRangeValue: string;
  public readonly colorPalette = [
    { token: '--lc-datepicker-color', value: '#4b5563', fallback: 'theme.fontColor', purpose: 'day text' },
    { token: '--lc-datepicker-surface', value: '#fff', fallback: 'white', purpose: 'panel surface' },
    {
      token: '--lc-datepicker-weekdays-background', value: '#fff', fallback: 'aliceblue', purpose: 'weekday header row'
    },
    {
      token: '--lc-datepicker-border-color', value: '#e5e7eb', fallback: '#d8d8d8', purpose: 'panel and divider borders'
    },
    {
      token: '--lc-datepicker-primary-color', value: '#4277cf',
      fallback: 'theme.primaryColor', purpose: 'primary actions and markers'
    },
    { token: '--lc-datepicker-selected-background', value: '#dce8fa', fallback: 'transparent', purpose: 'active day' },
    {
      token: '--lc-datepicker-range-selection-background', value: '#f5f5f5',
      fallback: 'rgba(94, 102, 111, 0.12)', purpose: 'range middle'
    },
    {
      token: '--lc-datepicker-range-endpoint-background', value: '#dce8fa',
      fallback: 'selected background', purpose: 'range start and end'
    },
    {
      token: '--lc-datepicker-today-background', value: '#f0f2f5',
      fallback: 'rgba(94, 102, 111, 0.05)', purpose: 'today'
    },
    { token: '--lc-datepicker-hover-background', value: '#edf3fc', fallback: 'transparent', purpose: 'hover' },
    {
      token: '--lc-datepicker-disabled-color', value: '#a1a5af',
      fallback: 'rgb(187, 201, 216)', purpose: 'disabled text'
    },
    { token: '--lc-datepicker-focus-color', value: '#4277cf', fallback: '#5e666f', purpose: 'keyboard focus' },
    { token: '--lc-datepicker-event-marker-color', value: '#4277cf', fallback: '#4277cf', purpose: 'date event dot' }
  ];

  constructor(private readonly adapter: LCDatePickerAdapter) {
    const timezone = 'Europe/Zagreb';
    const today = adapter.today(timezone);
    const tomorrow = adapter.add(today, 1, 'day');
    this.singleDateValue = adapter.toISOString(today);
    this.linkedRangeValue = `${this.singleDateValue}/${adapter.toISOString(tomorrow)}`;

    this.singleDateConfig = new DatePickerConfig({
      value: this.singleDateValue,
      calendarType: ECalendarType.Date,
      localization: 'hr',
      timezone,
      selectionMode: 'explicit',
      labels: { confirmLabel: 'Apply' }
    }, adapter);
    this.linkedRangeConfig = new DatePickerConfig({
      value: this.linkedRangeValue,
      calendarType: ECalendarType.DateRange,
      localization: 'hr',
      timezone,
      rangeSelectionMode: 'linked',
      selectionMode: 'explicit',
      labels: { confirmLabel: 'Apply' }
    }, adapter);
  }

  public toggle(config: DatePickerConfig): void {
    config.setOpen(!config.isOpen());
  }
}