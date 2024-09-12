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
import { YearPicker } from './year-picker.class';
import { ECalendarType } from '../enums';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';

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
  @Input() public control: LCDatePickerControl;

  @ViewChild('buttonContainer', { static: true })
  public yearPickerButtonContainerElement: ElementRef<HTMLDivElement>;

  @ViewChild('yearPickerButton', { static: true })
  public yearPickerButtonElement: ElementRef<HTMLButtonElement>;

  constructor(
    private readonly datePicker: YearPicker,
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
      fromEvent<PointerEvent>(this.yearPickerButtonElement.nativeElement, 'click')
        .subscribe(() => {
          const isYear = this.control.getCalendarType() === ECalendarType.Year;
          this.control.setValue(
            this.dateAdapter.setParts(
              this.control.getValue(),
              { year: this.datePicker.getCalendarItem(this.row, this.column).value }
            ),
            isYear
          );

          if (!isYear) {
            this.control.setPanel(Panel.Month);
          }
        });
  }

  private setStyles(): void {
    this.renderer.setStyle(this.yearPickerButtonElement.nativeElement, 'color', this.control.getTheme().fontColor)
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
