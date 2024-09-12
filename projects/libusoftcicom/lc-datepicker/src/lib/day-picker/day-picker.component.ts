import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { DayPicker } from './day-picker.class';
import { ICalendarItem, Panel } from '../base-date-picker.class';
import { ECalendarNavigation, ECalendarType } from '../enums';
import { LCDatePickerControl } from '../lc-date-picker-control';

@Component({
  selector: 'lc-day-picker',
  templateUrl: 'day-picker.component.html',
  styleUrls: ['./day-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DayPicker],
})
export class LCDayPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  public formattedMonth: string;
  public formattedYear: string;
  public shortDaysOfWeek: string[];
  public calendarData: ICalendarItem[][];

  private readonly subscriptions: Subscription[] = [];

  @Input() public control: LCDatePickerControl;

  @ViewChild('dayPicker', { static: true })
  public dayPickerElement: ElementRef<HTMLTableElement>;

  @ViewChild('previousMonthButton', { static: true })
  public previousMonthButtonElement: ElementRef<HTMLButtonElement>;

  @ViewChild('nextMonthButton', { static: true })
  public nextMonthButtonElement: ElementRef<HTMLButtonElement>;

  @ViewChild('reset', { static: true })
  public resetElement: ElementRef<HTMLDivElement>;

  @ViewChild('monthPanel', { static: true })
  public monthPanelElement: ElementRef<HTMLDivElement>;

  @ViewChild('yearPanel', { static: true })
  public yearPanelElement: ElementRef<HTMLDivElement>;

  @ViewChildren('itemButtons', { read: ElementRef })
  public itemButtonElements: QueryList<ElementRef>;

  @ViewChildren('daysOfWeek', { read: ElementRef })
  public daysOfWeekElements: QueryList<ElementRef>;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly datePicker: DayPicker,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
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

  public getDayPicker(): DayPicker {
    return this.datePicker;
  }

  public nextMonth(): void {
    this.datePicker.nextMonth();
  }

  public previousMonth(): void {
    this.datePicker.previousMonth();
  }

  public monthScroll(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.deltaY < 0) {
      this.nextMonth();
    }
    if (event.deltaY > 0) {
      this.previousMonth();
    }
  }

  public switchPanels(panel: Panel): void {
    this.control.setPanel(panel);
  }

  public resetDate(): void {
    this.control.reset();
  }

  private setupSubscriptions(): void {
    this.subscriptions.push(this.control.getNavigationChanges().subscribe((dir) => this.navigate(dir)));

    this.subscriptions.push(this.datePicker.getCalendarChanges().subscribe(() => this.updateTemplate()));
    this.subscriptions.push(this.control.getResetChanges().subscribe(() => {
      if (
        this.control.getCalendarType() === ECalendarType.DateTime ||
        this.control.getCalendarType() === ECalendarType.DateRange
      ) {
        this.datePicker.setSelectedDate(this.control.getValue());
        this.updateTemplate();
      }
    }));
  }

  private updateTemplate(): void {
    this.shortDaysOfWeek = this.datePicker.getShortDaysOfWeek();
    this.calendarData = this.datePicker.getCalendarData();
    this.formattedMonth = this.datePicker.getFormattedMonth();
    this.formattedYear = this.datePicker.getFormattedYear();

    this.cd.detectChanges();

    this.setStyles();
  }

  private navigate(dir: ECalendarNavigation): void {
    switch (dir) {
      case ECalendarNavigation.PageDown:
        this.previousMonth();
        break;
      case ECalendarNavigation.PageUp:
        this.nextMonth();
        break;
      case ECalendarNavigation.Confirm:
        if (!this.datePicker.isDateDisabled(this.control.getValue())) {
          this.datePicker.setSelectedDate(this.control.getValue());
        }

        break;
      case ECalendarNavigation.Left:
        this.datePicker.previousDate();
        break;
      case ECalendarNavigation.Right:
        this.datePicker.nextDate();
        break;
      case ECalendarNavigation.Up:
        this.datePicker.previousWeek();
        break;
      case ECalendarNavigation.Down:
        this.datePicker.nextWeek();
        break;
      default:
        break;
    }
  }

  private initializeCalendar(): void {

    this.datePicker.initializeDaysOfWeek();
    this.datePicker.setSelectedDate(this.control.getValue());
  }

  private registerViewEvents(): void {

    this.subscriptions.push(
      fromEvent<WheelEvent>(this.dayPickerElement.nativeElement, 'wheel')
        .subscribe((event) => this.monthScroll(event))
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.previousMonthButtonElement.nativeElement, 'click')
        .subscribe(() => {
          this.previousMonth();
          this.control.focus();
        })
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.nextMonthButtonElement.nativeElement, 'click')
        .subscribe(() =>{
          this.nextMonth();
          this.control.focus();
        })
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.resetElement.nativeElement, 'click')
        .subscribe(() => this.resetDate())
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.monthPanelElement.nativeElement, 'click')
        .subscribe(() => this.switchPanels(Panel.Month))
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.yearPanelElement.nativeElement, 'click')
        .subscribe(() => this.switchPanels(Panel.Year))
    );
  }

  private setStyles(): void {
    this.renderer
      .setStyle(this.dayPickerElement.nativeElement.tHead, 'background', this.control.getTheme().primaryColor);

    this.daysOfWeekElements.forEach((e) =>
      this.renderer.setStyle(e.nativeElement, 'color', this.control.getTheme().fontColor)
    );

    this.itemButtonElements.forEach((e) =>
      this.renderer.setStyle(e.nativeElement, 'color', this.control.getTheme().fontColor)
    );
  }
}
