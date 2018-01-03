import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import * as moment from 'moment';


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
    styles: [`.calendar,button,table{-webkit-box-sizing:border-box;box-sizing:border-box}button{height:100%;background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;border:0;outline:0;padding:0;width:32px}.yearsCal td{min-width:30px;padding:5px 0;outline:1px solid transparent}.calendar,table{width:220px}.calendar{-webkit-box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;display:block;font-size:12px;line-height:14px;margin:5px}table{height:220px;border-collapse:collapse;border:0}.dateTimeToggle{width:220px;height:20px;background:#e4e4e4;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#efefef}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{height:25px}thead tr,thead tr button{color:#f0f8ff}.yearsCal td.disabled{background:rgba(234,234,234,.05)}.yearsCal td.current{background:rgba(94,102,111,.05)}.yearsCal td.disabled button{color:#bbc9d8!important;cursor:default}.yearsCal td.active,.yearsCal td:not(.disabled):hover{outline:1px solid #5e666f}.selectbtn{cursor:pointer;color:#e0e0e0;float:left;width:30px}.pullRight{float:right}.monthlabel{width:80px}.yearlabel{width:50px}`],
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
        if (this.config.MinDate.years) {
            year = Math.max(year, this.config.MinYear);
        }
        if (this.config.MaxDate.years) {
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

            if( yearBefore.year > this.config.MaxYear || yearBefore.year < this.config.MinYear){
                yearBefore.disabled = true;
            }

            if( yearAfter.year == currentYear ){
                yearAfter.current = true;
            }

            if( yearAfter.year == selectedYear ){
                yearAfter.active = true;
            }

            if( yearAfter.year > this.config.MaxYear || yearAfter.year < this.config.MinYear){
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
