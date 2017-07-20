import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import * as moment from 'moment';

export enum Panels {
    Time,
    Day,
    Month,
    Year
}

@Component({
    moduleId: module.id,
    selector: 'lc-day-picker',
    template: `
    <table class="dayPicker" (wheel)="monthScroll($event)">
        <thead align="center">
            <tr>
                <th colspan=7>
                    <div class="selectbtn" >
                        <button (click)="prevMonth($event)"> <i class="fa fa-caret-left fa-lg" aria-hidden="true"></i> </button>
                    </div>
                    <div class="selectbtn" (click)="resetDate($event)">
                        <i class="fa fa-home" aria-hidden="true"></i>
                    </div>
                    <div class="selectbtn monthlabel" (click)="switchPannels($event, panels.Month)">
                        {{tempDate.format('MMMM')}}
                    </div>
                    <div class="selectbtn yearlabel" (click)="switchPannels($event, panels.Year)">
                        {{tempDate.format('YYYY')}}
                    </div>
                    <div class="selectbtn pullRight" >
                        <button (click)="nextMonth($event)"> <i class="fa fa-caret-right fa-lg" aria-hidden="true"></i> </button>
                    </div>
                </th>
            </tr>
        </thead>
        <tbody align="center">
            <tr class="days">
            <td *ngFor="let item of shortDayName" class="dayName"><span>{{item}}</span></td>
            </tr>
            <tr *ngFor="let row of monthData">
            <td *ngFor="let item of row" (click)="dayClick($event, item)" [ngClass]="{'active': item?.active}">
                <button *ngIf="item">{{item?.date}}</button>
            </td>
            </tr>
        </tbody>
        </table>
    `,
    styles: [`button{width:100%;height:100%;background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;border:0;outline:0}td{outline:1px solid transparent;width:32px}td:hover{background:#fff;cursor:default}td.dayName,td.dayName:hover{background:#fff;outline:0}.calendar,button,table{-webkit-box-sizing:border-box;box-sizing:border-box}.calendar{-webkit-box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;display:block;font-size:12px;line-height:14px;margin:5px;width:220px}table{width:100%;height:220px;border-collapse:collapse;border:0;display:table;text-transform:capitalize}.dateTimeToggle{width:220px;height:20px;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{height:25px;background:#5e666f}thead tr,thead tr button{color:#f0f8ff}tr.days{height:25px;color:#5e666f;border-bottom:1px solid #d8d8d8;background:#f0f8ff}tr.days td{border:0}td.active{background:rgba(94,102,111,.05)}td.active,td:hover{outline:1px solid #5e666f}.selectbtn{cursor:pointer;color:#e0e0e0;float:left;width:28px;text-align:center}.pullRight{float:right}.monthlabel{width:80px}.yearlabel{width:50px}.selectbtn:hover{color:#fbfbfb}.rotateUp{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.rotateDown{-webkit-transform:rotate(90deg);transform:rotate(90deg)}`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCDayPickerComponent implements OnInit, OnChanges {
    public tempDate: moment.Moment;
    public monthData;
    public shortDayName;
    public shortMonthName;
    public panels = Panels;

    @Input() newDate: moment.Moment;
    @Input() config;
    @Output() selected: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();
    @Output() switchPannel: EventEmitter<Panels> = new EventEmitter<Panels>();
    @Output() reset: EventEmitter<void> = new EventEmitter<void>();

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.shortDayName = moment.weekdaysShort(true);
        this.tempDate = moment(this.newDate.toISOString());
        this.formatMonthData();
        this.cd.detectChanges();
    }

    ngOnChanges(changes) {
        if (changes.newDate) {
            this.tempDate = moment(changes.newDate.currentValue.toISOString());
            this.formatMonthData();
            this.cd.detectChanges();
        }
    }

    formatMonthData() {
        const currentDate = moment(this.tempDate.toISOString());
        const daysInPrevMonth = currentDate.startOf('month').weekday() % 7;

        const currentMonth = this.setActiveDate(this.createMonthArray());

        Array.from(Array(daysInPrevMonth).keys()).map((val, index) => {
            currentMonth.unshift(null);
        });

        this.monthData = currentMonth.reduce((rows, key, index) => (index % 7 === 0
            ? rows.push([key])
            : rows[rows.length - 1].push(key)) && rows, []);

        while (this.monthData[this.monthData.length - 1].length < 7) {
            this.monthData[this.monthData.length - 1].push(null);
        }

    }

    createMonthArray() {
        const currentDate = moment(this.tempDate.toISOString());
        const daysinMonth = currentDate.daysInMonth();
        const monthObj = currentDate.startOf('month').toObject();

        return Array.from(Array(daysinMonth).keys()).map((val, index) => {
            return { ...monthObj, date: monthObj.date + index };
        });
    }

    setActiveDate(date: any) {
        const currentDate = this.newDate.toObject();
        if (currentDate.years !== date[0].years || currentDate.months !== date[0].months) {
            return date;
        }
        return date.map(item => {
            if (item.date === currentDate.date) {
                return { ...item, active: true };
            }
            return item;
        });
    }

    nextMonth(event?) {
        const nDate = moment(this.tempDate).add(1, 'months');
        if (nDate.year() > this.config.maxDate.year) {
            return;
        }
        this.tempDate = nDate;
        this.formatMonthData();
        this.cd.detectChanges();
    }

    prevMonth(event?) {
        const nDate = moment(this.tempDate).subtract(1, 'months');
        if (nDate.year() < this.config.minDate.year) {
            return;
        }
        this.tempDate = nDate;
        this.formatMonthData();
        this.cd.detectChanges();
    }

    dayClick(event: Event, item: any) {
        if (!item) {
            return;
        }

        const date = moment(this.newDate.toISOString());
        date.date(item.date);
        date.month(item.months);
        date.year(item.years);
        this.newDate = date;
        this.tempDate = date;
        this.selected.emit(date);
        this.formatMonthData();
        this.cd.markForCheck();
    }

    monthScroll(event: WheelEvent) {
        this.preventDefault(event);
        this.stopPropagation(event);
        if (event.deltaY < 0) {
            this.nextMonth();
        }
        if (event.deltaY > 0) {
            this.prevMonth();
        }
    }

    switchPannels(event: Event, panel: Panels) {
        this.switchPannel.emit(panel);
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
