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
- disabledTimeRanges?: IDisabledTimeRange[]
- timezone?: string
- open?: boolean

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
