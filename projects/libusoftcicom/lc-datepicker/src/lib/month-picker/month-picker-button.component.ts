import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { ICalendarItem, Panel } from '../base-date-picker.class';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { MonthPicker } from './month-picker.class';
import { ECalendarType } from '../enums';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';

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
  @Input() public control: LCDatePickerControl;

  @ViewChild('buttonContainer', { static: true })
  public monthPickerButtonContainerElement: ElementRef<HTMLDivElement>;

  @ViewChild('monthPickerButton', { static: true })
  public monthPickerButtonElement: ElementRef<HTMLButtonElement>;

  constructor(
    private readonly datePicker: MonthPicker,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
    private readonly dateAdapter: LCDatePickerAdapter,
  ) {}

  public ngOnInit(): void {
    this.datePicker.setControl(this.control);
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

          const isMonthYear = this.control.getCalendarType() === ECalendarType.MonthYear;
          this.control.setValue(
            this.dateAdapter.setParts(
              this.control.getValue(),
              { month: this.datePicker.getCalendarItem(this.row, this.column).value }
            ),
            isMonthYear
          );

          if (!isMonthYear) {
            this.control.setPanel(Panel.Day);
          }
        });
  }

  private setStyles(): void {
    this.renderer.setStyle(this.monthPickerButtonElement.nativeElement, 'color', this.control.getTheme().fontColor)
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
