import {
    ChangeDetectionStrategy,
    Component, ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy, OnInit,
    Output, Renderer2, ViewChild,
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {ICalendarItem} from '../base-date-picker.class';
import {DatePickerConfig} from '../lc-date-picker-config-helper';
import {MonthPicker} from './month-picker.class';

@Component({
    selector: 'lc-month-picker-button',
    templateUrl: 'month-picker-button.component.html',
    styleUrls: ['./month-picker-button.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCMonthPickerButtonComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    @Input() public item: ICalendarItem;
    @Input() public row: number;
    @Input() public column: number;
    @Input() public config: DatePickerConfig;
    @Output() public selected: EventEmitter<ICalendarItem> = new EventEmitter<ICalendarItem>();

    @ViewChild('buttonContainer', { static: true })
    public monthPickerButtonContainerElement: ElementRef<HTMLDivElement>;

    @ViewChild('monthPickerButton', { static: true })
    public monthPickerButtonElement: ElementRef<HTMLButtonElement>;

    constructor(
        private readonly datePicker: MonthPicker,
        private readonly ngZone: NgZone,
        private readonly renderer: Renderer2,
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
            fromEvent<PointerEvent>(this.monthPickerButtonElement.nativeElement, 'click')
                .subscribe(() => {
                    this.selected.emit(this.datePicker.getCalendarItem(this.row, this.column));
                });
    }

    private setStyles(): void {
        this.renderer.setStyle(this.monthPickerButtonElement.nativeElement, 'color', this.config.theme.fontColor)
    }

    private setClasses(): void {
        if (this.item.active) {
            this.monthPickerButtonContainerElement.nativeElement.classList.add('active');
        }

        if (this.item.disabled) {
            this.monthPickerButtonContainerElement.nativeElement.classList.add('disabled');
        }

        if (this.item.current) {
            this.monthPickerButtonContainerElement.nativeElement.classList.add('current');
        }
    }
}
