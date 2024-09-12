import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { LCDatePickerControl } from './../lc-date-picker-control';
import { fromEvent, Subscription } from 'rxjs';
import { ICalendarItem, Panel } from '../base-date-picker.class';
import { MonthPicker } from './month-picker.class';
import { ECalendarNavigation } from '../enums';
import { DateTimePart, LCDatePickerAdapter } from '../lc-date-picker-adapter.class';

@Component({
  selector: 'lc-month-picker',
  templateUrl: 'month-picker.component.html',
  styleUrls: ['./month-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonthPicker],
})
export class LCMonthPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  public formattedYear: string;
  public calendarData: ICalendarItem[][];

  private readonly subscriptions: Subscription[] = [];

  @Input() public control: LCDatePickerControl;

  @ViewChild('monthPicker', { static: true })
  public monthPickerElement: ElementRef<HTMLTableElement>;

  @ViewChild('reset', { static: true })
  public resetElement: ElementRef<HTMLDivElement>;

  @ViewChild('yearPanel', { static: true })
  public yearPanelElement: ElementRef<HTMLDivElement>;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly datePicker: MonthPicker,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
    private readonly dateAdapter: LCDatePickerAdapter,
  ) {}

  public ngOnInit(): void {

    this.datePicker.setControl(this.control);
    this.setupSubscriptions();

    this.initializeCalendar();
  }

  public ngAfterViewInit(): void {

    this.setStyles();

    this.ngZone.runOutsideAngular(() => this.registerViewEvents());
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.length = 0;

    this.cd.detach();
  }

  public nextYear(): void {
    this.datePicker.nextYear();
  }

  public previousYear(): void {
    this.datePicker.previousYear();
  }

  public monthScroll(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.deltaY < 0) {
      this.nextYear();
    }
    if (event.deltaY > 0) {
      this.previousYear();
    }
  }

  public switchPanels(panel: Panel): void {
    this.control.setPanel(panel);
  }

  public resetDate(): void {
    this.control.reset();
  }

  private setupSubscriptions(): void {
    this.subscriptions.push(this.control.getNavigationChanges().subscribe(dir => this.navigate(dir)));
    this.subscriptions.push(this.datePicker.getCalendarChanges().subscribe(() => this.updateTemplate()));
  }

  private updateTemplate(): void {
    this.calendarData = this.datePicker.getCalendarData();
    this.formattedYear =
      this.dateAdapter.formatDateTimePart(
        this.control.getValue(),
        DateTimePart.YEAR,
        this.control.getLocalization()
      );

    this.cd.detectChanges();

    this.setStyles();
  }

  private navigate(dir: ECalendarNavigation): void {
    if (dir === ECalendarNavigation.PageDown) {
      this.previousYear();
    } else if (dir === ECalendarNavigation.PageUp) {
      this.nextYear();
    } else if (dir === ECalendarNavigation.Confirm) {
      this.datePicker.setCalendarData(this.datePicker.formatCalendarData());
    } else if (dir === ECalendarNavigation.Left) {
      this.datePicker.previousMonth();
    } else if (dir === ECalendarNavigation.Right) {
      this.datePicker.nextMonth();
    } else if (dir === ECalendarNavigation.Up) {
      this.datePicker.previousRow();
    } else if (dir === ECalendarNavigation.Down) {
      this.datePicker.nextRow();
    }
  }

  private initializeCalendar(): void {
    this.datePicker.setSelectedDate(this.control.getValue());
  }

  private registerViewEvents() {

    this.subscriptions.push(
      fromEvent<WheelEvent>(this.monthPickerElement.nativeElement, 'wheel')
        .subscribe((event) => this.monthScroll(event))
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.resetElement.nativeElement, 'click')
        .subscribe(() => this.resetDate())
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.yearPanelElement.nativeElement, 'click')
        .subscribe(() => this.switchPanels(Panel.Year))
    );
  }

  private setStyles(): void {
    this.renderer
      .setStyle(this.monthPickerElement.nativeElement.tHead, 'background', this.control.getTheme().primaryColor);
  }
}
