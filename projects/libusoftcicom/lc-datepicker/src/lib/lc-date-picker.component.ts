import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { DatePickerConfig } from './lc-date-picker-config-helper';
import { Subscription } from 'rxjs';
import { DateTime } from './date-time.class';
import {DatePicker} from './date-picker.class';
import { Panel } from './base-date-picker.class';
import { LCDatePickerAdapter } from './lc-date-picker-adapter.class';
import {ECalendarType, ECalendarNavigation} from './enums';

@Component({
    selector: 'lc-datepicker',
    templateUrl: './lc-date-picker.component.html',
    styleUrls: ['./lc-date-picker.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCDatePickerComponent implements OnInit, AfterViewInit, OnDestroy {

    public activePanel: Panel;
    public selectedDateTime: DateTime;
    public calendarType: ECalendarType;

    private datePicker: DatePicker;

    @HostBinding('style.margin-top')
    public componentMargin;

    @HostBinding('attr.tabindex')
    public tabIndex = 0;

    @Input() public value: DateTime;
    @Input() public config: DatePickerConfig;
    @Output() public openedChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() public dateChange: EventEmitter<DateTime> = new EventEmitter<DateTime>();

    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly _elementRef: ElementRef,
        private readonly dateAdapter: LCDatePickerAdapter,
    ) {}

    public ngOnInit(): void {

        this.config.setHostElement(this._elementRef.nativeElement);
        this.initCalendar();
    }

    public ngAfterViewInit(): void {
        this._elementRef.nativeElement.focus();
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;

        this.cd.detach();
    }

    public getValue(): DateTime {
        return this.value;
    }

    public getSelectedDateTime(): DateTime {
        return this.selectedDateTime;
    }

    public onDayChanged(date: DateTime): void {
        this.selectedDateTime =
            this.calendarType === ECalendarType.Date
                ? date.clone()
                : this.dateAdapter.setParts(
                    this.selectedDateTime,
                    { year: date.getYear(), month: date.getMonth(), date: date.getDate() }
                );
    }

    public onMonthChanged(date: DateTime): void {
        this.selectedDateTime =
            this.calendarType === ECalendarType.MonthYear
                ? date.clone()
                : this.dateAdapter.setParts(
                    this.selectedDateTime,
                    { month: date.getMonth(), year: date.getYear() }
                );
    }

    public onYearChanged(date: DateTime): void {
        this.selectedDateTime =
            this.calendarType === ECalendarType.Year
                ? date.clone()
                : this.dateAdapter.setParts(this.selectedDateTime, { year: date.getYear() });
    }

    public onTimeChanged(time: DateTime): void {
        this.selectedDateTime =
            this.calendarType === ECalendarType.Time
                ? time.clone()
                : this.dateAdapter.setParts(
                    this.selectedDateTime,
                    { hour: time.getHour(), minute: time.getMinute() }
                );
    }

    public onDaySelected(date: DateTime): void {
        this.selectedDateTime = date.clone();

        if (this.calendarType > 1) {
            this.dateChange.emit(this.selectedDateTime);
            this.config.focus();
        }
        if (this.calendarType === ECalendarType.Date) {
            this.confirm();
        }
    }

    public onMonthSelected(date: DateTime): void {
        this.selectedDateTime =
            this.dateAdapter.setParts(this.selectedDateTime, {month: date.getMonth(), year: date.getYear()});

        if (this.calendarType > 1 && this.calendarType === ECalendarType.MonthYear) {
            this.dateChange.emit(this.selectedDateTime);
        }

        if (this.calendarType !== ECalendarType.MonthYear) {
            this.onSwitchPanel(Panel.Day);
        } else {
            this.confirm();
        }
    }

    public onYearSelected(date: DateTime): void {
        this.selectedDateTime = this.dateAdapter.setParts(this.selectedDateTime,{ year: date.getYear() });

        if (this.calendarType === ECalendarType.Year) {
            this.dateChange.emit(this.selectedDateTime);
        }
        if (this.calendarType !== ECalendarType.Year) {
            this.onSwitchPanel(Panel.Month);
        } else {
            this.confirm();
        }
    }

    public onSwitchPanel(panel: Panel): void {
        this.datePicker.setPanel(panel);
        this.activePanel = this.getActivePanel();
        this.cd.detectChanges();
        this.config.focus();
    }

    public onReset(): void {
        switch (this.calendarType) {
            case ECalendarType.Date:
                this.selectedDateTime = this.dateAdapter.today(this.config.getTimezone());
                break;
            case ECalendarType.DateTime:
            case ECalendarType.Time:
                this.selectedDateTime = this.dateAdapter.now(this.config.getTimezone());
                break;
            case ECalendarType.MonthYear:
                this.selectedDateTime = this.dateAdapter.getStartOfMonth(this.dateAdapter.today(this.config.getTimezone()));
                break;
            case ECalendarType.Year:
                this.selectedDateTime = this.dateAdapter.getStartOfYear(this.dateAdapter.today(this.config.getTimezone()));
                break;
            default:
                break;
        }
        this.cd.detectChanges();

        if (this.calendarType > 1) {
            this.confirm();
        }
    }

    public confirm(): void {
        this.dateChange.emit(this.selectedDateTime);
        this.openedChange.emit();
    }

    public close(): void {
        this.openedChange.emit();
    }

    private getActivePanel(): Panel {
        return this.datePicker.getActivePanel();
    }

    private initCalendar(): void {
        this.datePicker = new DatePicker(this.config);
        this.calendarType = this.datePicker.getCalendarType();
        this.datePicker.setActivePanel(this.calendarType);
        this.activePanel = this.getActivePanel();
        this.selectedDateTime =
            this.dateAdapter.setParts(this.value, {second: 0, millisecond: 0});

        this.subscriptions.push(this.config.navigationChanges.subscribe((dir) => this.navigation(dir)));
        this.subscriptions.push(
            this.datePicker.panelChanges.subscribe((type) => {
                this.activePanel = type;
                this.cd.detectChanges();
            })
        );
    }

    private navigation(dir: ECalendarNavigation): void {
        if (dir === ECalendarNavigation.Close) {
            this.close();
        }
    }

    private calendarSize(type: ECalendarType): number {
        let height = 5;
        if (this.calendarType <= 1) {
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
