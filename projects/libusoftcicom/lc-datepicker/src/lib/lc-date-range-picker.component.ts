import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	HostBinding,
	Input,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	ViewChild,
} from '@angular/core';
import {DatePickerConfig} from './lc-date-picker-config-helper';
import {Subscription} from 'rxjs';
import {Panel} from './base-date-picker.class';
import {DateTime} from './date-time.class';
import {LCDatePickerAdapter} from './lc-date-picker-adapter.class';
import {DatePicker} from './date-picker.class';
import {ECalendarNavigation, ECalendarType} from './enums';

export enum DateType {
	From,
	To,
}

@Component({
    selector: 'lc-date-range-picker',
    templateUrl: 'lc-date-range-picker.component.html',
    styleUrls: ['./lc-date-range-picker.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LCDateRangePickerComponent implements OnInit, AfterViewInit, OnDestroy {

    public activePanelFrom: Panel;
    public activePanelTo: Panel;

    public selectedDateTimeFrom: DateTime;
    public selectedDateTimeTo: DateTime;
    public DateType: typeof DateType = DateType;

    private datePickerFrom: DatePicker;
    private datePickerTo: DatePicker;

    @HostBinding('style.margin-top')
    public componentMargin;

    @HostBinding('attr.tabindex')
    public tabIndex = 0;


    @Input() public valueFrom: DateTime;
    @Input() public valueTo: DateTime;
    @Input() public config: DatePickerConfig;
    @Output() public openedChange: EventEmitter<void> = new EventEmitter<void>();
    @Output() public dateChange: EventEmitter<DateTime[]> = new EventEmitter<DateTime[]>();

    @ViewChild('labelFrom', { static: false })
    public labelFromElement: ElementRef<HTMLDivElement>;

    @ViewChild('labelTo', { static: false })
    public labelToElement: ElementRef<HTMLDivElement>;

    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly cd: ChangeDetectorRef,
        private readonly _elementRef: ElementRef,
        private readonly renderer: Renderer2,
        private readonly dateAdapter: LCDatePickerAdapter
    ) {}

    public ngOnInit(): void {

        this.config.setHostElement(this._elementRef.nativeElement);
        this.initCalendar();

        this.cd.detectChanges();
    }

    public ngAfterViewInit(): void {

        this.setStyles();

        this.cd.detectChanges();
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions.length = 0;

        this.cd.detach();
    }

    public onDayChanged(type: DateType, date: DateTime): void {
        
        switch (type) {
			case DateType.From:
                this.selectedDateTimeFrom = date.clone();
                break;
			case DateType.To:
                this.selectedDateTimeTo = date.clone();
                break;
		}
    }

    public onMonthChanged(type: DateType, date: DateTime): void {

        switch (type) {
			case DateType.From:
                this.selectedDateTimeFrom =
                    this.dateAdapter.setParts(
                        this.selectedDateTimeFrom,
                        { month: date.getMonth(), year: date.getYear() }
                    );
                break;
			case DateType.To:
                this.selectedDateTimeTo =
                    this.dateAdapter.setParts(
                        this.selectedDateTimeTo,
                        { month: date.getMonth(), year: date.getYear() }
                    );
                break;
		}
    }

    public onYearChanged(type: DateType, date: DateTime): void {

        switch (type) {
			case DateType.From:
                this.selectedDateTimeFrom =
                    this.dateAdapter.setParts(this.selectedDateTimeFrom, {year: date.getYear() });
                break;
			case DateType.To:
                this.selectedDateTimeTo =
                    this.dateAdapter.setParts(this.selectedDateTimeTo, { year: date.getYear() });
                break;
		}
    }

    public onDaySelected(type: DateType, date: DateTime): void {

        switch (type) {
            case DateType.From:
                this.selectedDateTimeFrom = date.clone();
                break;
            case DateType.To:
                this.selectedDateTimeTo = date.clone();
                break;
        }

        this.dateChange.emit([this.selectedDateTimeFrom, this.selectedDateTimeTo]);
        this.config.focus();
    }

    public onMonthSelected(type: DateType, date: DateTime): void {

        switch (type) {
            case DateType.From:
                this.selectedDateTimeFrom =
                    this.dateAdapter.setParts(
                        this.selectedDateTimeFrom,
                        { month: date.getMonth(), year: date.getYear() }
                    );
                break;
            case DateType.To:
                this.selectedDateTimeTo =
                    this.dateAdapter.setParts(
                        this.selectedDateTimeTo,
                        { month: date.getMonth(), year: date.getYear() }
                    );
                break;
        }

        this.dateChange.emit([this.selectedDateTimeFrom, this.selectedDateTimeTo]);

		if (this.datePickerFrom.getCalendarType() !== ECalendarType.MonthYear) {
			this.onSwitchPanel(type, Panel.Day);
		}
    }

    public onYearSelected(type: DateType, date: DateTime): void {

        switch (type) {
            case DateType.From:
                this.selectedDateTimeFrom =
                    this.dateAdapter.setParts(this.selectedDateTimeFrom, {year: date.getYear()});
                break;
            case DateType.To:
                this.selectedDateTimeTo =
                    this.dateAdapter.setParts(this.selectedDateTimeTo, {year: date.getYear()});
                break;
        }

        this.dateChange.emit([this.selectedDateTimeFrom, this.selectedDateTimeTo]);
		if (this.datePickerFrom.getCalendarType() !== ECalendarType.Year) {
			this.onSwitchPanel(type, Panel.Month);
		}
    }

    public onSwitchPanel(type: DateType, panel: Panel): void {

        switch (type) {
            case DateType.From:
                this.datePickerFrom.setPanel(panel);
                this.activePanelFrom = this.getActivePanel(type);
                break;
            case DateType.To:
                this.datePickerTo.setPanel(panel);
                this.activePanelTo = this.getActivePanel(type);
                break;
        }
        this.cd.detectChanges();
        this.config.focus();
    }

    public onReset(type: DateType): void {

        switch(type) {
            case DateType.From:
                this.resetDatePickerFrom();
                break;
            case DateType.To:
                this.resetDatePickerTo();
                break;
        }

        this.cd.detectChanges();
    }

    public confirm(): void {
        this.dateChange.emit([this.selectedDateTimeFrom, this.selectedDateTimeTo]);
        this.openedChange.emit();
    }

    public close(): void {
        this.openedChange.emit();
    }

    private getActivePanel(type: DateType): Panel {
        return type === DateType.From ? this.datePickerFrom.getActivePanel() : this.datePickerTo.getActivePanel();
    }

    private initCalendar(): void {

		this.initializeDatepickers();

        this.activePanelFrom = this.datePickerFrom.getActivePanel();
        this.activePanelTo = this.datePickerTo.getActivePanel();

		this.setDateTimes();

        this.subscriptions.push(this.config.navigationChanges.subscribe((dir) => this.navigation(dir)));
        this.subscriptions.push(
            this.datePickerFrom.panelChanges.subscribe((type) => {
                this.activePanelFrom = type;
                this.cd.detectChanges();
            })
        );
        this.subscriptions.push(
            this.datePickerTo.panelChanges.subscribe((type) => {
                this.activePanelTo = type;
                this.cd.detectChanges();
            })
        );

        this._elementRef.nativeElement.focus();
    }

    private navigation(dir: ECalendarNavigation): void {
        if (dir === ECalendarNavigation.Close) {
            this.close();
        }
        if (dir === ECalendarNavigation.Confirm) {
            this.confirm();
        }
    }

    private setStyles(): void {
        
        this.renderer.setStyle(this.labelFromElement.nativeElement, 'background', this.config.theme.primaryColor);
        this.renderer.setStyle(this.labelToElement.nativeElement, 'background', this.config.theme.primaryColor);
    }

    private resetDatePickerFrom(): void {
        switch (this.datePickerFrom.getCalendarType()) {
            case ECalendarType.Date:
                this.selectedDateTimeFrom = this.dateAdapter.today(this.config.getTimezone());
                break;
            case ECalendarType.DateTime:
            case ECalendarType.Time:
                this.selectedDateTimeFrom = this.dateAdapter.now(this.config.getTimezone());
                break;
            case ECalendarType.MonthYear:
                this.selectedDateTimeFrom =
                    this.dateAdapter.getStartOfMonth(this.dateAdapter.today(this.config.getTimezone()));
                break;
            case ECalendarType.Year:
                this.selectedDateTimeFrom =
                    this.dateAdapter.getStartOfYear(this.dateAdapter.today(this.config.getTimezone()));
                break;
            default:
                break;
        }
    }

    private resetDatePickerTo(): void {
        switch (this.datePickerTo.getCalendarType()) {
            case ECalendarType.Date:
                this.selectedDateTimeTo = this.dateAdapter.today(this.config.getTimezone());
                break;
            case ECalendarType.DateTime:
            case ECalendarType.Time:
                this.selectedDateTimeTo = this.dateAdapter.now(this.config.getTimezone());
                break;
            case ECalendarType.MonthYear:
                this.selectedDateTimeTo =
                    this.dateAdapter.getStartOfMonth(this.dateAdapter.today(this.config.getTimezone()));
                break;
            case ECalendarType.Year:
                this.selectedDateTimeTo =
                    this.dateAdapter.getStartOfYear(this.dateAdapter.today(this.config.getTimezone()));
                break;
            default:
                break;
        }
    }

	private initializeDatepickers() {

		let calendarType: ECalendarType = this.config.getCalendarType();

		if (
			calendarType === ECalendarType.Time
			|| calendarType === ECalendarType.DateTime
			|| calendarType === ECalendarType.DateRange
		) {
			calendarType = ECalendarType.Date;
		}

		this.datePickerFrom = new DatePicker(this.config);
		this.datePickerFrom.setCalendarType(calendarType);
		this.datePickerTo = new DatePicker(this.config);
		this.datePickerTo.setCalendarType(calendarType);
		this.datePickerFrom.setActivePanel(calendarType);
		this.datePickerTo.setActivePanel(calendarType);
	}

	private setDateTimes(): void {

		switch (this.datePickerFrom.getCalendarType()) {
			case ECalendarType.Date:
				this.selectedDateTimeFrom =
					this.dateAdapter.setParts(this.valueFrom,
						{
							hour: 0,
							minute: 0,
							second: 0,
							millisecond: 0
						});
				this.selectedDateTimeTo =
                    this.dateAdapter.setParts(this.valueTo,
                        {
                            hour: 0,
                            minute: 0,
                            second: 0,
                            millisecond: 0
                        });
				break;
			case ECalendarType.MonthYear:
				this.selectedDateTimeFrom =
					this.dateAdapter.setParts(this.valueFrom,
						{
							date: 1,
							hour: 0,
							minute: 0,
							second: 0,
							millisecond: 0
						});
				this.selectedDateTimeTo =
                    this.dateAdapter.setParts(this.valueTo,
                    {
                        date: 1,
                        hour: 0,
                        minute: 0,
                        second: 0,
                        millisecond: 0
                    });
				break;
			case ECalendarType.Year:
				this.selectedDateTimeFrom =
					this.dateAdapter
						.setParts(this.valueFrom,
							{
								month: 0,
								date: 1,
								hour: 0,
								minute: 0,
								second: 0,
								millisecond: 0
							});
				this.selectedDateTimeTo =
                    this.dateAdapter
                        .setParts(this.valueTo,
                        {
                                month: 0,
                                date: 1,
                                hour: 0,
                                minute: 0,
                                second: 0,
                                millisecond: 0
                            });
				break;
		}
	}
}
