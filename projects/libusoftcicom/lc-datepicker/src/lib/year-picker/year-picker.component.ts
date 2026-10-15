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
import { LCDatePickerControl } from '../lc-date-picker-control';
import { fromEvent, Subscription } from 'rxjs';
import { ICalendarItem, Panel } from '../base-date-picker.class';
import { YearPicker } from './year-picker.class';
import { ECalendarNavigation } from '../enums';
import { LCCalendarGridComponent } from '../calendar-grid/calendar-grid.component';

@Component({
  selector: 'lc-year-picker',
  templateUrl: 'year-picker.component.html',
  styleUrls: ['./year-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [YearPicker],
})
export class LCYearPickerComponent implements OnInit, AfterViewInit, OnDestroy {

  public calendarData: ICalendarItem[][];

  private readonly subscriptions: Subscription[] = [];

  @Input() public control!: LCDatePickerControl;

  @ViewChild(LCCalendarGridComponent, { static: true })
  public calendarGrid!: LCCalendarGridComponent;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly datePicker: YearPicker,
    private readonly ngZone: NgZone,
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

  public previousYears(): void {
    this.datePicker.previousYears();
  }

  public nextYears(): void {
    this.datePicker.nextYears();
  }

  public yearScroll(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.deltaY < 0) {
      this.nextYears();
    }
    if (event.deltaY > 0) {
      this.previousYears();
    }
  }

  private setupSubscriptions(): void {

    this.subscriptions.push(this.control.getNavigationChanges().subscribe((dir) => this.navigate(dir)));

    this.subscriptions.push(
      this.datePicker.getCalendarChanges().subscribe(() => {
        this.calendarData = this.datePicker.getCalendarData();
        this.cd.detectChanges();
      })
    );
  }

  private navigate(dir: ECalendarNavigation): void {
    switch (dir) {
      case ECalendarNavigation.PageDown:
        this.nextYears();
        break;
      case ECalendarNavigation.PageUp:
        this.previousYears();
        break;
      case ECalendarNavigation.Confirm:
        this.datePicker.setCalendarData(this.datePicker.formatCalendarData());
        break;
      case ECalendarNavigation.Left:
        this.datePicker.previousYear();
        break;
      case ECalendarNavigation.Right:
        this.datePicker.nextYear();
        break;
      case ECalendarNavigation.Up:
        this.datePicker.previousRow();
        break;
      case ECalendarNavigation.Down:
        this.datePicker.nextRow();
        break;
      default:
        break;
    }
  }

  private initializeCalendar(): void {
    this.datePicker.setSelectedDate();
  }

  private registerViewEvents(): void {
    this.subscriptions.push(
      fromEvent<WheelEvent>(this.calendarGrid.tableElement.nativeElement, 'wheel')
        .subscribe((event) => this.yearScroll(event))
    );
  }

  public readonly yearPanel = Panel.Year;
}
