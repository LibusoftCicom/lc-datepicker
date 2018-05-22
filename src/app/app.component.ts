import { Component, ViewChild, ElementRef } from '@angular/core';
import { DatePickerConfig, ECalendarType, LCDatePickerComponent, IDisabledTimeRanges } from '@libusoftcicom/lc-datepicker';
import * as moment from 'moment';





@Component({
  selector: 'lc-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LC DatePicker';
  public year = new Date().getFullYear();
  public CalendarOpened = false;
  public config = new DatePickerConfig();
  private availableLocalizations: String[];

  public todayDateObject = moment(moment.now()).startOf('day');
  public randomDisabledDates = [];
  public disabledTimeRanges = [];

  public fromDateObject = moment(moment.now()).startOf('day').subtract(40, 'day').subtract(30, 'years').toObject();
  public toDateObject = moment(moment.now()).startOf('day').add(40, 'day').add(30, 'years').toObject();


  @ViewChild('calendar')
  calendar: LCDatePickerComponent;

  @ViewChild('dateInput')
  dateInput: ElementRef;

  constructor() {

    const today = this.todayDateObject.toObject();

    this.config.CalendarType = ECalendarType.Date;
    this.config.Localization = 'hr';
    this.config.MinDate = { years: this.fromDateObject.years, months: this.fromDateObject.months, date: this.fromDateObject.date };
    this.config.MaxDate = { years: this.toDateObject.years, months: this.toDateObject.months, date: this.toDateObject.date };

    this.generateRandDates();

    // define range of unavailable dates
    this.config.setDisabledDates(this.randomDisabledDates);
    // define range of unavailable time
    this.setDisabledTimeRanges();

    this.config.Labels = {
      confirmLabel: 'Ok',
    }

    this.config.PrimaryColor = '#5e666f';
    this.config.FontColor = '#5e666f';
  }

  private generateRandDates() {
    this.randomDisabledDates = Array(3).fill(null).map(() => {
      const rand = Math.random() * (15 - (-15)) + (-15);
      return moment(moment.now()).startOf('day').add(rand, 'day').format('YYYY-MM-DD');
    })

    this.randomDisabledDates.push(moment(moment.now()).format('YYYY-MM-DD'))
  }

  private setDisabledTimeRanges() {

    this.config.addDisabledTimeRange('00:00', '07:59');

    this.config.addDisabledTimeRange('14:00', '16:59');

    this.config.addDisabledTimeRange('21:00', '23:59');

  }

  public openCalendar() {
    this.CalendarOpened = !this.CalendarOpened;
  }

  public clearCalendar() {
    this.dateInput.nativeElement.value = '';
  }

  public get setDate() {
    return this.dateInput.nativeElement.value;
  }

  public set setDate(value) {
    this.dateInput.nativeElement.value = value;
  }


  public updateLocalization(value) {
    this.config.Localization = value;
  }

  public get CalendarType() {
    return this.config.CalendarType
  }

  public set CalendarType(value) {
    this.config.CalendarType = 1 * value;
  }
  public get Localization() {
    return this.config.Localization;
  }

  public set Localization(value) {
    this.config.Localization = value;
  }
  public get Format() {
    return this.config.Format;
  }

  public set Format(value) {
    this.config.Format = value;
    this.dateInput.nativeElement.value = '';
  }


  public get ConfirmLabel() {
    return this.config.ConfirmLabel;
  }

  public set ConfirmLabel(value) {
    this.config.ConfirmLabel = value;
  }


  public get PrimaryColor() {
    return this.config.PrimaryColor;
  }

  public set PrimaryColor(value) {
    this.config.PrimaryColor = value;
  }

  public get FontColor() {
    return this.config.ColorTheme.fontColor;
  }

  public set FontColor(value) {
    this.config.ColorTheme.fontColor = value;
  }

}
