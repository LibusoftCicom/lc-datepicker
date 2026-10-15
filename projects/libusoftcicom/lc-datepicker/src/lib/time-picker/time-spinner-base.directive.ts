import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { LCDatePickerControl } from '../lc-date-picker-control';

@Directive()
export abstract class LCTimeSpinnerBaseDirective implements OnInit, OnDestroy {

  private readonly subscriptions: Subscription[] = [];

  @Input() public value: string;
  @Input() public ariaLabel = 'time value';
  @Input() public control: LCDatePickerControl;
  @Output() public incremented: EventEmitter<void> = new EventEmitter<void>();
  @Output() public decremented: EventEmitter<void> = new EventEmitter<void>();
  @Output() public scrolled: EventEmitter<WheelEvent> = new EventEmitter<WheelEvent>();

  @ViewChild('timeSpinner', { static: true })
  public timeSpinnerElement: ElementRef<HTMLDivElement>;

  @ViewChild('upArrowButton', { static: true })
  public upArrowButtonElement: ElementRef<HTMLButtonElement>;

  @ViewChild('downArrowButton', { static: true })
  public downArrowButtonElement: ElementRef<HTMLButtonElement>;

  protected constructor(
    protected readonly ngZone: NgZone,
  ) {}

  public ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => this.registerViewEvents());
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.length = 0;
  }

  public get arrowColor(): string {
    return this.control.getTheme().fontColor;
  }

  public get valueColor(): string {
    return this.control.getTheme().fontColor;
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
        .subscribe(event => this.scrolled.emit(event))
    );
  }
}
