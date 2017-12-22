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
    styleUrls: ['./month-picker.component.style.css'],
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
