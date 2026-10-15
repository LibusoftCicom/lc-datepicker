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
  Output,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Panel } from '../base-date-picker.class';
import { DateType, ECalendarNavigation, ECalendarType } from '../enums';
import { DatePickerConfig } from '../lc-date-picker-config';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { DatePickerPopoverBehavior } from '../popover-behavior';
import { DateTime } from '../date-time.class';
import { LCDayPickerComponent } from '../day-picker/day-picker.component';

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
  protected linkedControl: LCDatePickerControl;
  protected readonly Panel = Panel;
  private linkedDayPicker: LCDayPickerComponent;
  private pendingRangeStart: DateTime | null = null;
  private rangePreview: DateTime | null = null;

  @ViewChild('linkedDayPicker')
  private set linkedPicker(picker: LCDayPickerComponent) {
    this.linkedDayPicker = picker;
    this.refreshRangeState();
  }

  @HostBinding('style.margin-top')
  public componentMargin;

  @HostBinding('attr.tabindex')
  public tabIndex = 0;

  @Input() public config: DatePickerConfig;
  @Output() public dateChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly subscriptions: Subscription[] = [];
  private popoverBehavior: DatePickerPopoverBehavior;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly _elementRef: ElementRef,
  ) {}

  public ngOnInit(): void {

    this.control = this.config.getControl();
    this.config.setHostElement(this._elementRef.nativeElement);
    this.popoverBehavior = new DatePickerPopoverBehavior(this._elementRef.nativeElement);
    this.initCalendar();
    if (this.config.isLinkedRangeSelection() && this.calendarType === ECalendarType.Date) {
      const adapter = this.control.getAdapter();
      this.linkedControl = new LCDatePickerControl({
        value: adapter.toISOString(this.control.getValue()),
        calendarType: ECalendarType.Date,
        selectionMode: 'explicit',
        timezone: this.control.getTimezone(),
        localization: this.control.getLocalization(),
        theme: this.control.getTheme(),
        labels: this.control.getLabels(),
        minimumDate: adapter.toISOString(this.control.getMinDate()),
        maximumDate: adapter.toISOString(this.control.getMaxDate()),
        disabledDates: this.control.getDisabledDates(),
        dateEvents: this.control.getDateEvents(),
        view: this.control.getViewOptions()
      }, adapter);
      this.subscriptions.push(this.linkedControl.getPanelChanges().subscribe(panel => {
        this.activePanel = panel;
        this.cd.detectChanges();
      }));
      this.subscriptions.push(this.control.getDateEventsChanges().subscribe(events => {
        this.linkedControl.setDateEvents(events);
      }));
    }
    this.setupSubscriptions();
  }

  public ngAfterViewInit(): void {
    this.popoverBehavior.focus();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.length = 0;

    this.cd.detach();
  }

  public reset(): void {

    if (this.linkedControl) {
      this.resetRangeDraft();
      return;
    }

    if (
      this.calendarType === ECalendarType.Date ||
      this.calendarType === ECalendarType.MonthYear ||
      this.calendarType === ECalendarType.Year
    ) {
      this.changeDate();
    }
  }

  public changeDate(): void {
    if (this.linkedControl && !this.control.isRangeSelectionComplete()) {
      return;
    }
    this.config.commitSelection();
    this.dateChange.emit(this.config.getValue());
    this.config.setOpen(false);
  }

  public confirm(): void {
    this.config.confirm();
  }

  protected selectRangeDate(date: DateTime): void {
    if (!this.pendingRangeStart) {
      this.pendingRangeStart = date.clone();
      this.rangePreview = null;
      this.config.setRangeSelectionComplete(false);
    } else {
      const adapter = this.control.getAdapter();
      const [start, end] = adapter.isBefore(date, this.pendingRangeStart)
        ? [date, this.pendingRangeStart] : [this.pendingRangeStart, date];
      this.control.setValue(start, false);
      this.config.getControl(DateType.TO).setValue(end, false);
      this.pendingRangeStart = null;
      this.rangePreview = null;
      this.config.setRangeSelectionComplete(true);
      if (this.control.shouldConfirmSelection()) {
        this.changeDate();
        return;
      }
    }
    this.refreshRangeState();
  }

  protected previewRangeDate(date: DateTime | null): void {
    if (this.pendingRangeStart) {
      this.rangePreview = date;
      this.refreshRangeState();
    }
  }

  private refreshRangeState(): void {
    this.linkedDayPicker?.setRangeState(
      this.pendingRangeStart ?? this.control.getValue(),
      this.pendingRangeStart ? null : this.config.getControl(DateType.TO).getValue(),
      this.rangePreview
    );
  }

  private resetRangeDraft(): void {
    this.pendingRangeStart = null;
    this.rangePreview = null;
    this.config.setRangeSelectionComplete(true);
    const adapter = this.control.getAdapter();
    this.linkedControl.setValue(this.control.getValue(), false);
    this.linkedControl.setLocalization(this.control.getLocalization());
    this.linkedControl.setTheme(this.control.getTheme());
    this.linkedControl.setLabels(this.control.getLabels());
    this.linkedControl.setDisabledDates(this.control.getDisabledDates());
    this.linkedControl.setMinDate(this.control.getMinDate());
    this.linkedControl.setMaxDate(this.control.getMaxDate());
    this.linkedDayPicker?.setVisibleDate(adapter.getStartOfMonth(this.control.getValue()));
    this.refreshRangeState();
  }

  public clear(): void {
    this.config.setValue(null);
    this.dateChange.emit('');
    this.config.setOpen(false);
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
          if (this.linkedControl) {
            this.resetRangeDraft();
          }
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
      this.config.getNavigationChanges().subscribe(dir => this.navigation(dir))
    );

    this.subscriptions.push(
      this.config.getPanelChanges().subscribe((type: {panel: Panel, dateType: DateType}) => {
        this.activePanel = type.panel;
        this.calendarType = this.config.getCalendarType();
        this.cd.detectChanges();
        if (this.opened) {
          this.setCalendarPosition();
          this.cd.detectChanges();
        }
      })
    );

    this.subscriptions.push(
      this.config.getValueChanges().subscribe(() => this.changeDate())
    );

    this.subscriptions.push(
      this.config.getResetChanges().subscribe(() => this.reset())
    );
  }

  private navigation(dir: ECalendarNavigation): void {
    if (this.linkedControl) {
      switch (dir) {
        case ECalendarNavigation.Left: this.linkedControl.navigateLeft(); return;
        case ECalendarNavigation.Right: this.linkedControl.navigateRight(); return;
        case ECalendarNavigation.Up: this.linkedControl.navigateUp(); return;
        case ECalendarNavigation.Down: this.linkedControl.navigateDown(); return;
        case ECalendarNavigation.PageUp: this.linkedControl.nextPage(); return;
        case ECalendarNavigation.PageDown: this.linkedControl.previousPage(); return;
      }
    }
    if (dir === ECalendarNavigation.Close) {
      this.config.setOpen(false);
    }
    if (dir === ECalendarNavigation.Confirm && this.config.isOpen()) {
      this.changeDate();
    }
  }

  private setCalendarPosition(): void {
    this.componentMargin = this.popoverBehavior.getMarginTop();
  }
}
