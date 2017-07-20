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
        <thead align="center"  [style.background]="config.PrimaryColor">
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
                <button (click)="setMonth($event, item.key)" [style.color]="config.FontColor">{{item.key}}</button>
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
