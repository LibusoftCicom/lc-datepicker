import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
    moduleId: module.id,
    selector: 'lc-time-picker-compact',
    template: `
    <table class="timePicker">
    <tbody align="center">
        <tr>
        <td rowspan="2" class="clockCell">
            <i class="fa fa-clock-o fa-2x" aria-hidden="true"></i>
        </td>
        <td rowspan="2" class="timeLabel" (wheel)="hourScroll($event)">
            {{is24HourFormat ? newDate.format('HH') : newDate.format('hh')}}
        </td>
        <td class="selectbtn" (click)="addHour()" (wheel)="hourScroll($event)">
            <i class="fa fa-caret-up fa-2x" aria-hidden="true"></i>
        </td>
        <td rowspan="2" class="divider">:</td>
        <td rowspan="2" class="timeLabel" (wheel)="minuteScroll($event)">{{newDate.format('mm')}}</td>
        <td class="selectbtn" (click)="addMinute()" (wheel)="minuteScroll($event)">
            <i class="fa fa-caret-up fa-2x" aria-hidden="true"></i>
        </td>
        <td rowspan="2" class="timeLabel" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat">{{newDate.format('A')}}</td>
        <td class="selectbtn" (click)="toggleMeridiem()" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat">
            <i class="fa fa-caret-up fa-2x" aria-hidden="true"></i>
        </td>
        <td rowspan="2" ></td>
        </tr>
        <tr>
        <td class="selectbtn" (click)="subtractHour()" (wheel)="hourScroll($event)">
            <i class="fa fa-caret-down fa-2x" aria-hidden="true"></i>
        </td>
        <td class="selectbtn" (click)="subtractMinute()" (wheel)="minuteScroll($event)">
            <i class="fa fa-caret-down fa-2x" aria-hidden="true"></i>
        </td>
        <td class="selectbtn" (click)="toggleMeridiem()" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat">
            <i class="fa fa-caret-down fa-2x" aria-hidden="true"></i>
        </td>
        </tr>
    </tbody>
    </table>
`,
    styles: [`button,table{width:100%;border:0;-webkit-box-sizing:border-box;box-sizing:border-box}button{background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;outline:0;height:100%}.monthCal td,.monthsCal td,.yearsCal td{min-width:30px;padding:5px 0;border:1px solid #e4e4e4}table{height:40px;border-collapse:collapse;display:table;overflow:hidden}.dateTimeToggle{width:220px;height:20px;background:#e4e4e4;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#efefef}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{border-bottom:1px solid #efefef}thead tr,tr.days{height:25px}tr.days td{border:0}td.active{background:#e6e8ea}.selectbtn{cursor:pointer;font-size:10px;width:18px;padding:0 5px;color:#5e666f}.timeLabel{font-size:x-large;text-align:right;width:30px}.divider{width:10px;font-size:xx-large}.clockCell{width:50px}`],
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
    }

    setTimeFormat() {
        this.is24HourFormat = this.newDate.format('LT').indexOf('M') === -1;
    }

    addHour() {
        let hour = this.newDate.hour();
        this.newDate.hour(++hour % 24);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    }

    subtractHour() {
        let hour = this.newDate.hour();
        this.newDate.hour((--hour + 24) % 24);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    }

    addMinute() {
        let minute = this.newDate.minutes();
        this.newDate.minute(++minute % 60);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
    }

    subtractMinute() {
        let minute = this.newDate.minute();
        this.newDate.minute((--minute + 60) % 60);
        this.selected.emit(this.newDate);
        this.cd.detectChanges();
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
