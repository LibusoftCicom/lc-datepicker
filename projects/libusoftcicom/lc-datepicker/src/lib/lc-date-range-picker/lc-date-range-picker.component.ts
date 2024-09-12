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
import { IColorTheme, ILabels, LCDatePickerControl } from '../lc-date-picker-control';
import { DatePickerConfig } from '../lc-date-picker-config';

@Component({
  selector: 'lc-date-range-picker',
  templateUrl: 'lc-date-range-picker.component.html',
  styleUrls: ['./lc-date-range-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCDateRangePickerComponent implements OnInit, AfterViewInit, OnDestroy {

  protected activePanelFrom: Panel;
  protected activePanelTo: Panel;
  protected opened: boolean;
  protected fromControl: LCDatePickerControl;
  protected toControl: LCDatePickerControl;

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
  ) {
  }

  public ngOnInit(): void {

    this.fromControl = this.config.getControl(DateType.FROM);
    this.toControl = this.config.getControl(DateType.TO);
    this.config.setHostElement(this._elementRef.nativeElement);
    this.initCalendar();
    this.setupSubscriptions();

    this.cd.detectChanges();
  }

  public ngAfterViewInit(): void {

    this.cd.detectChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.length = 0;

    this.cd.detach();
  }

  public confirm(): void {
    this.dateChange.emit(this.config.getValue());
    this.setOpen(false);
  }

  public isOpen(): boolean {
    return this.config.isOpen();
  }

  public setOpen(open: boolean): void {
    this.config.setOpen(open);
  }

  public getLocalization(): string {
    return this.config.getLocalization();
  }

  public setLocalization(localization: string): void {
    this.config.setLocalization(localization);
  }

  public getLabels(): ILabels {
    return this.config.getLabels();
  }

  public setLabels(labels: ILabels): void {
    this.config.setLabels(labels);
  }

  public getTheme(): IColorTheme {
    return this.config.getTheme();
  }

  public setTheme(theme: IColorTheme): void {
    this.config.setTheme(theme);
  }

  public getTimezone(): string {
    return this.config.getTimezone();
  }

  public getDisabledDates(): string[] {
    return this.config.getDisabledDates();
  }

  public setDisabledDates(dates: string[]): void {
    this.config.setDisabledDates(dates);
  }

  public isFocused(): boolean {
    return this.config.isFocused();
  }

  public focus(): void {
    this.config.focus();
  }

  private getActivePanel(dateType: DateType): Panel {
    return this.config.getPanel(dateType);
  }

  private initCalendar(): void {

    this.activePanelFrom = this.config.getPanel(DateType.FROM);
    this.activePanelTo = this.config.getPanel(DateType.TO);

    this._elementRef.nativeElement.focus();
  }

  private navigation(dir: ECalendarNavigation): void {
    if (dir === ECalendarNavigation.Close) {
      this.setOpen(false);
    }
    if (dir === ECalendarNavigation.Confirm) {
      this.confirm();
    }
  }

  private setupSubscriptions() {

    this.subscriptions.push(
      this.config.getOpenChanges()
        .subscribe(open => {
          this.opened = open;

          if (this.opened) {
            this.setCalendarPosition();
          }

          this.cd.detectChanges();
          this.openedChange.emit(this.opened);
        })
    );

    this.subscriptions.push(
      this.config.getNavigationChanges()
        .subscribe(dir => this.navigation(dir))
    );

    this.subscriptions.push(
      this.config.getPanelChanges().subscribe((type: {panel: Panel, dateType: DateType}) => {
        if (type.dateType === DateType.FROM) {
          this.activePanelFrom = type.panel;
        }
        else {
          this.activePanelTo = type.panel;
        }

        this.cd.detectChanges();
      })
    );
  }

  private setCalendarPosition(): void {
    const windowHeight = window.innerHeight;
    const componentPosition = this._elementRef.nativeElement.parentNode.getBoundingClientRect();
    this.componentMargin =
      (windowHeight - componentPosition.top > this.calendarSize(this.config.getCalendarType()))
        ? 0
        : this.calendarSize(this.config.getCalendarType()) * -1 + 'px';
  }

  private calendarSize(type: ECalendarType): number {
    let height = 32;
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
      case ECalendarType.DateRange:
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
