import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnInit,
    ViewChild, ElementRef, AfterViewInit, OnDestroy, Renderer2
} from '@angular/core';
import {DatePickerConfig} from '../lc-date-picker-config-helper';
import {DateTime} from '../date-time.class';
import {TimePicker} from '../time-picker/time-picker.class';
import {Subscription} from 'rxjs';



@Component({
	selector: 'lc-time-picker-compact',
	templateUrl: './time-picker-compact.component.html',
	styleUrls: ['./time-picker-compact.component.style.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TimePicker],
})
export class LCTimePickerCompactComponent implements OnInit, AfterViewInit, OnDestroy {
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

	@ViewChild('timePicker', { static: true })
	public timePickerElement: ElementRef<HTMLTableElement>;

	constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly timePicker: TimePicker,
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
	}

	public ngOnDestroy(): void {

        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions.length = 0;
        this.meridiemSubscriptions.forEach(sub => sub.unsubscribe());
        this.meridiemSubscriptions.length = 0;

        this.cd.detach();
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

	public toggleMeridiem(): void {
        this.timePicker.toggleMeridiem();
	}

	public scrollMeridiem(event: Event): void {

        event.preventDefault();
        event.stopPropagation();

        this.toggleMeridiem();
	}

	public setTimeFormat(): void {
        this.is24HourFormat = this.config.is24HourFormat();
	}

    private setStyles(): void {

        this.renderer
            .setStyle(this.timePickerElement.nativeElement.tBodies[0], 'color', this.config.theme.fontColor);
    }

    private initializeCalendar(): void {

        this.timePicker.setLocale(this.config.getLocalization());
        this.timePicker.setTimezone(this.config.getTimezone());
        this.timePicker.setDisabledTimeRanges(this.config.getDisabledTimeRanges());
        this.is24HourFormat = this.config.is24HourFormat();
        this.timePicker.setTimeFormat(this.is24HourFormat);
    }
}
