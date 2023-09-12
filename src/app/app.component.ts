import { Component, ViewChild, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import {
  DatePickerConfig,
  ECalendarType,
  LCDatePickerComponent,
  IDisabledTimeRanges
} from '@libusoftcicom/lc-datepicker';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lc-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'LC DatePicker';
  public year = new Date().getFullYear();
  public CalendarOpened = false;
  public CalendarRangeOpened = false;
  public config: DatePickerConfig = new DatePickerConfig();
  private availableLocalizations: String[];

  public todayDateObject = moment(moment.now()).startOf('day');
  public randomDisabledDates = [];
  public disabledTimeRanges = [];

  public fromDateObject = moment(moment.now())
    .startOf('day')
    .subtract(40, 'day')
    .subtract(30, 'years')
    .toObject();
  public toDateObject = moment(moment.now())
    .startOf('day')
    .add(40, 'day')
    .add(30, 'years')
    .toObject();

  private subscription: Subscription;

  @ViewChild('calendar', { static: true })
  calendar: LCDatePickerComponent;

  @ViewChild('calendarRange', { static: true })
  calendarRange: LCDatePickerComponent;

  @ViewChild('dateInput', { static: true })
  dateInput: ElementRef;

  @ViewChild('dateRangeInput', { static: true })
  dateRangeInput: ElementRef;

  constructor(private renderer: Renderer2) {
    const today = this.todayDateObject.toObject();

    this.config.CalendarType = ECalendarType.Date;
    this.config.Localization = 'hr';
    this.config.MinDate = {
      years: this.fromDateObject.years,
      months: this.fromDateObject.months,
      date: this.fromDateObject.date
    };
    this.config.MaxDate = {
      years: this.toDateObject.years,
      months: this.toDateObject.months,
      date: this.toDateObject.date
    };

    this.generateRandDates();

    // define range of unavailable dates
    this.config.setDisabledDates(this.randomDisabledDates);
    // define range of unavailable time
    this.setDisabledTimeRanges();

    this.config.Labels = {
      confirmLabel: 'Ok'
    };

    this.config.PrimaryColor = '#5e666f';
    this.config.FontColor = '#5e666f';

    this.registerKeyNavigation();
  }

  public ngOnInit(): void {
    this.subscription = this.calendar.openedChange.subscribe(val => {
      if (!val) {
        this.dateInput.nativeElement.click();
        this.dateInput.nativeElement.select();
      }
    });
    this.subscription = this.calendarRange.openedChange.subscribe(val => {
      if (!val) {
        this.dateRangeInput.nativeElement.click();
        this.dateRangeInput.nativeElement.select();
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private generateRandDates() {
    this.randomDisabledDates = Array(3)
      .fill(null)
      .map(() => {
        const rand = Math.random() * (15 - -15) + -15;
        return moment(moment.now())
          .startOf('day')
          .add(rand, 'day')
          .format('YYYY-MM-DD');
      });
  }

  private setDisabledTimeRanges() {
    this.config.addDisabledTimeRange('00:00', '07:59');

    this.config.addDisabledTimeRange('14:00', '16:59');

    this.config.addDisabledTimeRange('21:00', '23:59');
  }

  public openCalendar() {
    this.CalendarOpened = !this.CalendarOpened;
  }
  public openCalendarRange() {
    this.CalendarRangeOpened = !this.CalendarRangeOpened;
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

  public get setDateRange() {
    return this.dateRangeInput.nativeElement.value;
  }

  public set setDateRange(value) {
    this.dateRangeInput.nativeElement.value = value;
  }

  public updateLocalization(value) {
    this.config.Localization = value;
  }

  public get CalendarType() {
    return this.config.CalendarType;
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

  public get FromLabel() {
    return this.config.FromLabel;
  }

  public set FromLabel(value) {
    this.config.FromLabel = value;
  }
  public get ToLabel() {
    return this.config.ToLabel;
  }

  public set ToLabel(value) {
    this.config.ToLabel = value;
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

  /**
   * demo implementation
   * keyboard navigation
   */
  private registerKeyNavigation(): void {
    this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
      if (this.config.isFocused()) {
        event.preventDefault();

        if (event.keyCode == 39 && event.shiftKey) {
          this.changePanelType(1);
        }

        if (event.keyCode == 37 && event.shiftKey) {
          this.changePanelType(-1);
        }

        if (event.keyCode == 38) {
          this.config.navigateUp();
        }
        if (event.keyCode == 40) {
          this.config.navigateDown();
        }

        if (event.keyCode == 39 && !event.shiftKey) {
          this.config.navigateRight();
        }

        if (event.keyCode == 37 && !event.shiftKey) {
          this.config.navigateLeft();
        }

        if (event.keyCode == 13) {
          this.config.confirm();
        }

        if (event.keyCode == 27) {
          this.config.close();
        }

        if (event.keyCode == 34) {
          this.config.nextPage();
        }
        if (event.keyCode == 33) {
          this.config.previousPage();
        }
      }
    });
  }

  /**
   * just for demo
   */
  private changePanelType(jump: number) {
    let calendarKeys = Object.keys(ECalendarType).filter(val => isNaN(parseInt(val)));
    let currentIndex = calendarKeys.findIndex(type => this.config.CalendarType == ECalendarType[type]);

    if (currentIndex + jump < calendarKeys.length && currentIndex + jump >= 0) {
      this.config.CalendarType = ECalendarType[calendarKeys[currentIndex + jump]];
    } else if (currentIndex + jump >= calendarKeys.length) {
      this.config.CalendarType = ECalendarType[calendarKeys[0]];
    } else {
      this.config.CalendarType = ECalendarType[calendarKeys[calendarKeys.length - 1]];
    }
  }
}
