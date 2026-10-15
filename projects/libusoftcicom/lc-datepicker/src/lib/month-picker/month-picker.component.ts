import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { LCDatePickerControl } from './../lc-date-picker-control';
import { fromEvent, Subscription } from 'rxjs';
import { ICalendarItem, Panel } from '../base-date-picker.class';
import { MonthPicker } from './month-picker.class';
import { ECalendarNavigation } from '../enums';
import { LCCalendarGridComponent } from '../calendar-grid/calendar-grid.component';

@Component({
  selector: 'lc-month-picker',
  templateUrl: 'month-picker.component.html',
  styleUrls: ['./month-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonthPicker],
})
export class LCMonthPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  public calendarData: ICalendarItem[][];

  private readonly subscriptions: Subscription[] = [];

  @Input() public control: LCDatePickerControl;

  @ViewChild(LCCalendarGridComponent, { static: true })
  public calendarGrid: LCCalendarGridComponent;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly datePicker: MonthPicker,
    private readonly ngZone: NgZone
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

  private setupSubscriptions(): void {
    this.subscriptions.push(this.control.getNavigationChanges().subscribe(dir => this.navigate(dir)));
    this.subscriptions.push(this.datePicker.getCalendarChanges().subscribe(() => this.updateTemplate()));
  }

  private updateTemplate(): void {
    this.calendarData = this.datePicker.getCalendarData();
    this.cd.detectChanges();
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
      fromEvent<WheelEvent>(this.calendarGrid.tableElement.nativeElement, 'wheel')
        .subscribe((event) => this.monthScroll(event))
    );
  }

  public readonly monthPanel = Panel.Month;
}
