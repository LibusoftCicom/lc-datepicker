import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit, OnDestroy, NgZone, Renderer2, ViewChild, ElementRef, EventEmitter, Output,
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {LCDatePickerControl} from '../lc-date-picker-control';

@Component({
  selector: 'lc-time-spinner-compact',
  templateUrl: 'time-spinner-compact.component.html',
  styleUrls: ['./time-spinner-compact.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCTimeSpinnerCompactComponent implements OnInit, OnDestroy {

  private readonly subscriptions: Subscription[] = [];

  @Input() public value: string;
  @Input() public control: LCDatePickerControl;
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
      .setStyle(this.upArrowButtonElement.nativeElement, 'color', this.control.getTheme().fontColor);
    this.renderer
      .setStyle(this.downArrowButtonElement.nativeElement, 'color', this.control.getTheme().fontColor);
    this.renderer
      .setStyle(this.timeDigitElement.nativeElement, 'color', this.control.getTheme().fontColor);
  }
}
