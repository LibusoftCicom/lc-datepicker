import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';


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
        <td *ngFor="let item of row" (click)="setYear($event, item)" [ngClass]="{'active': item === initYear}">
            <button [style.color]="config.FontColor">{{item}}</button>
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
    public yearsArray: number[] = [];
    public yearsArrayFormated: number[][];

    @Input() newDate: moment.Moment;
    @Input() config;
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
        if (this.config.minDate.years) {
            year = Math.max(year, this.config.minDate.years);
        }
        if (this.config.maxDate.years) {
            year = Math.min(year, this.config.maxDate.years);
        }
        this.tempDate = this.initYear = year;
    }

    formatYears() {
        const currentYear = this.tempDate;
        for (let i = 0; i <= 12; i++) {
            this.yearsArray[12 - i] = +currentYear - i;
            this.yearsArray[12 + i] = +currentYear + i;
        }

        this.yearsArray = this.yearsArray.filter((year) => year >= this.config.minDate.years && year <= this.config.maxDate.years);

        while (this.yearsArray.length < 25) {
            if (this.yearsArray[0] === this.config.minDate.years) {
                this.yearsArray.push(this.yearsArray[this.yearsArray.length - 1] + 1);
            }
            else {
                this.yearsArray.unshift(this.yearsArray[0] - 1);
            }
        }

        this.yearsArrayFormated = this.yearsArray.reduce((rows, key, index) => (index % 5 === 0
            ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows, []);
    }

    prevYears() {
        if (this.yearsArray[0] - 1 < this.config.minDate.years) {
            return;
        }
        this.tempDate -= 25;
        this.formatYears();
        this.cd.detectChanges();
    }


    nextYears() {
        if (this.yearsArray[this.yearsArray.length - 1] + 1 >= this.config.maxDate.years) {
            return;
        }
        this.tempDate += 25;
        this.formatYears();
        this.cd.detectChanges();
    }

    setYear(event, item) {
        if (!item) {
            return;
        }
        this.newDate.year(item);
        this.initYear = item;
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
