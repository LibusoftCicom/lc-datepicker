import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy, OnInit,
    Output, Renderer2, ViewChild,
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {DayPicker} from './day-picker.class';
import {ICalendarItem} from '../base-date-picker.class';
import {DatePickerConfig} from '../lc-date-picker-config-helper';

@Component({
    selector: 'lc-day-picker-button',
    templateUrl: 'day-picker-button.component.html',
    styleUrls: ['./day-picker-button.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCDayPickerButtonComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    @Input() public item: ICalendarItem;
    @Input() public row: number;
    @Input() public column: number;
    @Input() public config: DatePickerConfig;
    @Output() public selected: EventEmitter<ICalendarItem> = new EventEmitter<ICalendarItem>();

    @ViewChild('buttonContainer', { static: true })
    public dayPickerButtonContainerElement: ElementRef<HTMLDivElement>;

    @ViewChild('button', { static: true })
    public dayPickerButtonElement: ElementRef<HTMLButtonElement>;

    constructor(
        private readonly datePicker: DayPicker,
        private readonly ngZone: NgZone,
        private readonly renderer: Renderer2,
        private readonly cd: ChangeDetectorRef,
    ) {}

    public ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => this.registerViewEvents());

        this.setStyles();
        this.setClasses();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private registerViewEvents(): void {

        this.subscription =
            fromEvent<PointerEvent>(this.dayPickerButtonElement.nativeElement, 'click')
                .subscribe(() => {
                    this.selected.emit(this.datePicker.getCalendarItem(this.row, this.column));
                });
    }

    private setStyles(): void {
        this.renderer
            .setStyle(this.dayPickerButtonElement.nativeElement, 'color', this.config.theme.fontColor);
    }

    private setClasses() {
        if (this.item?.active) {
            this.dayPickerButtonContainerElement.nativeElement.classList.add('active');
        }

        if (this.item?.disabled) {
            this.dayPickerButtonContainerElement.nativeElement.classList.add('disabled');
        }

        if (this.item?.current) {
            this.dayPickerButtonContainerElement.nativeElement.classList.add('current');
        }
    }
}
