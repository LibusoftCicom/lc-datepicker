import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { LCDatePickerControl } from '../lc-date-picker-control';

@Component({
    selector: 'lc-calendar-background',
    templateUrl: 'calendar-background.component.html',
    styleUrls: ['./calendar-background.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCCalendarBackgroundComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    @Input() public control: LCDatePickerControl;

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
                this.control.setOpen(false);
            });
    }
}
