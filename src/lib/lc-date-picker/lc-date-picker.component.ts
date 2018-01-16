import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    HostListener,
    HostBinding,
    ElementRef,
    OnInit,
    OnChanges
} from '@angular/core';
import { DatePickerConfig, ECalendarType } from './lc-date-picker-config-helper';
import moment from 'moment-es6';


export enum panels {
    Time,
    Day,
    Month,
    Year
}

@Component({
    moduleId: module.id,
    selector: 'lc-datepicker',
    template: `
    <div [ngSwitch]="activePanel" class="calendar" *ngIf="opened">
        <lc-year-picker
            *ngSwitchCase="3"
            [newDate]="newDate"
            (selected)="onYearSelected($event)"
            (reset)="onResetDate($event)"
            [config]="config"></lc-year-picker>

        <lc-month-picker
            *ngSwitchCase="2"
            [newDate]="newDate"
            (selected)="onMonthSelected($event)"
            (reset)="onResetDate($event)"
            [config]="config"
            (switchPannel)="onSwitchPannel($event)"></lc-month-picker>

        <lc-day-picker
            *ngSwitchCase="1"
            [newDate]="newDate"
            (selected)="onDaySelected($event)"
            (reset)="onResetDate($event)"
            [config]="config"
            (switchPannel)="onSwitchPannel($event)"></lc-day-picker>

        <lc-time-picker
            *ngSwitchCase="0"
            [config]="config"
            (selected)="onTimeSelected($event)"
            (reset)="onResetDate($event)"
            [newDate]="newDate" ></lc-time-picker>

        <div class="dateTimeToggle" *ngIf="config.CalendarType === 1">
            <lc-time-picker-compact
            [config]="config"
            (selected)="onTimeSelected($event)"
            [newDate]="newDate" ></lc-time-picker-compact>
        </div>

        <div class="confirmDate"  *ngIf="config.CalendarType <= 1" [style.background]="config.PrimaryColor">
            <button (click)="confirm()" >{{config.ConfirmLabel}}</button>
        </div>

    </div>
    <div class="calendarBackground" *ngIf="opened" (click)="close()"></div>
    `,
    styleUrls: ['./lc-date-picker.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCDatePickerComponent implements OnInit, OnChanges {

    public originalDate: moment.Moment;
    public newDate: moment.Moment;
    public activePanel: panels;
    public panels;
    public locale;

    @HostBinding('style.margin-top') componentMargin;

    @Input() opened: boolean;
    @Output() openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() config: DatePickerConfig;
    @Input() date: moment.Moment;
    @Output() dateChange: EventEmitter<string> = new EventEmitter<string>();

    constructor(private cd: ChangeDetectorRef,
        private _elementRef: ElementRef) {
        this.panels = panels;
    }

    ngOnInit() {
        this.initCalendar();
    }

    initCalendar() {
        let format = this.config.Format || ''
        this.locale = this.config.Localization || 'hr';
        moment.locale(this.locale);
        this.originalDate = !this.date || !moment(this.date, <string>format).isValid() ? moment().locale(this.locale) : moment(this.date, <string>format).locale(this.locale);
        this.newDate = !this.date || !moment(this.date, <string>format).isValid() ? moment().locale(this.locale) : moment(this.date, <string>format).locale(this.locale);
        this.setPanel(this.config.CalendarType);

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
            }
            else {
                this.componentMargin = this.calendarSize(this.config.CalendarType) *-1 + 'px';
            }
            this.initCalendar();
            this.cd.markForCheck();
        }
    }

    setPanel(panel: ECalendarType) {
        switch (panel) {
            case ECalendarType.DateTime: {
                this.activePanel = panels.Day;
                break;
            }
            case ECalendarType.Date: {
                this.activePanel = panels.Day;
                break;
            }
            case ECalendarType.MonthYear: {
                this.activePanel = panels.Month;
                break;
            }
            case ECalendarType.Year: {
                this.activePanel = panels.Year;
                break;
            }
            case ECalendarType.Time: {
                this.activePanel = panels.Time;
                break;
            }
        }
        this.cd.detectChanges();
    }

    onTimeSelected(date: moment.Moment) {
        this.newDate = date;
        // if(this.config.type !== 1){
        //     this.dateChange.emit(this.newDate.toISOString());
        // }
        if (this.config.CalendarType === ECalendarType.Time) {
            this.cd.markForCheck();
        }
    }

    onDaySelected(date: moment.Moment) {
        this.newDate = date;
        if (this.config.CalendarType > 1) {
            this.dateChange.emit(this.newDate.toISOString());
        }
        if (this.config.CalendarType === ECalendarType.Date) {
            this.confirm();
        }
    }

    onMonthSelected(date: moment.Moment) {
        this.newDate.month(date.month());
        if (this.config.CalendarType > 1 && this.config.CalendarType === ECalendarType.MonthYear) {
            this.dateChange.emit(this.newDate.toISOString());
        }
        if (this.config.CalendarType !== ECalendarType.MonthYear) {
            this.onSwitchPannel(panels.Day);
            this.cd.markForCheck();
        }
        else {
            this.confirm();
        }
    }

    onYearSelected(date: moment.Moment) {
        this.newDate = moment(moment.now()).year(date.year());
        if (this.config.CalendarType > 1 && this.config.CalendarType === ECalendarType.Year) {
            this.dateChange.emit(this.newDate.toISOString());
        }
        if (this.config.CalendarType !== ECalendarType.Year) {
            this.onSwitchPannel(panels.Month);
            this.cd.markForCheck();
        }
        else {
            this.confirm();
        }
    }

    onSwitchPannel(panel: panels) {
        this.activePanel = panel;
        this.cd.detectChanges();
    }

    onResetDate() {
        this.newDate = this.isDateAvailable( moment(moment.now()) );
        
         // this.dateChange.emit(moment(moment.now()).toISOString());
        if (this.config.CalendarType > 1) {
            this.confirm();
        }
        this.cd.markForCheck();
    }

    private isDateAvailable( date: moment.Moment ): moment.Moment {
        if( this.config.MinDate && this.config.MaxDate ){
            let minDate = moment( this.config.MinDate );
            let maxDate = moment( this.config.MaxDate );
            if( minDate.isSame( maxDate ) ) {
                return null;
            }
        }

        if( this.config.DisabledDates[ date.format('YYYY-MM-DD') ] ){
            return this.isDateAvailable( date.add(1, 'day') );
        }

        if( this.config.MinDate ){
            let minDate = moment( this.config.MinDate );

            if( date.isBefore( minDate ) ){
                return this.isDateAvailable( date.add(1, 'day') );
            }
        }

        if( this.config.MaxDate ){
            let maxDate = moment( this.config.MaxDate );

            if( date.isAfter( maxDate ) ){
                return this.isDateAvailable( date.subtract(1, 'day') );
            }
        }

        return date;
    }

    confirm() {
        this.openedChange.emit(false);
        this.dateChange.emit( this.config.Format ? moment(this.newDate.toISOString()).format(<string>this.config.Format ) : this.newDate.toISOString());
        this.opened = false;
    }

    close() {
        this.openedChange.emit(false);
        this.opened = false;
    }

    calendarSize(type: ECalendarType) {
        let height = 5;
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
