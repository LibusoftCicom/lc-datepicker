import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';


@Component({
    moduleId: module.id,
    selector: 'lc-time-picker',
    template: `
    <table>
        <thead align="center">
            <tr>
            <th [attr.colspan]="is24HourFormat ? 5 : 6">
                <div class="resetBtn"> &nbsp; </div>
                <div class="resetBtn" (click)="resetDate($event)"> <i class="fa fa-home" aria-hidden="true"></i> </div>
            </th></tr>
        </thead>
        <tbody align="center">
            <tr>
            <td rowspan="3"></td>
            <td class="selectbtn" (click)="addHour()" (wheel)="hourScroll($event)">
                <i class="fa fa-caret-up" aria-hidden="true"></i>
            </td>
            <td rowspan="3" class="divider">:</td>
            <td class="selectbtn" (click)="addMinute()" (wheel)="minuteScroll($event)">
                <i class="fa fa-caret-up" aria-hidden="true"></i>
            </td>
            <td class="selectbtn" (click)="toggleMeridiem()" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat">
                <i class="fa fa-caret-up" aria-hidden="true"></i>
            </td>
            <td rowspan="3"></td>
            </tr>
            <tr>
            <td class="timeDigit" (wheel)="hourScroll($event)">{{is24HourFormat ? newDate.format('HH') : newDate.format('hh')}}</td>
            <td class="timeDigit" (wheel)="minuteScroll($event)">{{newDate.format('mm')}}</td>
            <td class="timeDigit" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat">{{newDate.format('A')}}</td>
            </tr>
            <tr>
            <td class="selectbtn" (click)="subtractHour()" (wheel)="hourScroll($event)">
                <i class="fa fa-caret-down" aria-hidden="true"></i>
            </td>
            <td class="selectbtn" (click)="subtractMinute()" (wheel)="minuteScroll($event)">
                <i class="fa fa-caret-down" aria-hidden="true"></i>
            </td>
            <td class="selectbtn" (click)="toggleMeridiem()" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat">
                <i class="fa fa-caret-down" aria-hidden="true"></i>
                </td>
            </tr>
        </tbody>
        </table>
`,
    styles: [`button,table{width:100%;border:0;-webkit-box-sizing:border-box;box-sizing:border-box}button{background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;outline:0;height:100%}td{padding:1px}table{height:100px;border-collapse:collapse;display:table;overflow:hidden;font-size:large}.dateTimeToggle{width:220px;height:20px;background:#e4e4e4;position:absolute;bottom:20px;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#efefef}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{background:#5e666f;color:#f0f8ff}thead tr,tr.days{height:25px}tr.days td{border:0}td.active{background:rgba(94,102,111,.05)}.resetBtn{cursor:pointer;color:#e0e0e0;float:left;width:30px;font-size:initial}.selectbtn{cursor:pointer;color:#5e666f;width:20px;font-size:xx-large}.pullRight{float:right}.rotateUp{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.rotateDown{-webkit-transform:rotate(-90deg) scaleX(-1);transform:rotate(-90deg) scaleX(-1)}.divider{width:10px;font-size:xx-large}.timeDigit{width:75px;font-size:larger}`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCTimePickerComponent implements OnInit, OnChanges {

    public is24HourFormat: boolean;

    @Input() newDate: moment.Moment;
    @Input() config;
    @Output() selected: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();
    @Output() reset: EventEmitter<void> = new EventEmitter<void>();

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.setTimeFormat();
            this.cd.detectChanges();
    }

    ngOnChanges(changes) {
        if (changes.newDate) {
            this.cd.detectChanges();
        }
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

    toggleMeridiem(event) {
        this.preventDefault(event);
        this.stopPropagation(event);
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

    resetDate(event) {
        this.reset.emit();
    }
}
