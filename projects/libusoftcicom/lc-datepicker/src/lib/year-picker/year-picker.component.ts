import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    OnInit,
    OnDestroy, ViewChild, ElementRef, NgZone, Renderer2, AfterViewInit,
} from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import {fromEvent, Subscription} from 'rxjs';
import {ICalendarItem} from '../base-date-picker.class';
import {YearPicker} from './year-picker.class';
import {DateTime} from '../date-time.class';
import {ECalendarNavigation} from '../enums';

@Component({
    selector: 'lc-year-picker',
    templateUrl: 'year-picker.component.html',
    styleUrls: ['./year-picker.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [YearPicker],
})
export class LCYearPickerComponent implements OnInit, AfterViewInit, OnDestroy {

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
    @Output() public reset: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('yearPicker', { static: true })
    public yearPickerElement: ElementRef<HTMLTableElement>;

    @ViewChild('previousYearsButton', { static: true })
    public previousYearsButtonElement: ElementRef<HTMLButtonElement>;

    @ViewChild('nextYearsButton', { static: true })
    public nextYearsButtonElement: ElementRef<HTMLButtonElement>;

    @ViewChild('reset', { static: true })
    public resetElement: ElementRef<HTMLDivElement>;

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly datePicker: YearPicker,
        private readonly ngZone: NgZone,
        private readonly renderer: Renderer2,
    ) {}

    public ngOnInit(): void {

        this.navigationSubscription =
            this.config.navigationChanges.subscribe((dir) => this.navigate(dir));
        this.subscriptions.push(
            this.datePicker.getCalendarChanges().subscribe(() => {
                this.calendarData = this.datePicker.getCalendarData();
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

    public getValue(): DateTime {
        return this.datePicker.getSelectedDateTime();
    }

    public previousYears(): void {
        this.datePicker.previousYears();
    }

    public nextYears(): void {
        this.datePicker.nextYears();
    }

    public selectItem(item: ICalendarItem): void {

        if (!item || item.disabled) {
            return;
        }

        this.datePicker.selectItem(item);
        this.datePicker.setCalendarData(this.datePicker.formatCalendarData());
        this.selected.emit(this.datePicker.getSelectedDateTime());
    }

    public yearScroll(event: WheelEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (event.deltaY < 0) {
            this.nextYears();
        }
        if (event.deltaY > 0) {
            this.previousYears();
        }
    }

    public resetDate(): void {
        this.reset.emit();
    }

    private navigate(dir: ECalendarNavigation): void {
        switch (dir) {
            case ECalendarNavigation.PageDown:
                this.nextYears();
                break;
            case ECalendarNavigation.PageUp:
                this.previousYears();
                break;
            case ECalendarNavigation.Confirm:
                this.datePicker.setCalendarData(this.datePicker.formatCalendarData());
                break;
            case ECalendarNavigation.Left:
                this.datePicker.previousYear();
                break;
            case ECalendarNavigation.Right:
                this.datePicker.nextYear();
                break;
            case ECalendarNavigation.Up:
                this.datePicker.previousRow();
                break;
            case ECalendarNavigation.Down:
                this.datePicker.nextRow();
                break;
            default:
                break;
        }
    }

    private initializeCalendar(): void {

        this.datePicker.setLocale(this.config.getLocalization());
        this.datePicker.setTimezone(this.config.getTimezone());
        this.datePicker.setCalendarBoundaries(this.config.getMinDate(), this.config.getMaxDate());
        this.datePicker.setSelectedDate(this._value);
    }

    private registerViewEvents(): void {
        this.subscriptions.push(
            fromEvent<WheelEvent>(this.yearPickerElement.nativeElement, 'wheel')
                .subscribe((event) => this.yearScroll(event))
        );

        this.subscriptions.push(
            fromEvent<PointerEvent>(this.previousYearsButtonElement.nativeElement, 'click')
                .subscribe(() => {
                    this.previousYears();
                    this.config.focus();
                })
        );

        this.subscriptions.push(
            fromEvent<PointerEvent>(this.nextYearsButtonElement.nativeElement, 'click')
                .subscribe(() =>{
                    this.nextYears();
                    this.config.focus();
                })
        );

        this.subscriptions.push(
            fromEvent<PointerEvent>(this.resetElement.nativeElement, 'click')
                .subscribe(() => this.resetDate())
        );
    }

    private setStyles(): void {
        this.renderer
            .setStyle(this.yearPickerElement.nativeElement.tHead, 'background', this.config.theme.primaryColor);
    }
}
