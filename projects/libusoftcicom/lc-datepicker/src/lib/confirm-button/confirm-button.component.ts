import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter, Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { LCDatePickerControl } from '../lc-date-picker-control';

@Component({
  selector: 'lc-confirm-button',
  templateUrl: 'confirm-button.component.html',
  styleUrls: ['./confirm-button.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCConfirmButtonComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  @Input() public control: LCDatePickerControl;

  @Output() public confirmed: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('confirmButton', { static: true })
  public confirmButtonElement: ElementRef<HTMLButtonElement>;

  constructor(
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
  ) {}

  public ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => this.registerViewEvents());
    this.setStyles();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private registerViewEvents(): void {

    this.subscription =
      fromEvent<PointerEvent>(this.confirmButtonElement.nativeElement, 'click')
        .subscribe(() => {
          this.control.setValue(
            this.control.getValue(),
            true
          );
          this.confirmed.emit();
        });
  }

  private setStyles(): void {
    this.renderer.setStyle(this.confirmButtonElement.nativeElement, 'background', this.control.getTheme().primaryColor);
  }
}
