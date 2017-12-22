import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { DatePickerConfig } from './../lc-date-picker-config-helper';
import * as moment from 'moment';

export enum Panels {
    Time,
    Day,
    Month,
    Year
}

export interface IMonthObject {
    key: string;
    index: number;
    active?: boolean;
    disabled?: boolean;
    current?: boolean;
}

@Component({
    moduleId: module.id,
    selector: 'lc-month-picker',
    template: `
    <table class="monthsCal">
        <thead align="center" [style.background]="config.PrimaryColor">
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
            <td *ngFor="let item of row" [ngClass]="{'active': item?.active, 'current': item?.current, 'disabled': item?.disabled }">
                <button (click)="setMonth($event, item)" [style.color]="config.FontColor">{{item.key}}</button>
            </td>
            </tr>
        </tbody>
    </table>
`,
    styles: [`.calendar,button,table{-webkit-box-sizing:border-box;box-sizing:border-box}button{height:100%;background:0 0;cursor:pointer;display:inline-block;line-height:14px;text-align:center;border:0;outline:0;text-transform:capitalize;width:29px}.monthsCal td{min-width:30px;padding:5px 0}td:hover{background:#efefef}.calendar,table{width:220px}.calendar{-webkit-box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;box-shadow:rgba(0,0,0,.156863) 0 1px 5px 0,rgba(0,0,0,.26) -2px -1px 5px 0;display:block;font-size:12px;line-height:14px;margin:5px}table{height:220px;border-collapse:collapse;border:0;display:table}.dateTimeToggle{width:220px;height:20px;background:#e4e4e4;border-top:1px solid #e4e4e4}.dateTimeToggle button{width:50%;height:100%;float:left;background:0 0}.dateTimeToggle button.active,table{background:#fff}.dateTimeToggle :first-child button{border-right:1px solid #efefef}.confirmDate{width:220px;height:20px;background:#efefef}.confirmDate button{width:100%;height:100%;border-top:1px solid #efefef}thead tr{color:#f0f8ff}thead tr,tr.days{height:25px}tr.days td{border:0}td.active{outline:1px solid #5e666f}td.disabled{background:rgba(234,234,234,.05)}td.current{background:rgba(94,102,111,.05)}td.disabled button{color:#bbc9d8!important}.selectbtn{cursor:pointer;color:#e0e0e0;float:left;width:30px}.pullRight{float:right}.monthlabel{width:80px}.yearlabel{width:50px}`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCMonthPickerComponent implements OnInit, OnChanges {

    public tempDate: moment.Moment;
    public shortMonthName: Array<Array<IMonthObject>> = [];
    public panels = Panels;

    @Input() newDate: moment.Moment;
    @Input() config: DatePickerConfig;
    @Output() selected: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();
    @Output() switchPannel: EventEmitter<Panels> = new EventEmitter<Panels>();
    @Output() reset: EventEmitter<void> = new EventEmitter<void>();

    constructor(private cd: ChangeDetectorRef) { }

    switchPannels(event: Event, panel: Panels) {
        this.switchPannel.emit(panel);
    }

    ngOnInit() {
        const selectedDate = this.newDate.toObject();
        const currentDate = moment(moment.now()).toObject();
        const monthNames = this.newDate.locale(this.config.Localization).localeData().monthsShort();

        let months = monthNames.map(( key, index ) => {
            let month: IMonthObject = { key, index };

            if( month.index == selectedDate.months ){
                month = {...month, active: true };
            }

            if( month.index == currentDate.months && selectedDate.years == currentDate.years ){
                month = {...month, current: true };
            }

            if( month.index > this.config.MaxMonth && selectedDate.years == this.config.MaxYear || 
                month.index < this.config.MinMonth && selectedDate.years == this.config.MinYear ){
                month = {...month, disabled: true };
            }

            return month;
        })

        this.shortMonthName = this.formatMonths(months);
    }

    ngOnChanges(changes) {
        if (changes.newDate) {
            this.ngOnInit();
            this.cd.detectChanges();
        }
    }

    formatMonths(months: IMonthObject[]) {
        return months.reduce((rows, month, index) => (index % 3 === 0
            ? rows.push([month])
            : rows[rows.length - 1].push(month)) && rows, []);
    }

    setMonth(event, item?: IMonthObject) {
        if (!item || item.disabled) {
            return;
        }
        this.newDate.month(item.key);
        this.selected.emit(this.newDate);
    }

    resetDate(event) {
        this.reset.emit();
    }
}
