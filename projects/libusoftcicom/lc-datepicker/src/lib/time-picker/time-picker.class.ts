import {DateTimePart, LCDatePickerAdapter} from '../lc-date-picker-adapter.class';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { EHourFormat } from '../enums';
import { LCDatePickerControl } from '../lc-date-picker-control';

@Injectable()
export class TimePicker {

    private readonly HOURS_IN_DAY = 24;
    private readonly HOURS_IN_DAY_AMPM = 12;
    private readonly MINUTES_IN_HOUR = 60;

    private control: LCDatePickerControl;

    private readonly calendarChanges: Subject<void> = new Subject();

    constructor(
      private readonly dateAdapter: LCDatePickerAdapter,
    ) {}

  public setControl(control: LCDatePickerControl): void {
    this.control = control;
  }

    public addHour(): void {
        this.control.setValue(
            this.dateAdapter.setParts(
                this.control.getValue(),
                {hour: (this.control.getValue().getHour() + 1) % this.HOURS_IN_DAY}
            ));
        this.updateTime(false);
    }

    public subtractHour(): void {
        this.control.setValue(
            this.dateAdapter.setParts(
                this.control.getValue(),
                {hour: (this.control.getValue().getHour() - 1 + this.HOURS_IN_DAY) % this.HOURS_IN_DAY}
            ));
        this.updateTime(true);
    }

    public addMinute(): void {
        this.control.setValue(
            this.dateAdapter.setParts(
                this.control.getValue(),
                {minute: (this.control.getValue().getMinute() + 1) % this.MINUTES_IN_HOUR}
            ));
        this.updateTime(false);
    }

    public subtractMinute(): void {
        this.control.setValue(
            this.dateAdapter.setParts(
                this.control.getValue(),
                {minute: (this.control.getValue().getMinute() - 1 + this.MINUTES_IN_HOUR) % this.MINUTES_IN_HOUR}
            ));
        this.updateTime(true);
    }

    public updateTime(reverse: boolean): void {

        let updatedTime = false;

        this.control.getDisabledTimeRanges().forEach(timeRange => {
            const currentTime =
                this.dateAdapter.setParts(
                    this.control.getValue(),
                    {second: 0, millisecond: 0}
                );

            const minimumTime =
                this.dateAdapter.setParts(currentTime, {
                    hour: timeRange.startTime.hour,
                    minute: timeRange.startTime.minute
                });

            const maximumTime =
                this.dateAdapter.setParts(currentTime, {
                    hour: timeRange.stopTime.hour,
                    minute: timeRange.stopTime.minute
                });


            if (this.dateAdapter.isBetween(currentTime, minimumTime, maximumTime)) {

                if (reverse) {
                    this.control.setValue(this.dateAdapter.subtract(minimumTime, 1, 'minute'));
                }
                else{
                    this.control.setValue(this.dateAdapter.add(maximumTime, 1, 'minute'));
                }
                updatedTime = true;
            }
        })

        if (updatedTime) {
            this.updateTime(reverse);
        }
        else {
            this.calendarChanges.next();
        }
    }

    public getFormattedHour(): string {
        return this.dateAdapter.formatDateTimePart(
            this.control.getValue(),
            this.control.getHourFormat() === EHourFormat.TWENTY_FOUR_HOUR ? DateTimePart.HOUR : DateTimePart.HOUR_AMPM,
            this.control.getLocalization());
    }

    public getFormattedMinute(): string {
        return this.dateAdapter.formatDateTimePart(
          this.control.getValue(),
          DateTimePart.MINUTE,
          this.control.getLocalization()
        );
    }

    public getFormattedAMPM(): string {
        return this.dateAdapter.formatDateTimePart(
          this.control.getValue(),
          DateTimePart.AMPM,
          this.control.getLocalization()
        );
    }

    public getCalendarChanges(): Observable<void> {
        return this.calendarChanges;
    }

    public toggleMeridiem(): void {
        this.control.setValue(
            this.dateAdapter.setParts(
                this.control.getValue(),
                {hour: (this.control.getValue().getHour() + this.HOURS_IN_DAY_AMPM) % this.HOURS_IN_DAY}
            ));
        this.updateTime(false);
    }
}
