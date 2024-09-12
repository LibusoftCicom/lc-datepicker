import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { TimePicker } from '../time-picker/time-picker.class';
import { Subscription } from 'rxjs';
import { EHourFormat } from '../enums';


@Component({
  selector: 'lc-time-picker-compact',
  templateUrl: './time-picker-compact.component.html',
  styleUrls: ['./time-picker-compact.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TimePicker],
})
export class LCTimePickerCompactComponent implements OnInit, AfterViewInit, OnDestroy {

  public hourFormat: EHourFormat;
  public formattedHour: string;
  public formattedMinute: string;
  public formattedAMPM: string;

  protected readonly EHourFormat = EHourFormat;

  private readonly subscriptions: Subscription[] = [];
  private readonly meridiemSubscriptions: Subscription[] = [];

  @Input() public control: LCDatePickerControl;

  @ViewChild('timePicker', { static: true })
  public timePickerElement: ElementRef<HTMLTableElement>;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly timePicker: TimePicker,
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
  }

  public ngOnDestroy(): void {

    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.length = 0;
    this.meridiemSubscriptions.forEach(sub => sub.unsubscribe());
    this.meridiemSubscriptions.length = 0;

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

  private setStyles(): void {

    this.renderer
      .setStyle(this.timePickerElement.nativeElement.tBodies[0], 'color', this.control.getTheme().fontColor);
  }

  private updateTemplate(): void {
    this.hourFormat = this.control.getHourFormat();
    this.formattedHour = this.timePicker.getFormattedHour();
    this.formattedMinute = this.timePicker.getFormattedMinute();
    this.formattedAMPM = this.timePicker.getFormattedAMPM();

    this.cd.detectChanges();

    this.setStyles();
  }
}
