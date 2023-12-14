import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component, ElementRef,
	EventEmitter,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Output, QueryList, Renderer2, ViewChild, ViewChildren,
} from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import {fromEvent, Subscription} from 'rxjs';
import {DayPicker} from './day-picker.class';
import {DateTime} from '../date-time.class';
import {ICalendarItem, Panel} from '../base-date-picker.class';
import {ECalendarNavigation} from '../enums';

@Component({
	selector: 'lc-day-picker',
	templateUrl: 'day-picker.component.html',
	styleUrls: ['./day-picker.component.style.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [DayPicker],
})
export class LCDayPickerComponent implements OnInit, AfterViewInit, OnDestroy {

	public formattedMonth: string;
	public formattedYear: string;
	public shortDaysOfWeek: string[];
	public calendarData: ICalendarItem[][];

	private _value: DateTime;

	private readonly subscriptions: Subscription[] = [];
	private navigationSubscription: Subscription;

	@Input() public set value(dateTime: DateTime) {
		this._value = dateTime.clone();
		this.datePicker.setSelectedDate(this._value);
	};
	@Input() public config: DatePickerConfig;
	@Output() public selected: EventEmitter<DateTime> = new EventEmitter<DateTime>();
	@Output() public switchPanel: EventEmitter<Panel> = new EventEmitter<Panel>();
	@Output() public dateChanged: EventEmitter<DateTime> = new EventEmitter<DateTime>();
	@Output() public reset: EventEmitter<void> = new EventEmitter<void>();

	@ViewChild('dayPicker', { static: true })
	public dayPickerElement: ElementRef<HTMLTableElement>;

	@ViewChild('previousMonthButton', { static: true })
	public previousMonthButtonElement: ElementRef<HTMLButtonElement>;

	@ViewChild('nextMonthButton', { static: true })
	public nextMonthButtonElement: ElementRef<HTMLButtonElement>;

	@ViewChild('reset', { static: true })
	public resetElement: ElementRef<HTMLDivElement>;

	@ViewChild('monthPanel', { static: true })
	public monthPanelElement: ElementRef<HTMLDivElement>;

	@ViewChild('yearPanel', { static: true })
	public yearPanelElement: ElementRef<HTMLDivElement>;

	@ViewChildren('itemButtons', { read: ElementRef })
	public itemButtonElements: QueryList<ElementRef>;

	@ViewChildren('daysOfWeek', { read: ElementRef })
	public daysOfWeekElements: QueryList<ElementRef>;

	constructor(
		private readonly cd: ChangeDetectorRef,
		private readonly datePicker: DayPicker,
		private readonly ngZone: NgZone,
		private readonly renderer: Renderer2,
	) {}

	public ngOnInit(): void {

		this.navigationSubscription =
			this.config.navigationChanges.subscribe((dir) => this.navigate(dir));
		this.subscriptions.push(
			this.datePicker.getCalendarChanges().subscribe(() => {
				this.shortDaysOfWeek = this.datePicker.getShortDaysOfWeek();
				this.calendarData = this.datePicker.getCalendarData();
				this.formattedMonth = this.datePicker.getFormattedMonth();
				this.formattedYear = this.datePicker.getFormattedYear();

				this.cd.detectChanges();

				this.setStyles();
                this.dateChanged.emit(this.datePicker.getSelectedDateTime());
			})
		);
		this.initializeCalendar();
	}

	public ngAfterViewInit(): void {

		this.setStyles();

		this.ngZone.runOutsideAngular(() => this.registerViewEvents());
	}

	public ngOnDestroy(): void {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
		this.subscriptions.length = 0;

		this.navigationSubscription.unsubscribe();
		this.cd.detach();
	}

	public getDayPicker(): DayPicker {
		return this.datePicker;
	}

	public getValue(): DateTime {
		return this.datePicker.getSelectedDateTime();
	}

	public nextMonth(): void {
		this.datePicker.nextMonth();
	}

	public previousMonth(): void {
		this.datePicker.previousMonth();
	}

	public selectItem(item: ICalendarItem): void {

		if (!item || item.disabled) {
			return;
		}

		this.datePicker.selectItem(item);
		this.datePicker.setCalendarData(this.datePicker.formatCalendarData());
		this.selected.emit(this.datePicker.getSelectedDateTime());
	}

	public monthScroll(event: WheelEvent): void {
		event.preventDefault();
		event.stopPropagation();
		if (event.deltaY < 0) {
			this.nextMonth();
		}
		if (event.deltaY > 0) {
			this.previousMonth();
		}
	}

	public switchPanels(panel: Panel): void {
        this.dateChanged.emit(this.datePicker.getSelectedDateTime());
		this.switchPanel.emit(panel);
	}

	public resetDate(): void {
		this.reset.emit();
	}

	private navigate(dir: ECalendarNavigation): void {
        switch (dir) {
            case ECalendarNavigation.PageDown:
                this.previousMonth();
                break;
            case ECalendarNavigation.PageUp:
                this.nextMonth();
                break;
            case ECalendarNavigation.Confirm:
                this.datePicker.setCalendarData(this.datePicker.formatCalendarData());
                break;
            case ECalendarNavigation.Left:
                this.datePicker.previousDate();
                break;
            case ECalendarNavigation.Right:
                this.datePicker.nextDate();
                break;
            case ECalendarNavigation.Up:
                this.datePicker.previousWeek();
                break;
            case ECalendarNavigation.Down:
                this.datePicker.nextWeek();
                break;
            default:
                break;
        }
	}

    private initializeCalendar(): void {

        this.datePicker.setLocale(this.config.getLocalization());
        this.datePicker.setTimezone(this.config.getTimezone());
        this.datePicker.initializeDaysOfWeek();
        this.datePicker.setCalendarBoundaries(this.config.getMinDate(), this.config.getMaxDate());
        this.datePicker.setDisabledDates(this.config.getDisabledDates());
		this.datePicker.setSelectedDate(this._value);
    }

	private registerViewEvents(): void {

		this.subscriptions.push(
			fromEvent<WheelEvent>(this.dayPickerElement.nativeElement, 'wheel')
                .subscribe((event) => this.monthScroll(event))
		);

		this.subscriptions.push(
			fromEvent<PointerEvent>(this.previousMonthButtonElement.nativeElement, 'click')
                .subscribe(() => {
					this.previousMonth();
					this.config.focus();
				})
		);

		this.subscriptions.push(
			fromEvent<PointerEvent>(this.nextMonthButtonElement.nativeElement, 'click')
                .subscribe(() =>{
					this.nextMonth();
					this.config.focus();
				})
		);

		this.subscriptions.push(
			fromEvent<PointerEvent>(this.resetElement.nativeElement, 'click')
                .subscribe(() => this.resetDate())
		);

		this.subscriptions.push(
			fromEvent<PointerEvent>(this.monthPanelElement.nativeElement, 'click')
                .subscribe(() => this.switchPanels(Panel.Month))
		);

		this.subscriptions.push(
			fromEvent<PointerEvent>(this.yearPanelElement.nativeElement, 'click')
                .subscribe(() => this.switchPanels(Panel.Year))
		);
	}

	private setStyles(): void {
		this.renderer
            .setStyle(this.dayPickerElement.nativeElement.tHead, 'background', this.config.theme.primaryColor);

		this.daysOfWeekElements.forEach((e) =>
			this.renderer.setStyle(e.nativeElement, 'color', this.config.theme.fontColor)
		);

		this.itemButtonElements.forEach((e) =>
			this.renderer.setStyle(e.nativeElement, 'color', this.config.theme.fontColor)
		);
	}
}
