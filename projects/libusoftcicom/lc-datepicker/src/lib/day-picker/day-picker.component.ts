import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { DayPicker } from './day-picker.class';
import { ICalendarItem, Panel } from '../base-date-picker.class';
import { ECalendarNavigation, ECalendarType } from '../enums';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { LCDatePickerAdapter } from '../lc-date-picker-adapter.class';
import { LCCalendarGridComponent } from '../calendar-grid/calendar-grid.component';
import { DateTime } from '../date-time.class';

@Component({
  selector: 'lc-day-picker',
  templateUrl: 'day-picker.component.html',
  styleUrls: ['./day-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DayPicker],
})
export class LCDayPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  public shortDaysOfWeek: string[];
  public calendarData: ICalendarItem[][];

  @Output() public dateSelected = new EventEmitter<DateTime>();
  @Output() public datePreview = new EventEmitter<DateTime | null>();
  @Output() public monthViewed = new EventEmitter<DateTime>();

  private readonly subscriptions: Subscription[] = [];
  private rangeStart: DateTime | null;
  private rangeEnd: DateTime | null;
  private rangePreview: DateTime | null;
  private linkedRange = false;
  private lastViewedMonth: string;

  @Input() public control!: LCDatePickerControl;

  @ViewChild(LCCalendarGridComponent, { static: true })
  public calendarGrid!: LCCalendarGridComponent;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly datePicker: DayPicker,
    private readonly ngZone: NgZone,
    private readonly dateAdapter: LCDatePickerAdapter,
  ) {}

  public ngOnInit(): void {

    this.datePicker.setControl(this.control);
    this.setupSubscriptions();

    this.initializeCalendar();
  }

  public ngAfterViewInit(): void {

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

  public setVisibleDate(date: DateTime): void {
    this.control.setValue(date, false);
    this.datePicker.setSelectedDate(date);
  }

  public refreshCalendar(): void {
    this.datePicker.initializeDaysOfWeek();
    this.datePicker.setSelectedDate(this.control.getValue());
  }

  public setRangeState(start: DateTime | null, end: DateTime | null, preview: DateTime | null): void {
    this.linkedRange = true;
    this.rangeStart = start;
    this.rangeEnd = end;
    this.rangePreview = preview;
    this.applyRangeState();
    this.cd.markForCheck();
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

  public resetDate(): void {
    this.control.reset();
  }

  private setupSubscriptions(): void {
    this.subscriptions.push(this.control.getDateEventsChanges().subscribe(() => this.refreshCalendar()));
    this.subscriptions.push(this.control.getNavigationChanges().subscribe((dir) => this.navigate(dir)));

    this.subscriptions.push(this.datePicker.getCalendarChanges().subscribe(() => {
      this.updateTemplate();
      this.emitMonthChange();
    }));
    this.subscriptions.push(this.control.getResetChanges().subscribe(() => {
      if (
        this.control.getCalendarType() === ECalendarType.Date ||
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
    this.applyRangeState();
    this.cd.detectChanges();
  }

  private applyRangeState(): void {
    if (!this.linkedRange || !this.calendarData) {
      return;
    }

    const start = this.rangeStart;
    const rangeEnd = this.rangeEnd;
    const preview = this.rangePreview;
    const end = rangeEnd ?? preview;
    this.calendarData = this.calendarData.map(row => row.map(item => {
      if (!item?.dateTime) {
        return item;
      }

      return {
        ...item,
        active: false,
        rangeStart: this.sameDay(item.dateTime, start),
        rangeEnd: !!rangeEnd && this.sameDay(item.dateTime, rangeEnd),
        inRange: !!start && !!end &&
          !this.sameDay(item.dateTime, start) &&
          !this.sameDay(item.dateTime, end) &&
          this.isBetween(item.dateTime, start, end),
        rangePreview: !!preview && !!start &&
          (this.sameDay(item.dateTime, preview) || this.isBetween(item.dateTime, start, preview))
      };
    }));
  }

  private emitMonthChange(): void {
    const value = this.control.getValue();
    const monthKey = `${value.getYear()}-${value.getMonth()}`;
    if (this.lastViewedMonth !== undefined && this.lastViewedMonth !== monthKey) {
      this.monthViewed.emit(value);
    }
    this.lastViewedMonth = monthKey;
  }

  private sameDay(first: DateTime | null, second: DateTime | null): boolean {
    return !!first && !!second &&
      first.getYear() === second.getYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate();
  }

  private isBetween(date: DateTime, first: DateTime, second: DateTime): boolean {
    const low = this.dateAdapter.isBefore(first, second) ? first : second;
    const high = low === first ? second : first;
    return this.dateAdapter.isAfter(date, low) &&
      this.dateAdapter.isBefore(date, high);
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
      fromEvent<WheelEvent>(this.calendarGrid.tableElement.nativeElement, 'wheel')
        .subscribe((event) => this.monthScroll(event))
    );
  }

  public readonly dayPanel = Panel.Day;
}
