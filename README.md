![Logo of the project](https://raw.githubusercontent.com/LibusoftCicom/lc-datepicker/master/src/assets/logo.png)

# LC DatePicker

> Pure Angular date and time picker component.

[![npm version](https://badge.fury.io/js/%40libusoftcicom%2Flc-datepicker.svg)](https://www.npmjs.com/package/@libusoftcicom/lc-datepicker)

[![Build Status](https://travis-ci.org/LibusoftCicom/lc-datepicker.svg?branch=master)](https://travis-ci.org/LibusoftCicom/lc-datepicker)

# Demo

[Click here for preview](https://libusoftcicom.github.io/lc-datepicker/)

# Description

- LC DatePicker is an Angular component that generates a datepicker calendar on your input element
- Compatible with Angular up to v18.0.0
- Only dependencies are RxJS and Font Awesome
- Customizable date format and language
- Can be configured as time, date-time, date, month or year picker

# Tested with

- Firefox (latest)
- Chrome (latest)
- Chromium (latest)

## Installing / Getting started

```shell
npm install @libusoftcicom/lc-datepicker
```

Use the following snippet inside your app module:

```shell
import {LcDatePickerModule} from '@libusoftcicom/lc-datepicker';

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    LcDatePickerModule.withImplementation({adapter: LuxonDateAdapterService})
    // or LcDatePickerModule.withImplementation({adapter: MomentDateAdapterService})
    // It is also possible to extend LCDatePickerAdapter and implement the adapter using a different library.
  ],
  providers: [
    ...
  ],
  bootstrap: [...]
})
export class AppModule {}
```

Use the following snippet inside your component:

```shell
import {DatePickerConfig, ECalendarType} from '@libusoftcicom/lc-datepicker';


@Component({
  ...
})
export class AppComponent {

  public inputDate: DateTime;
  public datePickerConfig: DatePickerConfig;
	public dateRangePickerConfig: DatePickerConfig;

  constructor(
    private readonly dateAdapter: LCDatePickerAdapter,
    ...
  ) {

   const timezone = 'Europe/Zagreb';
   // For dates use ISO 8601 formatted strings, e.g. 2024-09-12T22:00:00.000Z
   // For LCDateRangePickerComponent separate the first and second date using /,
   // e.g. 2024-09-12T22:00:00.000Z/2024-09-13T22:00:00.000Z
   this.inputDate = this.dateAdapter.toISOString(this.dateAdapter.now(timezone));
   // configuration is optional, except for the value.
   // Other properties will be given default values.
   const datePickerConfiguration: IDatePickerConfiguration = {
     value: this.inputDate,
     calendarType: ECalendarType.Date,
     localization: 'hr',
     hourFormat: EHourFormat.TWENTY_FOUR_HOUR,
     timezone: timezone,
     minimumDate: minDate,
     maximumDate: maxDate,
     disabledDates: [
       2024-09-12T22:00:00.000Z
       // ...
     ],
     disabledTimeRanges: [
       {startTime: {hour: 0, minute: 0}, stopTime: {hour: 7, minute: 59}}
       // ...
     ]
     labels: { confirmLabel: 'OK', fromLabel: 'From', toLabel: 'To' },
     theme: { primaryColor: '#5e666f', fontColor: '#5e666f' }
   };
   this.datePickerConfig = new DatePickerConfig(datePickerConfiguration, this.dateAdapter);
   
   const today = this.dateAdapter.today(timezone);

    const dateRangePickerConfiguration = {
      ...Object.assign(datePickerConfiguration),
      value: this.dateAdapter.toISOString(today) + '/' + this.dateAdapter.toISOString(this.dateAdapter.add(today, 1, 'day')),
      calendarType: ECalendarType.DateRange
    };

    this.dateRangePickerConfig = new DatePickerConfig(dateRangePickerConfiguration, this.dateAdapter);
   ...
  }

  public setCalendarDate(dateTime: string): void {
   this.dateInput.nativeElement.value = dateTime;
  }
  
  public setDatePickerOpen(open: boolean): void {
    if (!open) {
      this.dateInput.nativeElement.click();
      this.dateInput.nativeElement.select();
    }
  }
```

Use the following snippet inside your template for date-picker:

```shell
<lc-datepicker
   [config]="datePickerConfig"
   (openedChange)="setDatePickerOpen($event)"
   (dateChange)="setCalendarDate($event)">
 </lc-datepicker>
```

Use the following snippet inside your template for date-range-picker:

```shell
<lc-date-range-picker
   [config]="dateRangePickerConfig"
   (openedChange)="setDateRangePickerOpen($event)"
   (dateChange)="setCalendarDateRange($event)">
 </lc-date-range-picker> 
```

## IDatePickerConfiguration properties

- value: string;
- calendarType?: ECalendarType
- theme?: IColorTheme
- fontColor: string
- labels?: ILabels
- hourFormat?: EHourFormat
- localization?: string
- minimumDate?: string
- maximumDate?: string
- disabledDates?: string[]
- dateEvents?: IDatePickerEvent[]
- disabledTimeRanges?: IDisabledTimeRange[]
- timezone?: string
- open?: boolean
- selectionMode?: 'immediate' | 'explicit'
- rangeSelectionMode?: 'independent' | 'linked' (for Date and DateRange; defaults to 'independent')
- rangeNavigationMode?: 'independent' | 'synchronized' (for linked DateRange selection; defaults to 'independent')

With the default `rangeSelectionMode: 'independent'`, the left panel sets only the start and
the right panel only the end of a `DateRange`. Either side may stay empty: the value is then
`startISO/` or `/endISO`, and an empty value (or `'/'`) leaves both sides unselected. An empty
side highlights no date; its panel opens on the other side's month (or the current month).

Set `rangeSelectionMode: 'linked'` to use a shared two-click selection in the range picker.
Each panel initially shows its corresponding endpoint month, and both panels navigate
independently by default. Set `rangeNavigationMode: 'synchronized'` to move the other panel
by the same number of months when either panel is navigated; the relative month offset is kept.
Header month and year actions open the month and year pickers in each panel; choosing a month
returns to that panel's day calendar without changing the selection (with synchronized
navigation, the other panel moves by the same number of months).
Select a start and end date; reversed selections are normalized automatically. The default
Apply button remains disabled after selecting only the start date. Custom footers can check
`control.isRangeSelectionComplete()` and subscribe to `control.getRangeSelectionChanges()`;
the picker also ignores confirmation while incomplete.
Existing date restrictions apply to each endpoint, and closing without Apply restores the
last confirmed range.

For a range in a single calendar, use `lc-datepicker` with `calendarType: ECalendarType.Date`
and `rangeSelectionMode: 'linked'`. The value and `dateChange` payload use the same
`startISO/endISO` format as the range picker. An initial single ISO date is accepted as a
one-day range. Without `linked`, single-date pickers retain their existing behavior.

```typescript
const config = new DatePickerConfig({
  value: '2026-10-10T00:00:00.000Z/2026-10-15T00:00:00.000Z',
  calendarType: ECalendarType.Date,
  rangeSelectionMode: 'linked',
  selectionMode: 'explicit',
  timezone: 'UTC'
}, dateAdapter);
```

In both the single-calendar and the two-calendar picker, the first click starts a draft and
the second finishes it. `selectionMode: 'immediate'` (the default) emits once and closes on
the second click; `'explicit'` waits for Apply. A third click starts a new draft. Selecting
the same date twice creates a one-day range. Disabled days may lie inside the range, but
cannot be endpoints. Month navigation does not alter selected endpoints.
Linked selection is not supported for DateTime, Time, MonthYear or Year pickers.

The library does not register global `keydown` or `keyup` handlers. Applications may
optionally map their own keyboard events to the public picker actions; native buttons retain
their normal focus order and activation behavior.

## Date Events

`dateEvents` adds a dot and a native hover tooltip to matching calendar days.
Events are independent of today, selection and disabled status: a holiday does not
disable a day unless it is also included in `disabledDates`. Multiple events may share
one date. Dates are matched by calendar day using the configured date adapter and timezone.
Use ISO date strings consistent with that adapter's timezone support.

```typescript
dateEvents: [{
  date: '2026-12-25T00:00:00.000Z',
  label: 'Christmas Day',
  description: 'Public holiday',
  metadata: { country: 'HR', type: 'holiday', workingDay: false }
}]
```

`IDatePickerEvent` is exported from the public API. `label` and `date` are required;
`description` and `metadata: Readonly<Record<string, unknown>>` are optional.
The tooltip shows all labels, descriptions and metadata as plain text (never HTML),
including on disabled days. The same text is exposed through `aria-description` on
the day button. Disabled buttons retain their native focus restrictions.
Use `config.getDateEvents()` and `config.setDateEvents(events)` to read or replace
events; open single, range and linked calendars refresh without changing the selection.

Style dots using `--lc-datepicker-event-marker-color` and
`--lc-datepicker-event-marker-disabled-color`. The today marker remains a separate,
optional feature (`--lc-datepicker-today-marker-display`); the custom demo turns it off
so dots exclusively represent configured events.

Regression tests cover default, range, active and today cell states with and without
events, including disabled days. Range hover uses
`--lc-datepicker-range-hover-background`; endpoint hover uses
`--lc-datepicker-range-endpoint-hover-background`. The optional connected band uses
`--lc-datepicker-range-band-display: block`. Without these tokens, the existing
fallback styling is preserved.

## Custom headers, footers and themes

Header and footer providers can be overridden independently or together. A local
provider affects only that picker component and its descendants:

```typescript
@Component({
  selector: 'app-themed-picker',
  standalone: true,
  imports: [LcDatePickerModule],
  providers: [
    withDatePickerHeader(CustomHeaderComponent),
    withDatePickerFooter(CustomFooterComponent)
  ],
  template: '<lc-datepicker [config]="config"></lc-datepicker>'
})
export class ThemedPickerComponent {}
```

Omit either local provider to retain the default implementation for that part.
`CustomHeaderComponent` implements `IDatePickerHeader` and receives the active
`control` and `Panel`; it should navigate through the corresponding picker model and
use `control.setPanel()` for panel changes. A footer implements `IDatePickerFooter`
and emits `confirm`, `cancel`, and optionally `clear`; the picker owns committing,
closing and clearing the value. In explicit mode, check
`control.isRangeSelectionComplete()` before enabling Apply so an incomplete linked
range cannot be confirmed.

For application-wide replacement in an NgModule, register the standalone components
as imports and provide them with the module:

```typescript
@NgModule({
  imports: [
    CustomHeaderComponent,
    CustomFooterComponent,
    LcDatePickerModule.withImplementation({
      adapter: MomentDateAdapterService,
      header: CustomHeaderComponent,
      footer: CustomFooterComponent
    })
  ]
})
export class AppModule {}
```

In a standalone bootstrap, use `importProvidersFrom(LcDatePickerModule.withImplementation(...))`
in `bootstrapApplication` providers. A component-local `withDatePickerHeader()` or
`withDatePickerFooter()` provider takes precedence over the application-wide provider.
The repository demo implementations show complete standalone header/footer components,
their imports and actions: [custom header](./src/app/custom-datepicker/custom-header.component.ts)
and [custom footer](./src/app/custom-datepicker/custom-footer.component.ts).

CSS custom properties inherit through the wrapper/host DOM tree, including across
Angular component hosts. Scope a theme to a wrapper to avoid affecting other picker
instances; CSS variables override the `theme.primaryColor` and `theme.fontColor` API
where the component reads the corresponding variable, while the API remains the
fallback. For example:

```css
.booking-calendar {
  --lc-datepicker-primary-color: #245ca6;
  --lc-datepicker-color: #273449;
  --lc-datepicker-surface: #ffffff;
  --lc-datepicker-selected-background: #d9e8ff;
  --lc-datepicker-range-selection-background: #eef4fc;
  --lc-datepicker-range-endpoint-background: #245ca6;
  --lc-datepicker-focus-color: #17467f;
}
```

The library's main token owners are `calendar-cell` for text, active/range/today,
hover, disabled, focus and event-marker states; `calendar-grid` for the day-grid
surface and connected range band; picker panels for width, shadow and padding; and
header/footer components for their own surfaces and actions. Key fallbacks include
`--lc-datepicker-color` → `theme.fontColor`, `--lc-datepicker-primary-color` →
`theme.primaryColor`, `--lc-datepicker-range-selection-background` →
`rgba(94, 102, 111, 0.12)`, `--lc-datepicker-focus-color` → `#5e666f`, and
`--lc-datepicker-event-marker-color` → `#4277cf`. Day cells and choice cells share
the same state classes and cell component in single and range pickers; `calendar-grid`
owns the connected band between range cells.

The day grid also accepts `--lc-datepicker-weekdays-background` (fallback `aliceblue`)
for its weekday-name row. `--lc-datepicker-border-color` can style component borders,
including the default confirmation button's top border (fallback `#efefef`).

## Croatian public-holiday demo data

The demo explicitly defaults its country selector to Croatian national public holidays;
set it to “No country holidays” to opt out. Country is independent of picker locale.
Holiday labels are available in Croatian and English
(all other display locales fall back to English), and dates are generated in the
`Europe/Zagreb` timezone for 1899–2100 to cover adjacent visible years. Selecting
“No country holidays” removes national holidays but keeps user-defined demo events.
Holiday events include country/type/source metadata and do not disable selection.

The dates and Croatian names are generated from `date-holidays` 3.37.0, attributed to
the [date-holidays project](https://github.com/commenthol/date-holidays) and licensed
`ISC AND CC-BY-3.0` as recorded in the dependency lockfile. The Croatian public
holiday rules are referenced to the [Croatian Holidays and Non-Working Days Act,
NN 110/2019, Articles 1 and 4](https://narodne-novine.nn.hr/clanci/sluzbeni/2019_11_110_2212.html).
Croatian holidays falling on Sunday are not moved to a substitute weekday.

## Developing

### Built With:

- Angular
- Font Awesome

### Setting up Dev

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

[Angular CLI](https://github.com/angular/angular-cli) must be installed before building LC DatePicker component.

```shell
npm install -g @angular/cli
```

```shell
git clone https://github.com/LibusoftCicom/lc-datepicker.git
cd lc-datepicker/
npm install
npm run start
```

Open "http://localhost:4200" in browser

### Building

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

[Angular CLI](https://github.com/angular/angular-cli) must be installed before building LC DatePicker component.

```shell
npm install -g @angular/cli
```

```shell
git clone https://github.com/LibusoftCicom/lc-datepicker.git
cd lc-datepicker/
npm install
npm run build
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](https://github.com/LibusoftCicom/lc-datepicker/tags).

## Tests

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

[Angular CLI](https://github.com/angular/angular-cli) must be installed before building LC DatePicker component.

```shell
npm install -g @angular/cli
```

```shell
git clone https://github.com/LibusoftCicom/lc-datepicker.git
cd lc-datepicker/
npm install
npm run test
```

## Contributing

### Want to help?

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [contributing guide](https://github.com/LibusoftCicom/lc-datepicker/blob/master/CONTRIBUTING.md) and [code of conduct](https://github.com/LibusoftCicom/lc-datepicker/blob/master/CODE_OF_CONDUCT.md) and then check out one of our [issues](https://github.com/LibusoftCicom/lc-datepicker/issues).

## Licensing

LC DatePicker is freely distributable under the terms of the [MIT license](https://github.com/LibusoftCicom/lc-datepicker/blob/master/LICENSE).
