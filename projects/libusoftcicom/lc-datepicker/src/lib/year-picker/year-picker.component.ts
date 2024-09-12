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
import { LCDatePickerControl } from '../lc-date-picker-control';
import { fromEvent, Subscription } from 'rxjs';
import { ICalendarItem } from '../base-date-picker.class';
import { YearPicker } from './year-picker.class';
import { ECalendarNavigation } from '../enums';

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

  @Input() public control: LCDatePickerControl;

  @ViewChild('yearPicker', { static: true })
  public yearPickerElement: ElementRef<HTMLTableElement>;

  @ViewChild('previousYearsButton', { static: true })
  public previousYearsButtonElement: ElementRef<HTMLButtonElement>;

  @ViewChild('nextYearsButton', { static: true })
  public nextYearsButtonElement: ElementRef<HTMLButtonElement>;

  @ViewChild('reset', { static: true })
  public resetElement: ElementRef<HTMLDivElement>;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly datePicker: YearPicker,
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
        this.setStyles();
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
      fromEvent<WheelEvent>(this.yearPickerElement.nativeElement, 'wheel')
        .subscribe((event) => this.yearScroll(event))
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.previousYearsButtonElement.nativeElement, 'click')
        .subscribe(() => {
          this.previousYears();
          this.control.focus();
        })
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.nextYearsButtonElement.nativeElement, 'click')
        .subscribe(() =>{
          this.nextYears();
          this.control.focus();
        })
    );

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.resetElement.nativeElement, 'click')
        .subscribe(() => this.control.reset())
    );
  }

  private setStyles(): void {
    this.renderer
      .setStyle(this.yearPickerElement.nativeElement.tHead, 'background', this.control.getTheme().primaryColor);
  }
}
