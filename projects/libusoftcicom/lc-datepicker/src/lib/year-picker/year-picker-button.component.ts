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
import {YearPicker} from './year-picker.class';

@Component({
    selector: 'lc-year-picker-button',
    templateUrl: 'year-picker-button.component.html',
    styleUrls: ['./year-picker-button.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCYearPickerButtonComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    @Input() public item: ICalendarItem;
    @Input() public row: number;
    @Input() public column: number;
    @Input() public config: DatePickerConfig;
    @Output() public selected: EventEmitter<ICalendarItem> = new EventEmitter<ICalendarItem>();

    @ViewChild('buttonContainer', { static: true })
    public yearPickerButtonContainerElement: ElementRef<HTMLDivElement>;

    @ViewChild('yearPickerButton', { static: true })
    public yearPickerButtonElement: ElementRef<HTMLButtonElement>;

    constructor(
        private readonly datePicker: YearPicker,
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
            fromEvent<PointerEvent>(this.yearPickerButtonElement.nativeElement, 'click')
                .subscribe(() => {
                    this.selected.emit(this.datePicker.getCalendarItem(this.row, this.column));
                });
    }

    private setStyles(): void {
        this.renderer.setStyle(this.yearPickerButtonElement.nativeElement, 'color', this.config.theme.fontColor)
    }

    private setClasses(): void {
        if (this.item.active) {
            this.yearPickerButtonContainerElement.nativeElement.classList.add('active');
        }

        if (this.item.disabled) {
            this.yearPickerButtonContainerElement.nativeElement.classList.add('disabled');
        }

        if (this.item.current) {
            this.yearPickerButtonContainerElement.nativeElement.classList.add('current');
        }
    }
}
