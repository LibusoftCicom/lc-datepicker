import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
  OnChanges,
  OnDestroy
} from '@angular/core';
import { DatePickerConfig, ECalendarNavigation } from './../lc-date-picker-config-helper';
import moment from 'moment-es6';
import { Subscription } from 'rxjs';

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
  selector: 'lc-month-picker',
  template: `
    <table class="monthsCal">
      <thead align="center" [style.background]="config.PrimaryColor">
        <tr>
          <th colspan="4">
            <div class="selectbtn">&nbsp;</div>
            <div class="selectbtn" (click)="resetDate($event)"><i class="fa fa-home" aria-hidden="true"></i></div>
            <div class="selectbtn monthlabel">&nbsp;</div>
            <div class="selectbtn yearlabel" (click)="switchPannels($event, panels.Year)">{{ newDate.year() }}</div>
          </th>
        </tr>
      </thead>
      <tbody align="center">
        <tr *ngFor="let row of shortMonthName">
          <td
            *ngFor="let item of row"
            [ngClass]="{ active: item?.active, current: item?.current, disabled: item?.disabled }"
          >
            <button (click)="setMonth(item, $event)" [style.color]="config.FontColor">{{ item.key }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrls: ['./month-picker.component.style.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCMonthPickerComponent implements OnInit, OnChanges, OnDestroy {
  public tempDate: moment.Moment;
  public shortMonthName: Array<Array<IMonthObject>> = [];
  public panels = Panels;

  @Input() newDate: moment.Moment;
  @Input() config: DatePickerConfig;
  @Output() selected: EventEmitter<moment.Moment> = new EventEmitter<moment.Moment>();
  @Output() switchPannel: EventEmitter<Panels> = new EventEmitter<Panels>();
  @Output() reset: EventEmitter<void> = new EventEmitter<void>();

  private navigationSubscription: Subscription;
  private selectedItem: IMonthObject = null;

  constructor(private cd: ChangeDetectorRef) {}

  switchPannels(event: Event, panel: Panels) {
    this.switchPannel.emit(panel);
  }

  ngOnInit() {
    this.navigationSubscription = this.config.navigationChanges.subscribe(dir => this.navigate(dir));
    this.initCalendar();
  }

  ngOnChanges(changes) {
    if (changes.newDate) {
      this.initCalendar();
      this.cd.detectChanges();
    }
  }

  ngOnDestroy() {
    this.cd.detach();
    this.navigationSubscription.unsubscribe();
  }

  private initCalendar() {
    const selectedDate = this.newDate.toObject();
    const currentDate = moment(moment.now()).toObject();
    const monthNames = this.newDate
      .locale(this.config.Localization)
      .localeData()
      .monthsShort();

    let months = monthNames.map((key, index) => {
      let month: IMonthObject = { key, index };

      if (month.index == currentDate.months && selectedDate.years == currentDate.years) {
        month = { ...month, current: true };
      }

      if (
        (month.index > this.config.MaxMonth && selectedDate.years == this.config.MaxYear) ||
        (month.index < this.config.MinMonth && selectedDate.years == this.config.MinYear)
      ) {
        month = { ...month, disabled: true };
      }

      if (month.index == selectedDate.months) {
        month = { ...month, active: true };
        this.selectedItem = month;
      }

      return month;
    });

    this.shortMonthName = this.formatMonths(months);
  }

  private navigate(dir: ECalendarNavigation): void {
    if (dir == ECalendarNavigation.Confirm) {
      return this.setMonth(this.selectedItem);
    } else if (dir == ECalendarNavigation.Left) {
      this.newDate.month(this.selectedItem.index - 1);
    } else if (dir == ECalendarNavigation.Right) {
      this.newDate.month(this.selectedItem.index + 1);
    } else if (dir == ECalendarNavigation.Up) {
      this.newDate.month(this.selectedItem.index - 3);
    } else if (dir == ECalendarNavigation.Down) {
      this.newDate.month(this.selectedItem.index + 3);
    }

    this.initCalendar();
    this.cd.detectChanges();
  }

  formatMonths(months: IMonthObject[]) {
    return months.reduce(
      (rows, month, index) => (index % 3 === 0 ? rows.push([month]) : rows[rows.length - 1].push(month)) && rows,
      []
    );
  }

  setMonth(item?: IMonthObject, event?) {
    if (!item || item.disabled) {
      return;
    }
    // this.selectedItem.active = false;
    // item.active = true;
    // this.selectedItem = item;
    this.newDate.month(item.key);
    this.initCalendar();
    this.selected.emit(this.newDate);
  }

  resetDate(event) {
    this.reset.emit();
  }
}
