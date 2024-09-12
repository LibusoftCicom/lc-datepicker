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
import { TimePicker } from './time-picker.class';
import { fromEvent, Subscription } from 'rxjs';
import { EHourFormat } from '../enums';

@Component({
  selector: 'lc-time-picker',
  templateUrl: 'time-picker.component.html',
  styleUrls: ['./time-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TimePicker]
})
export class LCTimePickerComponent implements OnInit, AfterViewInit, OnDestroy {

  public hourFormat: EHourFormat;
  public formattedHour: string;
  public formattedMinute: string;
  public formattedAMPM: string;

  private readonly subscriptions: Subscription[] = [];
  private readonly meridiemSubscriptions: Subscription[] = [];

  protected readonly EHourFormat = EHourFormat;

  @Input() public control: LCDatePickerControl;

  @ViewChild('timePicker', { static: true })
  public timePickerElement: ElementRef<HTMLTableElement>;

  @ViewChild('header', { static: true })
  public headerElement: ElementRef<HTMLTableCellElement>;

  @ViewChild('reset', { static: true })
  public resetElement: ElementRef<HTMLDivElement>;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly timePicker: TimePicker,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
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

  public ngAfterViewInit(): void {

    this.setStyles();
    this.ngZone.runOutsideAngular(() => this.registerViewEvents());
  }

  public ngOnDestroy(): void {

    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.length = 0;
    this.meridiemSubscriptions.forEach(sub => sub.unsubscribe());
    this.meridiemSubscriptions.length = 0;

    this.cd.detach();
  }

  public setTimeFormat(): void {
    this.hourFormat = this.control.getHourFormat();
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

  public resetTime(): void {
    this.control.reset();
  }

  public toggleMeridiem(): void {
    this.timePicker.toggleMeridiem();
  }

  public scrollMeridiem(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.toggleMeridiem();
  }

  private updateTemplate(): void {
    this.hourFormat = this.control.getHourFormat();
    this.formattedHour = this.timePicker.getFormattedHour();
    this.formattedMinute = this.timePicker.getFormattedMinute();
    this.formattedAMPM = this.timePicker.getFormattedAMPM();

    this.cd.detectChanges();

    this.setStyles();
  }

  private setStyles(): void {

    this.renderer
      .setStyle(this.timePickerElement.nativeElement.tHead, 'background', this.control.getTheme().primaryColor);
    this.renderer
      .setStyle(this.timePickerElement.nativeElement.tBodies[0], 'color', this.control.getTheme().fontColor);
    this.renderer
      .setAttribute(
        this.headerElement.nativeElement,
        'colspan',
        this.hourFormat === EHourFormat.TWENTY_FOUR_HOUR ? '3' : '4'
      );
  }

  private registerViewEvents() {

    this.subscriptions.push(
      fromEvent<PointerEvent>(this.resetElement.nativeElement, 'click')
        .subscribe(() => this.resetTime())
    );
  }
}
