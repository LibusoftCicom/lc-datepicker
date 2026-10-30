import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Panel } from '../base-date-picker.class';
import { DateType, ECalendarNavigation, ECalendarType } from '../enums';
import { IColorTheme, IDatePickerConfiguration, ILabels, LCDatePickerControl } from '../lc-date-picker-control';
import { DatePickerConfig } from '../lc-date-picker-config';
import { DATE_PICKER_HEADER } from '../header/header-provider.class';
import { LcDatePickerBasicHeaderComponent } from '../header/lc-date-picker-basic-header.component';
import { DatePickerPopoverBehavior } from '../popover-behavior';
import { DateTime } from '../date-time.class';
import { LCDayPickerComponent } from '../day-picker/day-picker.component';

@Component({
  selector: 'lc-date-range-picker',
  templateUrl: 'lc-date-range-picker.component.html',
  styleUrls: ['./lc-date-range-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCDateRangePickerComponent implements OnInit, AfterViewInit, OnDestroy {

  protected readonly showRangeLabels = inject(DATE_PICKER_HEADER) === LcDatePickerBasicHeaderComponent;
  protected readonly Panel = Panel;
  protected activePanelFrom: Panel;
  protected activePanelTo: Panel;
  protected opened: boolean;
  protected fromControl: LCDatePickerControl;
  protected toControl: LCDatePickerControl;
  protected linkedRange = false;
  protected linkedFromControl: LCDatePickerControl;
  protected linkedToControl: LCDatePickerControl;
  protected linkedPanelFrom = Panel.Day;
  protected linkedPanelTo = Panel.Day;

  @HostBinding('style.margin-top')
  public componentMargin;

  @HostBinding('attr.tabindex')
  public tabIndex = 0;

  @Input() public config: DatePickerConfig;
  @Output() public dateChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChildren(LCDayPickerComponent)
  private readonly linkedDayPickers: QueryList<LCDayPickerComponent>;

  private readonly subscriptions: Subscription[] = [];
  private popoverBehavior: DatePickerPopoverBehavior;
  private linkedFromMonth: DateTime;
  private linkedToMonth: DateTime;
  private synchronizingMonths = false;
  private pendingRangeStart: DateTime | null;
  private rangePreview: DateTime | null;
  private linkedRangeComplete = true;
  private linkedPanelReturn: DateType | null = null;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly _elementRef: ElementRef) {
  }

  public ngOnInit(): void {

    this.fromControl = this.config.getControl(DateType.FROM);
    this.toControl = this.config.getControl(DateType.TO);
    this.linkedRange = this.config.isLinkedRangeSelection();
    this.config.setHostElement(this._elementRef.nativeElement);
    this.popoverBehavior = new DatePickerPopoverBehavior(this._elementRef.nativeElement);
    if (this.linkedRange) {
      this.initializeLinkedCalendars();
    }
    this.initCalendar();
    this.setupSubscriptions();

    this.cd.detectChanges();
  }

  public ngAfterViewInit(): void {
    if (this.linkedRange) {
      this.syncLinkedCalendars();
      this.subscriptions.push(this.linkedDayPickers.changes.subscribe(() => this.onLinkedDayPickersChanged()));
    }
    this.cd.detectChanges();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.length = 0;

    this.cd.detach();
  }

  public confirm(): void {
    if (this.linkedRange && !this.linkedRangeComplete) {
      return;
    }

    this.config.commitSelection();
    this.dateChange.emit(this.config.getValue());
    this.setOpen(false);
  }

  public clear(): void {
    this.config.setValue(null);
    this.dateChange.emit('');
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
    if (this.linkedRange) {
      this.linkedFromControl.setLocalization(localization);
      this.linkedToControl.setLocalization(localization);
      this.refreshLinkedCalendarsView();
    }
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
    if (this.linkedRange) {
      this.linkedFromControl.setTheme(theme);
      this.linkedToControl.setTheme(theme);
      this.refreshLinkedCalendarsView();
    }
  }

  public getTimezone(): string {
    return this.config.getTimezone();
  }

  public getDisabledDates(): string[] {
    return this.config.getDisabledDates();
  }

  public setDisabledDates(dates: string[]): void {
    this.config.setDisabledDates(dates);
    if (this.linkedRange) {
      this.linkedFromControl.setDisabledDates(dates);
      this.linkedToControl.setDisabledDates(dates);
      this.refreshLinkedCalendarsView();
    }
  }

  public isFocused(): boolean {
    return this.config.isFocused();
  }

  public focus(): void {
    this.config.focus();
  }

  private initCalendar(): void {

    this.activePanelFrom = this.config.getPanel(DateType.FROM);
    this.activePanelTo = this.config.getPanel(DateType.TO);

    this.popoverBehavior.focus();
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
    if (this.linkedRange) {
      this.subscriptions.push(
        this.linkedFromControl.getPanelChanges().subscribe(panel => this.onLinkedPanelChanged(DateType.FROM, panel)),
        this.linkedToControl.getPanelChanges().subscribe(panel => this.onLinkedPanelChanged(DateType.TO, panel))
      );
      this.subscriptions.push(this.fromControl.getDateEventsChanges().subscribe(events => {
        this.linkedFromControl.setDateEvents(events);
        this.linkedToControl.setDateEvents(events);
      }));
    }

    this.subscriptions.push(
      this.config.getOpenChanges()
        .subscribe(open => {
          this.opened = open;

          if (this.opened) {
            if (this.linkedRange) {
              this.resetLinkedDraft();
            }
          } else if (this.linkedRange) {
            this.resetLinkedDraft();
          }

          this.cd.detectChanges();
          if (this.opened) {
            this.setCalendarPosition();
            this.cd.detectChanges();
          }
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
        if (this.opened) {
          this.setCalendarPosition();
          this.cd.detectChanges();
        }
      })
    );
  }

  private setCalendarPosition(): void {
    this.componentMargin = this.popoverBehavior.getMarginTop();
  }

  protected onLinkedDateSelected(date: DateTime): void {
    const adapter = this.fromControl.getAdapter();
    if (!this.pendingRangeStart || this.linkedRangeComplete) {
      this.pendingRangeStart = date.clone();
      this.rangePreview = null;
      this.linkedRangeComplete = false;
      this.config.setRangeSelectionComplete(false);
    } else {
      const [start, end] = adapter.isBefore(date, this.pendingRangeStart)
        ? [date, this.pendingRangeStart]
        : [this.pendingRangeStart, date];
      this.fromControl.setValue(start, false);
      this.toControl.setValue(end, false);
      this.pendingRangeStart = null;
      this.rangePreview = null;
      this.linkedRangeComplete = true;
      this.config.setRangeSelectionComplete(true);
      if (this.fromControl.shouldConfirmSelection()) {
        this.confirm();
        return;
      }
    }

    this.refreshLinkedRangeState();
  }

  protected onLinkedDatePreview(date: DateTime | null): void {
    if (!this.pendingRangeStart || this.linkedRangeComplete) {
      return;
    }

    this.rangePreview = date;
    this.refreshLinkedRangeState();
  }

  protected onLeftMonthViewed(date: DateTime): void {
    this.synchronizeOtherMonth(date, true);
  }

  protected onRightMonthViewed(date: DateTime): void {
    this.synchronizeOtherMonth(date, false);
  }

  private onLinkedPanelChanged(dateType: DateType, panel: Panel): void {
    const previous = dateType === DateType.FROM ? this.linkedPanelFrom : this.linkedPanelTo;
    if (previous === panel) {
      return;
    }

    if (dateType === DateType.FROM) {
      this.linkedPanelFrom = panel;
    } else {
      this.linkedPanelTo = panel;
    }
    this.linkedPanelReturn = panel === Panel.Day ? dateType : null;
    this.cd.detectChanges();
    if (this.opened) {
      this.setCalendarPosition();
      this.cd.detectChanges();
    }
  }

  // A day picker re-created after month/year selection keeps the other side in sync.
  private onLinkedDayPickersChanged(): void {
    const returned = this.linkedPanelReturn;
    this.linkedPanelReturn = null;
    if (returned === null || this.linkedDayPickers.length !== 2) {
      this.syncLinkedCalendars();
      return;
    }

    const left = returned === DateType.FROM;
    const control = left ? this.linkedFromControl : this.linkedToControl;
    this.synchronizeOtherMonth(control.getValue(), left);
    const adapter = this.fromControl.getAdapter();
    const dayPickers = this.linkedDayPickers.toArray();
    this.linkedFromMonth = adapter.getStartOfMonth(dayPickers[0].control.getValue());
    this.linkedToMonth = adapter.getStartOfMonth(dayPickers[1].control.getValue());
    this.refreshLinkedRangeState();
  }

  private initializeLinkedCalendars(): void {
    this.linkedFromControl = this.createLinkedCalendarControl(
      this.fromControl,
      this.fromControl.getValue()
    );
    this.linkedToControl = this.createLinkedCalendarControl(
      this.toControl,
      this.toControl.getValue()
    );
    this.resetLinkedDraft();
  }

  private createLinkedCalendarControl(
    source: LCDatePickerControl,
    value: DateTime,
  ): LCDatePickerControl {
    const adapter = source.getAdapter();
    const configuration: IDatePickerConfiguration = {
      value: adapter.toISOString(value),
      calendarType: ECalendarType.Date,
      theme: source.getTheme(),
      labels: source.getLabels(),
      localization: source.getLocalization(),
      minimumDate: adapter.toISOString(source.getMinDate()),
      maximumDate: adapter.toISOString(source.getMaxDate()),
      disabledDates: source.getDisabledDates(),
      dateEvents: source.getDateEvents(),
      timezone: source.getTimezone(),
      view: {
        showAdjacentDays: true,
        compactWeekdays: source.getViewOptions().compactWeekdays
      },
    };
    return new LCDatePickerControl(configuration, adapter);
  }

  private resetLinkedDraft(): void {
    if (!this.linkedRange) {
      return;
    }

    this.pendingRangeStart = null;
    this.rangePreview = null;
    this.linkedRangeComplete = true;
    this.config.setRangeSelectionComplete(true);
    this.syncLinkedCalendarConfiguration();
    this.linkedPanelReturn = null;
    this.linkedFromControl.setPanel(Panel.Day);
    this.linkedToControl.setPanel(Panel.Day);
    this.linkedFromControl.setValue(this.fromControl.getValue());
    this.linkedToControl.setValue(this.toControl.getValue());
    this.syncLinkedCalendars();
    this.refreshLinkedRangeState();
  }

  private synchronizeOtherMonth(date: DateTime, leftChanged: boolean): void {
    if (!this.config.isSynchronizedRangeNavigation() || this.synchronizingMonths || this.linkedDayPickers?.length !== 2) {
      return;
    }

    const adapter = this.fromControl.getAdapter();
    const month = adapter.getStartOfMonth(date);
    const previousMonth = leftChanged ? this.linkedFromMonth : this.linkedToMonth;
    const targetPicker = leftChanged ? this.linkedDayPickers?.toArray()[1] : this.linkedDayPickers?.toArray()[0];
    if (!previousMonth || !targetPicker) {
      return;
    }

    const monthDelta =
      (month.getYear() - previousMonth.getYear()) * 12 +
      month.getMonth() - previousMonth.getMonth();
    if (leftChanged) {
      this.linkedFromMonth = month;
    } else {
      this.linkedToMonth = month;
    }
    if (monthDelta === 0) {
      return;
    }

    this.synchronizingMonths = true;
    try {
      targetPicker.setVisibleDate(adapter.add(
        targetPicker.control.getValue(),
        monthDelta,
        'month'
      ));
    } finally {
      this.synchronizingMonths = false;
    }
    const targetMonth = adapter.getStartOfMonth(targetPicker.control.getValue());
    if (leftChanged) {
      this.linkedToMonth = targetMonth;
    } else {
      this.linkedFromMonth = targetMonth;
    }
    this.refreshLinkedRangeState();
  }

  private syncLinkedCalendars(): void {
    if (!this.linkedDayPickers || this.linkedDayPickers.length !== 2) {
      return;
    }

    const dayPickers = this.linkedDayPickers.toArray();
    const adapter = this.fromControl.getAdapter();
    this.synchronizingMonths = true;
    try {
      dayPickers[0].setVisibleDate(this.linkedFromControl.getValue());
      dayPickers[1].setVisibleDate(this.linkedToControl.getValue());
    } finally {
      this.synchronizingMonths = false;
    }
    this.linkedFromMonth = adapter.getStartOfMonth(dayPickers[0].control.getValue());
    this.linkedToMonth = adapter.getStartOfMonth(dayPickers[1].control.getValue());
    this.refreshLinkedRangeState();
  }

  private refreshLinkedRangeState(): void {
    if (!this.linkedDayPickers || this.linkedDayPickers.length !== 2) {
      return;
    }

    const start = this.linkedRangeComplete ? this.fromControl.getValue() : this.pendingRangeStart;
    const end = this.linkedRangeComplete ? this.toControl.getValue() : null;
    this.linkedDayPickers.forEach(dayPicker => dayPicker.setRangeState(start, end, this.rangePreview));
  }

  private syncLinkedCalendarConfiguration(): void {
    const controls: Array<[LCDatePickerControl, LCDatePickerControl]> = [
      [this.linkedFromControl, this.fromControl],
      [this.linkedToControl, this.toControl]
    ];
    controls.forEach(([linked, source]) => {
      linked.setTheme(source.getTheme());
      linked.setLocalization(source.getLocalization());
      linked.setDisabledDates(source.getDisabledDates());
      linked.setMinDate(source.getMinDate());
      linked.setMaxDate(source.getMaxDate());
    });
    this.refreshLinkedCalendarsView();
  }

  private refreshLinkedCalendarsView(): void {
    this.linkedDayPickers?.forEach(dayPicker => dayPicker.refreshCalendar());
  }
}
