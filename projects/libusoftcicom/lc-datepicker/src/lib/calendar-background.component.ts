import {
    ChangeDetectionStrategy,
    Component, ElementRef,
    EventEmitter,
    NgZone,
    OnDestroy, OnInit,
    Output, ViewChild,
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';

@Component({
    selector: 'lc-calendar-background',
    templateUrl: 'calendar-background.component.html',
    styleUrls: ['./calendar-background.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCCalendarBackgroundComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    @Output() public closed: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('calendarBackground', { static: true })
    public calendarBackgroundElement: ElementRef<HTMLDivElement>;

    constructor(
        private readonly ngZone: NgZone,
    ) {}

    public ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => this.registerViewEvents());
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private registerViewEvents(): void {

        this.subscription =
            fromEvent<PointerEvent>(
                this.calendarBackgroundElement.nativeElement,
                'click'
            ).subscribe(() => {
                this.closed.emit();
            });
    }
}
