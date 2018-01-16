import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import moment from 'moment-es6';



@Component({
    moduleId: module.id,
    selector: 'lc-time-picker',
    template: `
    <table>
        <thead align="center"  [style.background]="config.PrimaryColor">
            <tr>
            <th [attr.colspan]="is24HourFormat ? 5 : 6">
                <div class="resetBtn"> &nbsp; </div>
                <div class="resetBtn" (click)="resetDate($event)"> <i class="fa fa-home" aria-hidden="true"></i> </div>
            </th></tr>
        </thead>
        <tbody align="center" [style.color]="config.FontColor">
            <tr>
            <td rowspan="3"></td>
            <td class="selectbtn" (click)="addHour()" (wheel)="hourScroll($event)" >
                <i class="fa fa-caret-up" aria-hidden="true" [style.color]="config.FontColor"></i>
            </td>
            <td rowspan="3" class="divider">:</td>
            <td class="selectbtn" (click)="addMinute()" (wheel)="minuteScroll($event)" [style.color]="config.FontColor">
                <i class="fa fa-caret-up" aria-hidden="true"></i>
            </td>
            <td class="selectbtn" (click)="toggleMeridiem($event)" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat" [style.color]="config.FontColor">
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
            <td class="selectbtn" (click)="subtractHour()" (wheel)="hourScroll($event)" [style.color]="config.FontColor">
                <i class="fa fa-caret-down" aria-hidden="true"></i>
            </td>
            <td class="selectbtn" (click)="subtractMinute()" (wheel)="minuteScroll($event)" [style.color]="config.FontColor">
                <i class="fa fa-caret-down" aria-hidden="true"></i>
            </td>
            <td class="selectbtn" (click)="toggleMeridiem($event)" (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat" [style.color]="config.FontColor">
                <i class="fa fa-caret-down" aria-hidden="true"></i>
                </td>
            </tr>
        </tbody>
        </table>
`,
    styleUrls: ['./time-picker.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCTimePickerComponent implements OnInit, OnChanges {

    public is24HourFormat: boolean;

    @Input() newDate: moment.Moment;
    @Input() config: DatePickerConfig;
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
