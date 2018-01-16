import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import moment from 'moment-es6';


export interface IYearobject {
    year: number;
    active?: boolean;
    disabled?: boolean;
    current?: boolean;
}

@Component({
    moduleId: module.id,
    selector: 'lc-year-picker',
    template: `
    <table class="yearsCal" (wheel)="yearScroll($event)">
    <thead align="center"  [style.background]="config.PrimaryColor">
        <tr>
            <th colspan="5">
                <div class="selectbtn" >
                    <button (click)="prevYears()"> <i class="fa fa-caret-left fa-lg" aria-hidden="true"></i> </button>
                </div>
                <div class="selectbtn" (click)="resetDate($event)"> <i class="fa fa-home" aria-hidden="true"></i> </div>
                <div class="selectbtn pullRight" >
                    <button (click)="nextYears()"> <i class="fa fa-caret-right fa-lg" aria-hidden="true"></i> </button>
                </div>
            </th>
        </tr>
    </thead>
    <tbody align="center">
        <tr *ngFor="let row of yearsArrayFormated">
        <td *ngFor="let item of row" (click)="setYear($event, item)" [ngClass]="{'active': item?.active, 'current': item?.current, 'disabled': item?.disabled}">
            <button [style.color]="config.FontColor">{{item?.year}}</button>
        </td>
        </tr>
    </tbody>
    </table>
`,
    styleUrls: ['./year-picker.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCYearPickerComponent implements OnInit, OnChanges {

    public tempDate: number;
    public initYear: number;
    public yearsArray: IYearobject[] = [];
    public yearsArrayFormated: IYearobject[][];

    @Input() newDate: moment.Moment;
    @Input() config: DatePickerConfig;
    @Output() selected: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();
    @Output() reset: EventEmitter<void> = new EventEmitter<void>();

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.tempDate = moment(this.newDate.toISOString()).year();
        this.initYear = moment(this.newDate.toISOString()).year();
        this.checkInitYear();
        this.formatYears();
    }

    ngOnChanges(changes) {
        if (changes.newDate) {
            this.ngOnInit();
            this.cd.detectChanges();
        }
    }

    checkInitYear() {
        let year = this.tempDate;
        if (this.config.MinDate && this.config.MinDate.years) {
            year = Math.max(year, this.config.MinYear);
        }
        if (this.config.MaxDate && this.config.MaxDate.years) {
            year = Math.min(year, this.config.MaxYear);
        }
        this.tempDate = this.initYear = year;
    }

    formatYears() {
        const selectedYear = this.tempDate;
        const currentYear = moment(moment.now()).year();

        for (let i = 0; i <= 12; i++) {

            let yearBefore: IYearobject = this.yearsArray[12 - i] = { year: +selectedYear - i };
            let yearAfter: IYearobject = this.yearsArray[12 + i] = { year: +selectedYear + i };

            if( yearBefore.year == currentYear ){
                yearBefore.current = true;
            }

            if( yearBefore.year == selectedYear ){
                yearBefore.active = true;
            }

            if( this.config.MaxYear && yearBefore.year > this.config.MaxYear || 
                this.config.MinYear && yearBefore.year < this.config.MinYear){
                yearBefore.disabled = true;
            }

            if( yearAfter.year == currentYear ){
                yearAfter.current = true;
            }

            if( yearAfter.year == selectedYear ){
                yearAfter.active = true;
            }

            if( this.config.MaxYear && yearAfter.year > this.config.MaxYear || 
                this.config.MinYear && yearAfter.year < this.config.MinYear){
                yearAfter.disabled = true;
            }
        }

        this.yearsArrayFormated = this.yearsArray.reduce((rows, key, index) => (index % 5 === 0
            ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows, []);
    }

    prevYears() {
        this.tempDate -= 25;
        this.formatYears();
        this.cd.detectChanges();
    }


    nextYears() {
        this.tempDate += 25;
        this.formatYears();
        this.cd.detectChanges();
    }

    setYear(event, item?: IYearobject) {
        if (!item || item.disabled) {
            return;
        }
        this.newDate.year(item.year);
        this.initYear = item.year;
        this.selected.emit(this.newDate);
    }

    yearScroll(event) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.nextYears();
        }
        if (event.deltaY > 0) {
            this.prevYears();
        }
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
