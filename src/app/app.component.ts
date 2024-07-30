import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy, OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { DatePickerConfig } from '@libusoftcicom/lc-datepicker';
import { Panel } from '@libusoftcicom/lc-datepicker/base-date-picker.class';
import { DateTime } from '@libusoftcicom/lc-datepicker/date-time.class';
import {ECalendarType} from '@libusoftcicom/lc-datepicker/enums';
import {LCDatePickerAdapter} from '@libusoftcicom/lc-datepicker/lc-date-picker-adapter.class';
import { Subscription } from 'rxjs';

@Component({
	selector: 'lc-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
	public title = 'LC DatePicker';
	public year = new Date().getFullYear();
	public dateConfig = new DatePickerConfig();
	public dateRangeConfig: DatePickerConfig;

	public inputDate: DateTime;
	public inputRangeDateFrom: DateTime;
	public inputRangeDateTo: DateTime;

	public randomDisabledDates: DateTime[] = [];

	@ViewChild('dateInput', { static: true })
	public dateInput: ElementRef;

	@ViewChild('dateRangeInput', { static: true })
	public dateRangeInput: ElementRef;

  private readonly subscriptions: Subscription[] = [];

	constructor(
		private readonly renderer: Renderer2,
		private readonly cd: ChangeDetectorRef,
		private readonly dateAdapter: LCDatePickerAdapter,
	) {

		this.dateConfig.setCalendarType(ECalendarType.Date);
		this.dateConfig.setLocalization('hr');
		this.dateConfig.setActivePanel(Panel.Day);
		this.dateConfig.setTimeFormat(false);
		this.dateConfig.setTimezone('Europe/Zagreb');

		const minDate =
			this.dateAdapter.subtract(
				this.dateAdapter.subtract(this.dateAdapter.today(this.dateConfig.getTimezone()),
					40, 'day'),
				100, 'year');

		const maxDate =
			this.dateAdapter.add(
				this.dateAdapter.add(this.dateAdapter.today(this.dateConfig.getTimezone()),
					40, 'day'),
				100, 'year');

		this.dateConfig.setMinDate(minDate);
		this.dateConfig.setMaxDate(maxDate);

		// define range of unavailable dates
		this.generateRandomDisabledDates();

		// define range of unavailable time
		this.setDisabledTimeRanges();

		this.dateConfig.labels = { confirmLabel: 'OK' };

		this.dateConfig.theme.primaryColor = '#5e666f';
		this.dateConfig.theme.fontColor = '#5e666f';

    this.dateRangeConfig = this.dateConfig.clone();

		this.inputDate = this.dateAdapter.now(this.dateConfig.getTimezone());
		this.inputRangeDateFrom = this.dateAdapter.today(this.dateConfig.getTimezone());
		this.inputRangeDateTo = this.dateAdapter.add(this.inputRangeDateFrom, 1, 'day');

		this.registerKeyNavigation();
	}

  public ngOnInit(): void {

    this.subscriptions.push(
      this.dateConfig.getOpenChanges().subscribe((open) => {
        if (open) {
          this.dateConfig.focus();
        } else {
          this.dateInput.nativeElement.click();
          this.dateInput.nativeElement.select();
        }
      })
    );

    this.subscriptions.push(
      this.dateRangeConfig.getOpenChanges().subscribe((open) => {
        if (open) {
          this.dateRangeConfig.focus();
        } else {
          this.dateRangeInput.nativeElement.click();
          this.dateRangeInput.nativeElement.select();
        }
      })
    );
  }

	public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.length = 0;
    this.cd.detach();
  }

  public openCalendar(): void {
    this.dateConfig.setOpen(true);
    this.dateConfig.focus();
  }

  public toggleCalendarOpen(): void {
    this.dateConfig.setOpen(!this.dateConfig.isOpen());
  }

  public openCalendarRange(): void {
    this.dateRangeConfig.setOpen(true);
    this.dateRangeConfig.focus();
  }

	public clearCalendar(): void {
		this.dateInput.nativeElement.value = '';
	}

	public updateLocalization(value): void {
		this.dateConfig.setLocalization(value);
		this.dateRangeConfig.setLocalization(value);
	}

	public get CalendarType() {
		return this.dateConfig.getCalendarType();
	}

	public set CalendarType(value: ECalendarType) {
		this.dateConfig.setCalendarType(1 * value);
		this.dateRangeConfig.setCalendarType(1 * value);
	}
	public get Localization() {
		return this.dateConfig.getLocalization();
	}

	public set Localization(value: string) {
		this.dateConfig.setLocalization(value);
		this.dateRangeConfig.setLocalization(value);
	}

	public get ConfirmLabel() {
		return this.dateConfig.labels.confirmLabel;
	}

	public set ConfirmLabel(value: string) {
		this.dateConfig.labels.confirmLabel = value;
		this.dateRangeConfig.labels.confirmLabel = value;
	}

	public get FromLabel() {
		return this.dateConfig.fromLabel;
	}

	public set FromLabel(value: string) {
		this.dateConfig.fromLabel = value;
		this.dateRangeConfig.fromLabel = value;
	}
	public get ToLabel() {
		return this.dateConfig.toLabel;
	}

	public set ToLabel(value: string) {
		this.dateConfig.toLabel = value;
		this.dateRangeConfig.toLabel = value;
	}

	public get PrimaryColor() {
		return this.dateConfig.theme.primaryColor;
	}

	public set PrimaryColor(value: string) {
		this.dateConfig.theme.primaryColor = value;
		this.dateRangeConfig.theme.primaryColor = value;
	}

	public get FontColor() {
		return this.dateConfig.theme.fontColor;
	}

	public set FontColor(value: string) {
		this.dateConfig.theme.fontColor = value;
		this.dateRangeConfig.theme.fontColor = value;
	}

	public setCalendarDate(dateTime: DateTime): void {
		this.dateInput.nativeElement.value = this.dateAdapter.toISOString(dateTime);
	}

	public setCalendarDateRange(dateRange: DateTime[]): void {
		const dateFrom = this.dateAdapter.toISOString(dateRange[0]);
		const dateTo = this.dateAdapter.toISOString(dateRange[1]);
		this.dateRangeInput.nativeElement.value = dateFrom + '/' + dateTo;
	}

	public focusInput(isOpen: boolean): void {
		if (!isOpen) {
			this.dateInput.nativeElement.click();
			this.dateInput.nativeElement.select();
		}
	}

	public focusInputRange(isOpen: boolean): void {
		if (!isOpen) {
			this.dateRangeInput.nativeElement.click();
			this.dateRangeInput.nativeElement.select();
		}
	}

	private generateRandomDisabledDates(): void {
		this.randomDisabledDates = Array(7)
			.fill(null)
			.map(() => {
				const rand = Math.floor(Math.random() * (15 - -15) + -15);
				return this.dateAdapter.add(this.dateAdapter.today(this.dateConfig.getTimezone()), rand, 'days');
			});

		this.dateConfig.setDisabledDates(this.randomDisabledDates);
	}

	private setDisabledTimeRanges() {
		this.dateConfig.addDisabledTimeRange({
			startTime: { hour: 0, minute: 0 },
			stopTime: { hour: 7, minute: 59 },
		});

		this.dateConfig.addDisabledTimeRange({
			startTime: { hour: 14, minute: 0 },
			stopTime: { hour: 16, minute: 59 },
		});

		this.dateConfig.addDisabledTimeRange({
			startTime: { hour: 21, minute: 0 },
			stopTime: { hour: 23, minute: 59 },
		});
	}

	/**
	 * demo implementation
	 * keyboard navigation
	 */
	private registerKeyNavigation(): void {
		this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
			if (!this.dateConfig.isFocused()) {
				return;
			}

			event.preventDefault();

			if (event.key === "ArrowRight" && event.shiftKey) {
				this.changePanelType(1);
			}

			if (event.key === "ArrowLeft" && event.shiftKey) {
				this.changePanelType(-1);
			}

			if (event.key === "ArrowUp") {
				this.dateConfig.navigateUp();
			}
			if (event.key === "ArrowDown") {
				this.dateConfig.navigateDown();
			}

			if (event.key === "ArrowRight" && !event.shiftKey) {
				this.dateConfig.navigateRight();
			}

			if (event.key === "ArrowLeft" && !event.shiftKey) {
				this.dateConfig.navigateLeft();
			}

			if (event.key === "Enter") {
				this.dateConfig.confirm();
			}

			if (event.key === "Escape") {
				this.dateConfig.close();
			}

			if (event.key === "PageDown") {
				this.dateConfig.nextPage();
			}
			if (event.key === "PageUp") {
				this.dateConfig.previousPage();
			}
		});
	}

	/**
	 * just for demo
	 */
	private changePanelType(jump: number) {
		const calendarKeys = Object.keys(ECalendarType).filter((val) => isNaN(parseInt(val)));
		const currentIndex = calendarKeys.findIndex((type) => this.dateConfig.getCalendarType() === ECalendarType[type]);

		if (currentIndex + jump < calendarKeys.length && currentIndex + jump >= 0) {
			this.dateConfig.setOpen(false);
			this.cd.detectChanges();
			this.dateConfig.setCalendarType(ECalendarType[calendarKeys[currentIndex + jump]]);
      this.dateConfig.setOpen(true);
			this.cd.detectChanges();
		} else if (currentIndex + jump >= calendarKeys.length) {
      this.dateConfig.setOpen(false);
			this.cd.detectChanges();
			this.dateConfig.setCalendarType(ECalendarType[calendarKeys[0]]);
      this.dateConfig.setOpen(true);
			this.cd.detectChanges();
		} else {
      this.dateConfig.setOpen(false);
			this.cd.detectChanges();
			this.dateConfig.setCalendarType(ECalendarType[calendarKeys[calendarKeys.length - 1]]);
      this.dateConfig.setOpen(true);
			this.cd.detectChanges();
		}
	}
}
