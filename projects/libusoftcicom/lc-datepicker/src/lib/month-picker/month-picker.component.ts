import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy, ViewChild, ElementRef, AfterViewInit, NgZone, Renderer2,
} from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import {fromEvent, Subscription} from 'rxjs';
import {ICalendarItem, Panel} from '../base-date-picker.class';
import {DateTime} from '../date-time.class';
import {MonthPicker} from './month-picker.class';
import {ECalendarNavigation} from '../enums';

@Component({
  selector: 'lc-month-picker',
  templateUrl: 'month-picker.component.html',
  styleUrls: ['./month-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MonthPicker],
})
export class LCMonthPickerComponent implements OnInit, AfterViewInit, OnDestroy {

    public formattedYear: string;
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
    @Output() public dateChanged: EventEmitter<DateTime> = new EventEmitter<DateTime>();
    @Output() public switchPanel: EventEmitter<Panel> = new EventEmitter<Panel>();
    @Output() public reset: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('monthPicker', { static: true })
    public monthPickerElement: ElementRef<HTMLTableElement>;

    @ViewChild('reset', { static: true })
    public resetElement: ElementRef<HTMLDivElement>;

    @ViewChild('yearPanel', { static: true })
    public yearPanelElement: ElementRef<HTMLDivElement>;

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly datePicker: MonthPicker,
        private readonly ngZone: NgZone,
        private readonly renderer: Renderer2,
    ) {}

    public ngOnInit(): void {

        this.navigationSubscription = this.config.navigationChanges.subscribe(dir => this.navigate(dir));
        this.subscriptions.push(
            this.datePicker.getCalendarChanges().subscribe(() => {
                this.calendarData = this.datePicker.getCalendarData();
                this.formattedYear = this.datePicker.getFormattedYear();

                this.cd.detectChanges();

                this.setStyles();
                this.dateChanged.emit(this.datePicker.getSelectedDateTime())
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

		if (this.navigationSubscription) {
			this.navigationSubscription.unsubscribe();
		}
        this.cd.detach();
    }

    public getValue(): DateTime {
        return this.datePicker.getSelectedDateTime();
    }

    public nextYear(): void {
        this.datePicker.nextYear();
    }

    public previousYear(): void {
        this.datePicker.previousYear();
    }

    public selectItem(item?: ICalendarItem): void {

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
            this.nextYear();
        }
        if (event.deltaY > 0) {
            this.previousYear();
        }
    }

    public switchPanels(panel: Panel): void {
        this.value = this.datePicker.getSelectedDateTime();
        this.switchPanel.emit(panel);
    }

    public resetDate(): void {
        this.reset.emit();
    }

    private navigate(dir: ECalendarNavigation): void {
        if (dir === ECalendarNavigation.PageDown) {
            this.previousYear();
        } else if (dir === ECalendarNavigation.PageUp) {
            this.nextYear();
        } else if (dir === ECalendarNavigation.Confirm) {
            this.datePicker.setCalendarData(this.datePicker.formatCalendarData());
        } else if (dir === ECalendarNavigation.Left) {
            this.datePicker.previousMonth();
        } else if (dir === ECalendarNavigation.Right) {
            this.datePicker.nextMonth();
        } else if (dir === ECalendarNavigation.Up) {
            this.datePicker.previousRow();
        } else if (dir === ECalendarNavigation.Down) {
            this.datePicker.nextRow();
        }
    }

    private initializeCalendar(): void {
        this.datePicker.setLocale(this.config.getLocalization());
        this.datePicker.setTimezone(this.config.getTimezone());
        this.datePicker.setCalendarBoundaries(this.config.getMinDate(), this.config.getMaxDate());
        this.datePicker.setSelectedDate(this._value);
    }

    private registerViewEvents() {

        this.subscriptions.push(
            fromEvent<WheelEvent>(this.monthPickerElement.nativeElement, 'wheel')
                .subscribe((event) => this.monthScroll(event))
        );

        this.subscriptions.push(
            fromEvent<PointerEvent>(this.resetElement.nativeElement, 'click')
                .subscribe(() => this.resetDate())
        );

        this.subscriptions.push(
            fromEvent<PointerEvent>(this.yearPanelElement.nativeElement, 'click')
                .subscribe(() => this.switchPanels(Panel.Year))
        );
    }

    private setStyles(): void {
        this.renderer
            .setStyle(this.monthPickerElement.nativeElement.tHead, 'background', this.config.theme.primaryColor);
    }
}
