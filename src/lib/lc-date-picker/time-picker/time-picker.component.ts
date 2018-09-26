import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, ElementRef, Renderer2 } from '@angular/core';
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
                <td class="timeDigit" #periods (wheel)="toggleMeridiem($event)" *ngIf="!is24HourFormat">{{newDate.format('A')}}</td>
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
export class LCTimePickerComponent implements OnInit {

    public is24HourFormat: boolean;

    @Input() newDate: moment.Moment;
    @Input() config: DatePickerConfig;
    @Output() selected: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();
    @Output() reset: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private cd: ChangeDetectorRef,
        private renderer: Renderer2,
        private elementRef: ElementRef
        ) {}

    ngOnInit() {
        this.setTimeFormat();
        this.updateTime(false);
    }

    ngOnChanges(changes) {
        if (changes.newDate) {
            this.updateTime(false);
        }
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

    updateTime(reverse){

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
                else{
                    this.newDate.hour(maximumTime.hour())
                    this.newDate.minutes(maximumTime.minutes())
                    this.newDate.add(1, 'm');
                }
                updatedTime = true;
                return;
            }
        })

        if(updatedTime){

            this.updateTime(reverse);
            return;
        }

        this.selected.emit(this.newDate);
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
        this.forcePeriodsRedraw();
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

    private forcePeriodsRedraw() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
        const h = this.elementRef.nativeElement.offsetHeight;
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'block');
    }
}
