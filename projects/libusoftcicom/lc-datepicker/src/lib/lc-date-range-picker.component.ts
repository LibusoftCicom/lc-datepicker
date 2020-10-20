import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  HostBinding,
  ElementRef,
  OnInit,
  OnChanges,
  OnDestroy
} from '@angular/core';
import { DatePickerConfig, ECalendarType, ECalendarNavigation } from './lc-date-picker-config-helper';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { panels } from './lc-date-picker.component';

export enum DateType {
  From,
  To
}

@Component({
  selector: 'lc-date-range-picker',
  template: `
    <div [ngSwitch]="activePanelFrom" class="calendar" *ngIf="opened">
      <div class="dateRangeLabel" [style.background]="config.PrimaryColor" *ngIf="opened">
        {{ config.FromLabel }}
      </div>
      <lc-year-picker
        *ngSwitchCase="3"
        [newDate]="newDateFrom"
        (selected)="onYearSelected(DateType.From, $event)"
        (reset)="onResetDate(DateType.From)"
        [config]="config"
      ></lc-year-picker>

      <lc-month-picker
        *ngSwitchCase="2"
        [newDate]="newDateFrom"
        (selected)="onMonthSelected(DateType.From, $event)"
        (reset)="onResetDate(DateType.From)"
        [config]="config"
        (switchPannel)="onSwitchPannel(DateType.From, $event)"
      ></lc-month-picker>

      <lc-day-picker
        *ngSwitchCase="1"
        [newDate]="newDateFrom"
        (selected)="onDaySelected(DateType.From, $event)"
        (reset)="onResetDate(DateType.From)"
        [config]="config"
        (switchPannel)="onSwitchPannel(DateType.From, $event)"
      ></lc-day-picker>
    </div>
    <div [ngSwitch]="activePanelTo" class="calendar" *ngIf="opened">
      <div class="dateRangeLabel" [style.background]="config.PrimaryColor" *ngIf="opened">
        {{ config.ToLabel }}
      </div>
      <lc-year-picker
        *ngSwitchCase="3"
        [newDate]="newDateTo"
        (selected)="onYearSelected(DateType.To, $event)"
        (reset)="onResetDate(DateType.To)"
        [config]="config"
      ></lc-year-picker>

      <lc-month-picker
        *ngSwitchCase="2"
        [newDate]="newDateTo"
        (selected)="onMonthSelected(DateType.To, $event)"
        (reset)="onResetDate(DateType.To)"
        [config]="config"
        (switchPannel)="onSwitchPannel(DateType.To, $event)"
      ></lc-month-picker>

      <lc-day-picker
        *ngSwitchCase="1"
        [newDate]="newDateTo"
        (selected)="onDaySelected(DateType.To, $event)"
        (reset)="onResetDate(DateType.To)"
        [config]="config"
        (switchPannel)="onSwitchPannel(DateType.To, $event)"
      ></lc-day-picker>
    </div>
    <div class="confirmDate" [style.background]="config.PrimaryColor" *ngIf="opened">
      <button (click)="confirm()">{{ config.ConfirmLabel }}</button>
    </div>
    <div class="calendarBackground" *ngIf="opened" (click)="close()"></div>
  `,
  styleUrls: ['./lc-date-range-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCDateRangePickerComponent implements OnInit, OnChanges, OnDestroy {
  public originalDateFrom: moment.Moment;
  public originalDateTo: moment.Moment;
  public activePanelFrom: panels;
  public activePanelTo: panels;

  public newDateFrom: moment.Moment;
  public newDateTo: moment.Moment;
  public DateType: typeof DateType = DateType;

  public panels;
  public locale;

  @HostBinding('style.margin-top') componentMargin;

  @HostBinding('attr.tabindex')
  public tabIndex = 0;

  @Input() opened: boolean;
  @Input() config: DatePickerConfig;
  @Input() date: string;
  @Output() openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dateChange: EventEmitter<string> = new EventEmitter<string>();

  private subscriptions: Array<Subscription> = [];

  constructor(private cd: ChangeDetectorRef, private _elementRef: ElementRef) {
    this.panels = panels;
  }

  ngOnInit() {
    this.config.setHostElement(this._elementRef.nativeElement);
    this.initCalendar();
  }

  initCalendar() {
    const format = this.config.Format || '';
    const dateArray = this.date.split('/');
    let dateFromString, dateTotring;
    if (dateArray && dateArray.length === 2) {
      [dateFromString, dateTotring] = this.date.split('/');
    } else {
      dateFromString = '';
      dateTotring = '';
    }
    if (this.config.CalendarType === ECalendarType.DateTime || this.config.CalendarType === ECalendarType.Time) {
      this.config.CalendarType = ECalendarType.Date;
    }
    this.locale = this.config.Localization || 'hr';
    moment.locale(this.locale);

    this.originalDateFrom = dateFromString ? this.initDate(dateFromString, <string>format) : null;
    this.originalDateTo = dateTotring ? this.initDate(dateTotring, <string>format) : null;

    this.originalDateFrom = this.isDateAvailable(this.originalDateFrom);
    this.originalDateTo = this.isDateAvailable(this.originalDateTo);

    this.newDateFrom = dateFromString ? this.initDate(dateFromString, <string>format) : null;
    this.newDateTo = dateTotring ? this.initDate(dateTotring, <string>format) : null;

    this.newDateFrom = this.isDateAvailable(this.newDateFrom);
    this.newDateTo = this.isDateAvailable(this.newDateTo);

    this.setPanel(this.config.CalendarType);
    this.setPanel2(this.config.CalendarType);

    if (moment(this.config.MaxDate).diff(moment(this.config.MinDate), 'days') < 1) {
      this.config.MinDate = this.config.DefaultMinDate;
      this.config.MaxDate = this.config.DefaultMaxDate;
      throw Error('Invalid min/max date. Max date should be at least 1 day after min date');
    }

    this.subscriptions.push(this.config.navigationChanges.subscribe(dir => this.navigation(dir)));
    this.subscriptions.push(this.config.panelChanges.subscribe(type => this.setPanel(type)));

    this._elementRef.nativeElement.focus();
  }

  private initDate(date: string, format: string) {
    return !date || !moment(date, format).isValid()
      ? moment().locale(this.locale)
      : moment(date, format).locale(this.locale);
  }

  ngOnChanges(changes) {
    if (changes.date) {
      this.cd.markForCheck();
    }
    if (changes.opened && changes.opened.currentValue === true) {
      const windowHeight = window.innerHeight;
      const componentPosition = this._elementRef.nativeElement.parentNode.getBoundingClientRect();
      if (windowHeight - componentPosition.top > this.calendarSize(this.config.CalendarType)) {
        this.componentMargin = 0;
      } else {
        this.componentMargin = this.calendarSize(this.config.CalendarType) * -1 + 'px';
      }
      this.initCalendar();
      this.cd.markForCheck();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.length = 0;
  }

  private navigation(dir: ECalendarNavigation): void {
    if (dir === ECalendarNavigation.Close) {
      this.close();
    }
    if (dir === ECalendarNavigation.Confirm) {
      this.confirm();
    }
  }

  private setPanel(panel: ECalendarType) {
    switch (panel) {
      case ECalendarType.DateTime: {
        this.activePanelFrom = panels.Day;
        break;
      }
      case ECalendarType.Date: {
        this.activePanelFrom = panels.Day;
        break;
      }
      case ECalendarType.MonthYear: {
        this.activePanelFrom = panels.Month;
        break;
      }
      case ECalendarType.Year: {
        this.activePanelFrom = panels.Year;
        break;
      }
      case ECalendarType.Time: {
        this.activePanelFrom = panels.Time;
        break;
      }
    }
    this.cd.detectChanges();
  }
  private setPanel2(panel: ECalendarType) {
    switch (panel) {
      case ECalendarType.DateTime: {
        this.activePanelTo = panels.Day;
        break;
      }
      case ECalendarType.Date: {
        this.activePanelTo = panels.Day;
        break;
      }
      case ECalendarType.MonthYear: {
        this.activePanelTo = panels.Month;
        break;
      }
      case ECalendarType.Year: {
        this.activePanelTo = panels.Year;
        break;
      }
      case ECalendarType.Time: {
        this.activePanelTo = panels.Time;
        break;
      }
    }
    this.cd.detectChanges();
  }

  private emitDateChange() {
    this.dateChange.emit(
      this.config.Format
        ? [
            this.newDateFrom ? moment(this.newDateFrom.toISOString()).format(<string>this.config.Format) : '',
            this.newDateTo ? moment(this.newDateTo.toISOString()).format(<string>this.config.Format) : ''
          ].join('/')
        : [
            this.newDateFrom ? this.newDateFrom.toISOString() : '',
            this.newDateTo ? this.newDateTo.toISOString() : ''
          ].join('/')
    );
  }

  public onDaySelected(type: DateType, date: moment.Moment) {
    switch (type) {
      case DateType.From:
        if (this.newDateFrom && date.format('L') === this.newDateFrom.format('L')) {
          this.newDateFrom = null;
        } else {
          this.newDateFrom = date;
        }
        break;
      case DateType.To:
        if (this.newDateTo && date.format('L') === this.newDateTo.format('L')) {
          this.newDateTo = null;
        } else {
          this.newDateTo = date;
        }
        break;
    }

    if (this.config.CalendarType > 1) {
      this.emitDateChange();
      this.config.focus();
    }
  }

  public onMonthSelected(type: DateType, date: moment.Moment) {
    switch (type) {
      case DateType.From:
        this.newDateFrom = this.newDateFrom.month(date.month());
        break;
      case DateType.To:
        this.newDateTo = this.newDateTo.month(date.month());
        break;
    }
    if (this.config.CalendarType > 1 && this.config.CalendarType === ECalendarType.MonthYear) {
      this.emitDateChange();
    }
    if (this.config.CalendarType !== ECalendarType.MonthYear) {
      this.onSwitchPannel(type, panels.Day);
    }
  }

  public onYearSelected(type: DateType, date: moment.Moment) {
    switch (type) {
      case DateType.From:
        this.newDateFrom = moment(moment.now()).year(date.year());
        break;
      case DateType.To:
        this.newDateTo = moment(moment.now()).year(date.year());
        break;
    }
    if (this.config.CalendarType > 1 && this.config.CalendarType === ECalendarType.Year) {
      this.emitDateChange();
    }
    if (this.config.CalendarType !== ECalendarType.Year) {
      this.onSwitchPannel(type, panels.Month);
    }
  }

  public onSwitchPannel(type: DateType, panel: panels) {
    this.cd.markForCheck();
    switch (type) {
      case DateType.From:
        this.activePanelFrom = panel;
        break;
      case DateType.To:
        this.activePanelTo = panel;
        break;
    }
    this.cd.detectChanges();
    this.config.focus();
  }

  public onResetDate(type: DateType) {
    switch (type) {
      case DateType.From:
        this.newDateFrom = this.isDateAvailable(moment(moment.now()));
        break;
      case DateType.To:
        this.newDateTo = this.isDateAvailable(moment(moment.now()));
        break;
    }
    this.cd.markForCheck();
  }

  private isDateAvailable(date: moment.Moment): moment.Moment {
    if (!date) {
      return null;
    }
    if (this.config.MinDate && this.config.MaxDate) {
      const minDate = moment(this.config.MinDate);
      const maxDate = moment(this.config.MaxDate);
      if (minDate.isSame(maxDate)) {
        return null;
      }
    }

    if (this.config.DisabledDates[date.format('YYYY-MM-DD')]) {
      return this.isDateAvailable(date.add(1, 'day'));
    }

    if (this.config.MinDate) {
      const minDate = moment(this.config.MinDate);

      if (date.isBefore(minDate)) {
        return this.isDateAvailable(minDate);
      }
    }

    if (this.config.MaxDate) {
      const maxDate = moment(this.config.MaxDate);

      if (date.isAfter(maxDate)) {
        return this.isDateAvailable(maxDate);
      }
    }

    return date;
  }

  public confirm() {
    this.openedChange.emit(false);
    this.opened = false;
    this.emitDateChange();
    this.cd.detectChanges();
  }

  public close() {
    this.openedChange.emit(false);
    this.opened = false;
    this.cd.detectChanges();
  }

  private calendarSize(type: ECalendarType) {
    let height = 32;
    if (this.config.CalendarType <= 1) {
      height += 20;
    }
    switch (type) {
      case ECalendarType.DateTime: {
        height += 280;
        break;
      }
      case ECalendarType.Date:
      case ECalendarType.MonthYear:
      case ECalendarType.Year: {
        height += 240;
        break;
      }
      case ECalendarType.Time: {
        height += 140;
        break;
      }
    }
    return height;
  }
}
