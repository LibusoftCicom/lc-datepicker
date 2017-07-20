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
    selector: 'lc-month-picker',
    template: `
    <table class="monthsCal">
        <thead align="center">
            <tr>
                <th colspan="4">
                    <div class="selectbtn"> &nbsp; </div>
                    <div class="selectbtn" (click)="resetDate($event)"> <i class="fa fa-home" aria-hidden="true"></i> </div>
                    <div class="selectbtn monthlabel"> &nbsp; </div>
                    <div class="selectbtn yearlabel" (click)="switchPannels($event, panels.Year)"> {{newDate.year()}}</div>
                </th>
            </tr>
        </thead>
        <tbody align="center">
            <tr *ngFor="let row of shortMonthName">
            <td *ngFor="let item of row" [ngClass]="{'active': this.newDate.month() === item.index}">
                <button (click)="setMonth($event, item.key)">{{item.key}}</button>
            </td>
            </tr>
        </tbody>
    </table>
`,
    styles: [`button{width:100%;height:100%;background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;border:0;outline:0;text-transform:capitalize}.monthsCal td{min-width:30px;padding:5px 0}td:hover{background:#efefef}.calendar,button,table{-webkit-box-sizing:border-box;box-sizing:border-box}.calendar{-webkit-box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;display:block;font-size:12px;line-height:14px;margin:5px;width:220px}table{width:100%;height:220px;border-collapse:collapse;border:0;display:table}.dateTimeToggle{width:220px;height:20px;background:#e4e4e4;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#efefef}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{background:#5e666f;color:#f0f8ff}thead tr,tr.days{height:25px}tr.days td{border:0}td.active{background:rgba(94,102,111,.05)}td.active,td:hover{outline:1px solid #5e666f}.selectbtn{cursor:pointer;color:#e0e0e0;float:left;width:30px}.pullRight{float:right}.monthlabel{width:80px}.yearlabel{width:50px}`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCMonthPickerComponent implements OnInit, OnChanges {

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

    switchPannels(event: Event, panel: Panels) {
        this.switchPannel.emit(panel);
    }

    ngOnInit() {
        const monthNames = this.newDate.locale(this.config.localization).localeData().monthsShort();
        this.shortMonthName = this.formatMonths(monthNames);
    }

    ngOnChanges(changes) {
        if (changes.newDate) {
            this.ngOnInit();
            this.cd.detectChanges();
        }
    }

    formatMonths(months: string[]) {
        return months.reduce((rows, key, index) => (index % 3 === 0
            ? rows.push([{ key, index }])
            : rows[rows.length - 1].push({ key, index })) && rows, []);
    }

    setMonth(event, item) {
        if (!item) {
            return;
        }
        this.newDate.month(item);
        this.selected.emit(this.newDate);
    }

    resetDate(event) {
        this.reset.emit();
    }
}
