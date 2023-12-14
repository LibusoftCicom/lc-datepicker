import {
    Component,
    Input,
    ChangeDetectionStrategy,
    OnInit, OnDestroy, NgZone, Renderer2, ViewChild, ElementRef, EventEmitter, Output,
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {DatePickerConfig} from '../lc-date-picker-config-helper';

@Component({
	selector: 'lc-time-spinner',
	templateUrl: 'time-spinner.component.html',
	styleUrls: ['./time-spinner.component.style.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCTimeSpinnerComponent implements OnInit, OnDestroy {

    private readonly subscriptions: Subscription[] = [];

	@Input() public value: string;
	@Input() public config: DatePickerConfig;
    @Output() public incremented: EventEmitter<void> = new EventEmitter<void>();
    @Output() public decremented: EventEmitter<void> = new EventEmitter<void>();
    @Output() public scrolled: EventEmitter<WheelEvent> = new EventEmitter<WheelEvent>();

    @ViewChild('timeSpinner', { static: true })
    public timeSpinnerElement: ElementRef<HTMLDivElement>;

    @ViewChild('upArrowButton', { static: true })
    public upArrowButtonElement: ElementRef<HTMLDivElement>;

    @ViewChild('timeDigit', { static: true })
    public timeDigitElement: ElementRef<HTMLDivElement>;

    @ViewChild('downArrowButton', { static: true })
    public downArrowButtonElement: ElementRef<HTMLDivElement>;

	constructor(
        private readonly ngZone: NgZone,
        private readonly renderer: Renderer2,
    ) {}

	public ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => this.registerViewEvents());
        this.setStyles();
    }

	public ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions.length = 0;
    }

    private registerViewEvents(): void {

        this.subscriptions.push(
            fromEvent<PointerEvent>(this.upArrowButtonElement.nativeElement, 'click')
                .subscribe(() => this.incremented.emit())
        );

        this.subscriptions.push(
            fromEvent<PointerEvent>(this.downArrowButtonElement.nativeElement, 'click')
                .subscribe(() => this.decremented.emit())
        );

        this.subscriptions.push(
            fromEvent<WheelEvent>(this.timeSpinnerElement.nativeElement, 'wheel')
                .subscribe((event) => this.scrolled.emit(event))
        );
    }

    private setStyles(): void {
        this.renderer
            .setStyle(this.upArrowButtonElement.nativeElement, 'color', this.config.theme.fontColor);
        this.renderer
            .setStyle(this.downArrowButtonElement.nativeElement, 'color', this.config.theme.fontColor);
        this.renderer
            .setStyle(this.timeDigitElement.nativeElement, 'color', this.config.theme.fontColor);
    }
}
