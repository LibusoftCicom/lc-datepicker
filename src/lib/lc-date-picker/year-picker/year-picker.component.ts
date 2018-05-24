import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { DatePickerConfig, ECalendarNavigation } from './../lc-date-picker-config-helper';
import moment from 'moment-es6';
import { Subscription } from 'rxjs';

export interface IYearobject {
    year?: number;
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
        <td *ngFor="let item of row" (click)="setYear(item, $event)" [ngClass]="{'active': item?.active, 'current': item?.current, 'disabled': item?.disabled}">
            <button [style.color]="config.FontColor">{{item?.year}}</button>
        </td>
        </tr>
    </tbody>
    </table>
`,
    styleUrls: ['./year-picker.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCYearPickerComponent implements OnInit, OnChanges, OnDestroy {

    public tempYear: number;
    public initYear: number;
    public yearsArray: IYearobject[] = [];
    public yearsArrayFormated: IYearobject[][];

    @Input() newDate: moment.Moment;
    @Input() config: DatePickerConfig;
    @Output() selected: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();
    @Output() reset: EventEmitter<void> = new EventEmitter<void>();

    private navigationSubscription: Subscription;
    private selectedItem: IYearobject = null;

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.navigationSubscription = this.config.navigationChanges.subscribe((dir) => this.navigate(dir));
        this.initCalendar();
    }

    ngOnChanges(changes) {
        if (changes.newDate) {
            this.initCalendar();
            this.cd.detectChanges();
        }
    }

    ngOnDestroy() {
        this.navigationSubscription.unsubscribe();
        this.cd.detach();
    }

    private initCalendar() {
        this.tempYear = moment(this.newDate.toISOString()).year();
        this.initYear = moment(this.newDate.toISOString()).year();
        this.checkInitYear();
        this.formatYears();
    }

    private navigate(dir:ECalendarNavigation): void {
        switch(dir) {
            case ECalendarNavigation.Confirm:
                return this.setYear(this.selectedItem);
            case ECalendarNavigation.Left:
                this.selectYear(-1);
                break;
            case ECalendarNavigation.Right:
                this.selectYear(1);
                break;
            case ECalendarNavigation.Up:
                this.selectYear(-5);
                break;
            case ECalendarNavigation.Down:
                this.selectYear(5);
                break;
            case ECalendarNavigation.PageUp:
                this.prevYears();
                break;
            case ECalendarNavigation.PageDown:
                this.nextYears();
                break;
        }

        this.formatYears();
        this.cd.detectChanges();
    }

    checkInitYear() {
        let year = this.tempYear;
        if (this.config.MinDate && this.config.MinDate.years) {
            year = Math.max(year, this.config.MinYear);
        }
        if (this.config.MaxDate && this.config.MaxDate.years) {
            year = Math.min(year, this.config.MaxYear);
        }
        this.tempYear = this.initYear = year;
    }

    formatYears() {
        const selectedYear = this.tempYear;
        const currentYear = moment(moment.now()).year();

        let minYear = Math.max(this.config.MinYear, selectedYear - 12);
        let maxYear = Math.min(this.config.MaxYear + 1, minYear + 25);

        if(maxYear - minYear < 25){
            minYear = Math.max(this.config.MinYear, maxYear - 25)
        }

        for(let i = minYear; i < maxYear; i++){
            this.yearsArray[i % minYear] = { year: i };

            if (this.yearsArray[i % minYear].year == currentYear) {
                this.yearsArray[i % minYear].current = true;
            }

            if (this.yearsArray[i % minYear].year == selectedYear) {
                this.yearsArray[i % minYear].active = true;
                this.selectedItem = this.yearsArray[i % minYear];
            }
        }

        let yearsArrayFormated = this.yearsArray.filter(year => year !== null)

        let rows = [];
        for (let z = 0; z < 25; z++) {
            z % 5 === 0
                ? rows.push([yearsArrayFormated[z]])
                : rows[rows.length - 1].push(yearsArrayFormated[z])
        }
        this.yearsArrayFormated = rows;

    }

    prevYears() {
        this.tempYear -= 25;

        if (this.tempYear < this.config.MinYear){
            this.tempYear = this.config.MinYear
        }

        this.formatYears();
        this.cd.detectChanges();
        this.config.focus();
    }


    nextYears() {
        this.tempYear += 25;

        if (this.tempYear > this.config.MaxYear) {
            this.tempYear = this.config.MaxYear
        }
        this.formatYears();
        this.cd.detectChanges();
        this.config.focus();
    }

    selectYear(jump: number) {
        this.tempYear = this.tempYear+(jump);

        if (this.tempYear < this.config.MinYear){
            this.tempYear = this.config.MinYear
        }
        if (this.tempYear > this.config.MaxYear) {
            this.tempYear = this.config.MaxYear
        }
    }

    setYear(item: IYearobject, event?) {
        if (!item || item.disabled) {
            return;
        }
        this.newDate.year(item.year);
        this.initYear = item.year;
        this.selected.emit(this.newDate);
        this.config.focus();
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
