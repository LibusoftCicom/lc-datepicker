import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, NgZone, Renderer2
} from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import {DateTime} from '../date-time.class';
import {TimePicker} from './time-picker.class';
import {fromEvent, Subscription} from 'rxjs';

@Component({
    selector: 'lc-time-picker',
    templateUrl: 'time-picker.component.html',
    styleUrls: ['./time-picker.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TimePicker]
})
export class LCTimePickerComponent implements OnInit, AfterViewInit, OnDestroy {

    public is24HourFormat: boolean;
    public formattedHour: string;
    public formattedMinute: string;
    public formattedAMPM: string;

    private _value: DateTime;

    private readonly subscriptions: Subscription[] = [];
    private readonly meridiemSubscriptions: Subscription[] = [];

    @Input() public set value(dateTime: DateTime) {
        this._value = dateTime.clone();
        this.timePicker.setSelectedTime(this._value);
    };
    @Input() public config: DatePickerConfig;
    @Output() public timeChanged: EventEmitter<DateTime> = new EventEmitter<DateTime>();
    @Output() public reset: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('timePicker', { static: true })
    public timePickerElement: ElementRef<HTMLTableElement>;

    @ViewChild('header', { static: true })
    public headerElement: ElementRef<HTMLTableCellElement>;

    @ViewChild('reset', { static: true })
    public resetElement: ElementRef<HTMLDivElement>;

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly timePicker: TimePicker,
        private readonly ngZone: NgZone,
        private readonly renderer: Renderer2,
    ) {}

    public ngOnInit(): void {
        this.subscriptions.push(
            this.timePicker.getCalendarChanges().subscribe(() => {
                this.is24HourFormat = this.timePicker.is24HourFormat();
                this.formattedHour = this.timePicker.getFormattedHour();
                this.formattedMinute = this.timePicker.getFormattedMinute();
                this.formattedAMPM = this.timePicker.getFormattedAMPM();

                this.cd.detectChanges();

                this.setStyles();
                this.timeChanged.emit(this.timePicker.getSelectedDateTime());
            })
        );

        this.initializeCalendar();
    }

    public ngAfterViewInit(): void {

        this.setStyles();
        this.ngZone.runOutsideAngular(() => this.registerViewEvents());
    }

    public ngOnDestroy(): void {

        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions.length = 0;
        this.meridiemSubscriptions.forEach(sub => sub.unsubscribe());
        this.meridiemSubscriptions.length = 0;

        this.cd.detach();
    }

    public getValue(): DateTime {
        return this.timePicker.getSelectedDateTime();
    }

    public setTimeFormat(): void {
        this.is24HourFormat = this.config.is24HourFormat();
    }

    public addHour(): void {
        this.timePicker.addHour();
    }

    public subtractHour(): void {
        this.timePicker.subtractHour();
    }

    public addMinute(): void {
        this.timePicker.addMinute();
    }

    public subtractMinute(): void {
        this.timePicker.subtractMinute();
    }

    public hourScroll(event: WheelEvent): void {

        event.preventDefault();
        event.stopPropagation();
        if (event.deltaY < 0) {
            this.addHour();
        }
        if (event.deltaY > 0) {
            this.subtractHour();
        }
    }

    public minuteScroll(event: WheelEvent): void {

        event.preventDefault();
        event.stopPropagation();
        if (event.deltaY < 0) {
            this.addMinute();
        }
        if (event.deltaY > 0) {
            this.subtractMinute();
        }
    }

    public resetTime(): void {
        this.reset.emit();
    }

    public toggleMeridiem(): void {
        this.timePicker.toggleMeridiem();
    }

    public scrollMeridiem(event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.toggleMeridiem();
    }

    private setStyles(): void {

        this.renderer
            .setStyle(this.timePickerElement.nativeElement.tHead, 'background', this.config.theme.primaryColor);
        this.renderer
            .setStyle(this.timePickerElement.nativeElement.tBodies[0], 'color', this.config.theme.fontColor);
        this.renderer
            .setAttribute(this.headerElement.nativeElement, 'colspan', this.is24HourFormat ? '3' : '4');
    }

    private registerViewEvents() {

        this.subscriptions.push(
            fromEvent<PointerEvent>(this.resetElement.nativeElement, 'click')
                .subscribe(() => this.resetTime())
        );
    }

    private initializeCalendar(): void {

        this.timePicker.setLocale(this.config.getLocalization());
        this.timePicker.setTimezone(this.config.getTimezone());
        this.timePicker.setDisabledTimeRanges(this.config.getDisabledTimeRanges());
        this.is24HourFormat = this.config.is24HourFormat();
        this.timePicker.setTimeFormat(this.is24HourFormat);
    }
}
