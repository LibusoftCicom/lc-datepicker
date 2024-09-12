import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Panel } from '../base-date-picker.class';
import { DateType, ECalendarNavigation, ECalendarType } from '../enums';
import { DatePickerConfig } from '../lc-date-picker-config';
import { LCDatePickerControl } from '../lc-date-picker-control';

@Component({
  selector: 'lc-datepicker',
  templateUrl: './lc-date-picker.component.html',
  styleUrls: ['./lc-date-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCDatePickerComponent implements OnInit, AfterViewInit, OnDestroy {

  protected activePanel: Panel;
  protected calendarType: ECalendarType;
  protected opened: boolean;
  protected readonly ECalendarType = ECalendarType;
  protected control: LCDatePickerControl;

  @HostBinding('style.margin-top')
  public componentMargin;

  @HostBinding('attr.tabindex')
  public tabIndex = 0;

  @Input() public config: DatePickerConfig;
  @Output() public dateChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly _elementRef: ElementRef,
  ) {}

  public ngOnInit(): void {

    this.control = this.config.getControl();
    this.config.setHostElement(this._elementRef.nativeElement);
    this.initCalendar();
    this.setupSubscriptions();
  }

  public ngAfterViewInit(): void {
    this._elementRef.nativeElement.focus();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.length = 0;

    this.cd.detach();
  }

  public reset(): void {

    if (
      this.calendarType === ECalendarType.Date ||
      this.calendarType === ECalendarType.MonthYear ||
      this.calendarType === ECalendarType.Year
    ) {
      this.changeDate();
    }
  }

  public changeDate(): void {
    this.dateChange.emit(this.config.getValue());
    this.config.setOpen(false);
  }

  public confirm(): void {
    this.config.confirm();
  }

  private getActivePanel(): Panel {
    return this.config.getPanel();
  }

  private initCalendar(): void {
    this.calendarType = this.config.getCalendarType();
    this.activePanel = this.getActivePanel();
  }

  private setupSubscriptions(): void {

    this.subscriptions.push(
      this.config.getOpenChanges().subscribe(open => {
        this.opened = open;

        if (this.opened) {
          this.setCalendarPosition();
        }

        this.cd.detectChanges();
        this.openedChange.emit(this.opened);
      })
    );

    this.subscriptions.push(
      this.config.getNavigationChanges().subscribe(dir => this.navigation(dir))
    );

    this.subscriptions.push(
      this.config.getPanelChanges().subscribe((type: {panel: Panel, dateType: DateType}) => {
        this.activePanel = type.panel;
        this.calendarType = this.config.getCalendarType();
        this.cd.detectChanges();
      })
    );

    this.subscriptions.push(
      this.config.getValueChanges().subscribe(() => this.changeDate())
    );

    this.subscriptions.push(
      this.config.getResetChanges().subscribe(() => this.reset())
    );
  }

  private setCalendarPosition() {
    const windowHeight = window.innerHeight;
    const componentPosition = this._elementRef.nativeElement.parentNode.getBoundingClientRect();
    this.componentMargin =
      (windowHeight - componentPosition.top > this.calendarSize(this.calendarType))
        ? 0
        : this.calendarSize(this.calendarType) * -1 + 'px';
  }

  private navigation(dir: ECalendarNavigation): void {
    if (dir === ECalendarNavigation.Close) {
      this.config.setOpen(false);
    }
  }

  private calendarSize(type: ECalendarType): number {
    let height = 5;
    if (
      this.config.getCalendarType() === ECalendarType.Time ||
      this.config.getCalendarType() === ECalendarType.DateTime
    ) {
      height += 20;
    }
    switch (type) {
      case ECalendarType.DateTime: {
        height += 280;
        break;
      }
      case ECalendarType.Date:
      case ECalendarType.MonthYear:
      case ECalendarType.Year: {
        height += 240;
        break;
      }
      case ECalendarType.Time: {
        height += 140;
        break;
      }
    }
    return height;
  }
}
