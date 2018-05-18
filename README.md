![Logo of the project](https://raw.githubusercontent.com/LibusoftCicom/lc-datepicker/master/src/assets/logo.png)

# LC DatePicker
> Pure Angular date and time picker component.



[![npm version](https://badge.fury.io/js/%40libusoftcicom%2Flc-datepicker.svg)](https://www.npmjs.com/package/@libusoftcicom/lc-datepicker)

[![Build Status](https://travis-ci.org/LibusoftCicom/lc-datepicker.svg?branch=master)](https://travis-ci.org/LibusoftCicom/lc-datepicker)


# Demo

[Click here for preview](https://libusoftcicom.github.io/lc-datepicker/)


# Description

- LC DatePicker is an Angular component that generates a datepicker calendar on your input element
- Compatible with Angular 2+ up to Angular v6.0.0
- Only dependency is MomentJS and Font Awesome
- Customizable date format and language
- Can be configured as time, date-time, date, month or year picker


# Tested with

- Firefox (latest)
- Chrome (latest)
- Chromium (latest)
- Edge
- IE11

## Installing / Getting started


```shell
npm install @libusoftcicom/lc-datepicker
```

skip this if SystemJS is not used as module loader:
```shell
System.config({
  paths: {
    'npm:': 'node_modules/'
  },
  map: {
    '@libusoftcicom/lc-datepicker' : 'npm:@libusoftcicom/lc-datepicker/bundles/lc-datepicker.umd'
  }
})
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
    ,LcDatePickerModule
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

  private dateValue: string = null;
  public config = new DatePickerConfig();
  public CalendarOpened: boolean = false;

  constructor() {

    // configuration is optional
    this.config.CalendarType = ECalendarType.Date;
    this.config.Localization = 'en';
    ...
  }

  public get Date() {
    return this.dateValue;
  }

  public set Date(value: string) {
    this.dateValue = value;
  }

}
```

Use the following snippet inside your template:
```shell
<lc-datepicker [(opened)]="CalendarOpened" [config]="config" [(date)]="Date"></lc-datepicker>
```
## DatePicker config parameters

* CalendarType: ECalendarType
* Localization: String
* MaxYear: Number
* MinYear: Number
* MaxMonth: Number
* MinMonth: Number
* MaxDay: Number
* MinDay: Number
* ConfirmLabel: String
* PrimaryColor: String
* FontColor: String
* Format: Moment.MomentInput
* setDisabledDates( Array<Moment.MomentInput> )
* addDisabledTimeRange( start<Moment.MomentInput>, stop<Moment.MomentInput> )</li>


## Developing

### Built With:
- Angular
- MomentJS
- Font Awesome

### Setting up Dev

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.2.

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

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.2.


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

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.3.


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