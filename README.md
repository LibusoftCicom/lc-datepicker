![Logo of the project](https://raw.githubusercontent.com/LibusoftCicom/lc-datepicker/master/src/assets/logo.png)

# LC DatePicker

> Pure Angular date and time picker component.

[![npm version](https://badge.fury.io/js/%40libusoftcicom%2Flc-datepicker.svg)](https://www.npmjs.com/package/@libusoftcicom/lc-datepicker)

[![Build Status](https://travis-ci.org/LibusoftCicom/lc-datepicker.svg?branch=master)](https://travis-ci.org/LibusoftCicom/lc-datepicker)

# Demo

[Click here for preview](https://libusoftcicom.github.io/lc-datepicker/)

# Description

- LC DatePicker is an Angular component that generates a datepicker calendar on your input element
- Compatible with Angular up to v16.0.0
- Only dependencies are RxJS and Font Awesome
- Customizable date format and language
- Can be configured as time, date-time, date, month or year picker

# Tested with

- Firefox (latest)
- Chrome (latest)
- Chromium (latest)
- Edge

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

  public config = new DatePickerConfig();
  public inputDate: DateTime;
  public CalendarOpened = false;
  public CalendarRangeOpened = false;

  constructor(
    private readonly dateAdapter: LCDatePickerAdapter,
    ...
  ) {

    // configuration is optional
    this.config.setCalendarType(ECalendarType.Date);
    this.config.setLocalization('en');
    this.inputDate = this.dateAdapter.now(this.config.getTimezone());
    ...
  }

  public setCalendarDate(dateTime: DateTime): void {
    this.dateInput.nativeElement.value = this.dateAdapter.toISOString(dateTime);
  }

  public toggleCalendarOpen(): void {
    this.CalendarOpened = !this.CalendarOpened;
    ...
  }
```

Use the following snippet inside your template for date-picker:

```shell
<lc-datepicker
   [value]="inputDate"
   [config]="config"
   *ngIf="CalendarOpened"
   (openedChange)="toggleCalendarOpen()"
   (dateChange)="setCalendarDate($event)">
 </lc-datepicker>
```

Use the following snippet inside your template for date-range-picker:

```shell
<lc-date-range-picker
   [valueFrom]="inputRangeDateFrom"
   [valueTo]="inputRangeDateTo"
   [config]="config"
   *ngIf="CalendarRangeOpened"
   (openedChange)="toggleCalendarRangeOpen()"
   (dateChange)="setCalendarDateRange($event)">
 </lc-date-range-picker> 
```

## DatePicker config parameters

- confirmLabel: string
- primaryColor: string
- fontColor: string
- setCalendarType(ECalendarType)
- setLocalization(string)
- setActivePanel(Panel)
- setTimeFormat(boolean)
- setTimezone(string)
- setMinDate(DateTime)
- setMaxDate(DateTime)
- setDisabledDates(DateTime[])
- addDisabledTimeRange(ITime)

## Developing

### Built With:

- Angular
- Font Awesome

### Setting up Dev

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

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

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

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

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

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
