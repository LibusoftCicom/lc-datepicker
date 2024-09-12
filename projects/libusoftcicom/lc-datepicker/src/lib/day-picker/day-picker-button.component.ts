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
import { DayPicker } from './day-picker.class';
import { ICalendarItem } from '../base-date-picker.class';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { ECalendarType } from '../enums';

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
  @Input() public control: LCDatePickerControl;

  @ViewChild('buttonContainer', { static: true })
  public dayPickerButtonContainerElement: ElementRef<HTMLDivElement>;

  @ViewChild('button', { static: true })
  public dayPickerButtonElement: ElementRef<HTMLButtonElement>;

  constructor(
    private readonly datePicker: DayPicker,
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
      fromEvent<PointerEvent>(this.dayPickerButtonElement.nativeElement, 'click')
        .subscribe(() => {
            if (this.datePicker.getCalendarItem(this.row, this.column).value === null) {
              return;
            }

            if (this.datePicker.getCalendarItem(this.row, this.column).disabled) {
              return;
            }

            const newDate = this.dateAdapter.setParts(
              this.control.getValue(),
              { date: this.datePicker.getCalendarItem(this.row, this.column).value }
            );

            this.control.setValue(
              newDate,
              this.control.getCalendarType() === ECalendarType.Date
            );

            this.datePicker.setSelectedDate(newDate);
          }
        );
  }

  private setStyles(): void {
    this.renderer
      .setStyle(this.dayPickerButtonElement.nativeElement, 'color', this.control.getTheme().fontColor);
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
