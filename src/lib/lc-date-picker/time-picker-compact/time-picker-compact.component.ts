import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import moment from 'moment-es6';



@Component({
    moduleId: module.id,
    selector: 'lc-time-picker-compact',
    template: `
    <table class="timePicker">
    <tbody align="center">
        <tr>
        <td rowspan="2" class="clockCell">
            <i class="fa fa-clock-o fa-2x" aria-hidden="true" [style.color]="config.FontColor"></i>
        </td>
        <td rowspan="2" class="timeLabel" (wheel)="hourScroll($event)" [style.color]="config.FontColor">
            {{is24HourFormat ? newDate.format('HH') : newDate.format('hh')}}
        </td>
        <td class="selectbtn" (click)="addHour()" (wheel)="hourScroll($event)" [style.color]="config.FontColor">
            <i class="fa fa-caret-up fa-2x" aria-hidden="true"></i>
        </td>
        <td rowspan="2" class="divider" [style.color]="config.FontColor">:</td>
        <td rowspan="2" class="timeLabel" (wheel)="minuteScroll($event)" [style.color]="config.FontColor">{{newDate.format('mm')}}</td>
        <td class="selectbtn" (click)="addMinute()" (wheel)="minuteScroll($event)" >
            <i class="fa fa-caret-up fa-2x" aria-hidden="true" [style.color]="config.FontColor"> </i>
        </td>
        <td rowspan="2" class="timeLabel" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat" [style.color]="config.FontColor">{{newDate.format('A')}}</td>
        <td class="selectbtn" (click)="toggleMeridiem()" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat" [style.color]="config.FontColor">
            <i class="fa fa-caret-up fa-2x" aria-hidden="true" [style.color]="config.FontColor"></i>
        </td>
        <td rowspan="2" ></td>
        </tr>
        <tr>
        <td class="selectbtn" (click)="subtractHour()" (wheel)="hourScroll($event)" [style.color]="config.FontColor">
            <i class="fa fa-caret-down fa-2x" aria-hidden="true"></i>
        </td>
        <td class="selectbtn" (click)="subtractMinute()" (wheel)="minuteScroll($event)" [style.color]="config.FontColor">
            <i class="fa fa-caret-down fa-2x" aria-hidden="true"></i>
        </td>
        <td class="selectbtn" (click)="toggleMeridiem()" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat" [style.color]="config.FontColor">
            <i class="fa fa-caret-down fa-2x" aria-hidden="true"></i>
        </td>
        </tr>
    </tbody>
    </table>
`,
    styleUrls: ['./time-picker-compact.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCTimePickerCompactComponent implements OnInit {

    public monthData;
    public shortDayName;
    public shortMonthName;
    public is24HourFormat: boolean;

    @Input() newDate: moment.Moment;
    @Input() config;
    @Output() selected: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();

    constructor(private cd: ChangeDetectorRef) {}

    ngOnInit() {
        this.setTimeFormat();
        this.updateTime(false);
    }

    setTimeFormat() {
        this.is24HourFormat = this.newDate.format('LT').indexOf('M') === -1;
    }

    addHour() {
        let hour = this.newDate.hour();
        this.newDate.hour(++hour % 24);
        this.updateTime(false);
    }

    subtractHour() {
        let hour = this.newDate.hour();
        this.newDate.hour((--hour + 24) % 24);
        this.updateTime(true);
    }

    addMinute() {
        let minute = this.newDate.minutes();
        this.newDate.minute(++minute % 60);
        this.updateTime(false);
    }

    subtractMinute() {
        let minute = this.newDate.minute();
        this.newDate.minute((--minute + 60) % 60);
        this.updateTime(true);
    }

    hourScroll(event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.addHour();
        }
        if (event.deltaY > 0) {
            this.subtractHour();
        }
    }

    minuteScroll(event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.addMinute();
        }
        if (event.deltaY > 0) {
            this.subtractMinute();
        }
    }

    toggleMeridiem() {
        this.newDate.hour((this.newDate.hour() + 12) % 24);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    }

    updateTime(reverse) {

        let updatedTime = false;

        this.config.DisabledTimeRanges.forEach(timerange => {
            let currentTime = moment({
                h: this.newDate.hour(),
                m: this.newDate.minutes()
            });

            let minimumTime = moment({
                h: timerange.startTime.hour,
                m: timerange.startTime.minute
            })

            let maximumTime = moment({
                h: timerange.stopTime.hour,
                m: timerange.stopTime.minute
            })


            if (currentTime.isBetween(minimumTime, maximumTime, 'minute', '[]')) {

                if (reverse) {
                    this.newDate.hour(minimumTime.hour())
                    this.newDate.minutes(minimumTime.minutes())
                    this.newDate.subtract(1, 'm');
                }
                else {
                    this.newDate.hour(maximumTime.hour())
                    this.newDate.minutes(maximumTime.minutes())
                    this.newDate.add(1, 'm');
                }
                updatedTime = true;
                return;
            }
        })

        if (updatedTime) {

            this.updateTime(reverse);
            return;
        }

        this.selected.emit(this.newDate);
    }

    private preventDefault(e: Event) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.returnValue = false;
    }

    private stopPropagation(e: Event) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
    }
}
