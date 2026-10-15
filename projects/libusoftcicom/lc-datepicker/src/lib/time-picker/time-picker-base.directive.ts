import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { EHourFormat } from '../enums';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { TimePicker } from './time-picker.class';

@Directive()
export abstract class LCTimePickerBaseDirective implements OnInit, OnDestroy {

  public hourFormat: EHourFormat;
  public formattedHour: string;
  public formattedMinute: string;
  public formattedAMPM: string;

  protected readonly EHourFormat = EHourFormat;

  private readonly subscriptions: Subscription[] = [];

  @Input() public control: LCDatePickerControl;

  protected constructor(
    protected readonly cd: ChangeDetectorRef,
    protected readonly timePicker: TimePicker,
  ) {}

  public ngOnInit(): void {
    this.timePicker.setControl(this.control);
    this.subscriptions.push(
      this.timePicker.getCalendarChanges().subscribe(() => this.updateTemplate())
    );

    this.subscriptions.push(
      this.control.getResetChanges().subscribe(() => {
        this.timePicker.updateTime(false);
        this.updateTemplate();
      })
    );

    this.updateTemplate();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions.length = 0;
    this.cd.detach();
  }

  public addHour(): void {
    this.timePicker.addHour();
  }

  public subtractHour(): void {
    this.timePicker.subtractHour();
  }

  public addMinute(): void {
    this.timePicker.addMinute();
  }

  public subtractMinute(): void {
    this.timePicker.subtractMinute();
  }

  public hourScroll(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.deltaY < 0) {
      this.addHour();
    }
    if (event.deltaY > 0) {
      this.subtractHour();
    }
  }

  public minuteScroll(event: WheelEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.deltaY < 0) {
      this.addMinute();
    }
    if (event.deltaY > 0) {
      this.subtractMinute();
    }
  }

  public toggleMeridiem(): void {
    this.timePicker.toggleMeridiem();
  }

  public scrollMeridiem(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleMeridiem();
  }

  public get panelTextColor(): string {
    return this.control.getTheme().fontColor;
  }

  private updateTemplate(): void {
    this.hourFormat = this.control.getHourFormat();
    this.formattedHour = this.timePicker.getFormattedHour();
    this.formattedMinute = this.timePicker.getFormattedMinute();
    this.formattedAMPM = this.timePicker.getFormattedAMPM();
    this.cd.detectChanges();
  }
}
