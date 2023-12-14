import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    Renderer2,
    ViewChild
} from '@angular/core';
import { DatePickerConfig } from '@libusoftcicom/lc-datepicker';
import { Panel } from '@libusoftcicom/lc-datepicker/base-date-picker.class';
import { DateTime } from '@libusoftcicom/lc-datepicker/date-time.class';
import {ECalendarType} from '@libusoftcicom/lc-datepicker/enums';
import {LCDatePickerAdapter} from '@libusoftcicom/lc-datepicker/lc-date-picker-adapter.class';

@Component({
	selector: 'lc-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
	public title = 'LC DatePicker';
	public year = new Date().getFullYear();
	public CalendarOpened = false;
	public CalendarRangeOpened = false;
	public config = new DatePickerConfig();

	public inputDate: DateTime;
	public inputRangeDateFrom: DateTime;
	public inputRangeDateTo: DateTime;

	public randomDisabledDates: DateTime[] = [];

	@ViewChild('dateInput', { static: true })
	public dateInput: ElementRef;

	@ViewChild('dateRangeInput', { static: true })
	public dateRangeInput: ElementRef;

	constructor(
		private readonly renderer: Renderer2,
		private readonly cd: ChangeDetectorRef,
		private readonly dateAdapter: LCDatePickerAdapter,
	) {

		this.config.setCalendarType(ECalendarType.Date);
		this.config.setLocalization('hr');
		this.config.setActivePanel(Panel.Day);
		this.config.setTimeFormat(false);
		this.config.setTimezone('Europe/Zagreb');

		const minDate =
			this.dateAdapter.subtract(
				this.dateAdapter.subtract(this.dateAdapter.today(this.config.getTimezone()),
					40, 'day'),
				100, 'year');

		const maxDate =
			this.dateAdapter.add(
				this.dateAdapter.add(this.dateAdapter.today(this.config.getTimezone()),
					40, 'day'),
				100, 'year');

		this.config.setMinDate(minDate);
		this.config.setMaxDate(maxDate);

		// define range of unavailable dates
		this.generateRandomDisabledDates();

		// define range of unavailable time
		this.setDisabledTimeRanges();

		this.config.labels = { confirmLabel: 'OK' };

		this.config.theme.primaryColor = '#5e666f';
		this.config.theme.fontColor = '#5e666f';
		this.inputDate = this.dateAdapter.now(this.config.getTimezone());
		this.inputRangeDateFrom = this.dateAdapter.today(this.config.getTimezone());
		this.inputRangeDateTo = this.dateAdapter.add(this.inputRangeDateFrom, 1, 'day');

		this.registerKeyNavigation();
	}

	public ngOnDestroy() {
        this.cd.detach();
    }

	public toggleCalendarOpen(): void {
		this.CalendarOpened = !this.CalendarOpened;
		if (this.CalendarOpened) {
			this.config.focus();
		} else {
			this.dateInput.nativeElement.click();
			this.dateInput.nativeElement.select();
		}
        this.cd.detectChanges();
	}
	public toggleCalendarRangeOpen() {
		this.CalendarRangeOpened = !this.CalendarRangeOpened;
		if (this.CalendarRangeOpened) {
			this.config.focus();
		} else {
			this.dateRangeInput.nativeElement.click();
			this.dateRangeInput.nativeElement.select();
		}
        this.cd.detectChanges();
	}

	public clearCalendar() {
		this.dateInput.nativeElement.value = '';
	}

	public updateLocalization(value): void {
		this.config.setLocalization(value);
	}

	public get CalendarType() {
		return this.config.getCalendarType();
	}

	public set CalendarType(value: ECalendarType) {
		this.config.setCalendarType(1 * value);
	}
	public get Localization() {
		return this.config.getLocalization();
	}

	public set Localization(value: string) {
		this.config.setLocalization(value);
	}

	public get ConfirmLabel() {
		return this.config.labels.confirmLabel;
	}

	public set ConfirmLabel(value: string) {
		this.config.labels.confirmLabel = value;
	}

	public get FromLabel() {
		return this.config.fromLabel;
	}

	public set FromLabel(value: string) {
		this.config.fromLabel = value;
	}
	public get ToLabel() {
		return this.config.toLabel;
	}

	public set ToLabel(value: string) {
		this.config.toLabel = value;
	}

	public get PrimaryColor() {
		return this.config.theme.primaryColor;
	}

	public set PrimaryColor(value: string) {
		this.config.theme.primaryColor = value;
	}

	public get FontColor() {
		return this.config.theme.fontColor;
	}

	public set FontColor(value: string) {
		this.config.theme.fontColor = value;
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
				return this.dateAdapter.add(this.dateAdapter.today(this.config.getTimezone()), rand, 'days');
			});

		this.config.setDisabledDates(this.randomDisabledDates);
	}

	private setDisabledTimeRanges() {
		this.config.addDisabledTimeRange({
			startTime: { hour: 0, minute: 0 },
			stopTime: { hour: 7, minute: 59 },
		});

		this.config.addDisabledTimeRange({
			startTime: { hour: 14, minute: 0 },
			stopTime: { hour: 16, minute: 59 },
		});

		this.config.addDisabledTimeRange({
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
			if (!this.config.isFocused()) {
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
				this.config.navigateUp();
			}
			if (event.key === "ArrowDown") {
				this.config.navigateDown();
			}

			if (event.key === "ArrowRight" && !event.shiftKey) {
				this.config.navigateRight();
			}

			if (event.key === "ArrowLeft" && !event.shiftKey) {
				this.config.navigateLeft();
			}

			if (event.key === "Enter") {
				this.config.confirm();
			}

			if (event.key === "Escape") {
				this.config.close();
			}

			if (event.key === "PageDown") {
				this.config.nextPage();
			}
			if (event.key === "PageUp") {
				this.config.previousPage();
			}
		});
	}

	/**
	 * just for demo
	 */
	private changePanelType(jump: number) {
		const calendarKeys = Object.keys(ECalendarType).filter((val) => isNaN(parseInt(val)));
		const currentIndex = calendarKeys.findIndex((type) => this.config.getCalendarType() === ECalendarType[type]);

		if (currentIndex + jump < calendarKeys.length && currentIndex + jump >= 0) {
			this.CalendarOpened = false;
			this.cd.detectChanges();
			this.config.setCalendarType(ECalendarType[calendarKeys[currentIndex + jump]]);
			this.CalendarOpened = true;
			this.cd.detectChanges();
		} else if (currentIndex + jump >= calendarKeys.length) {
			this.CalendarOpened = false;
			this.cd.detectChanges();
			this.config.setCalendarType(ECalendarType[calendarKeys[0]]);
			this.CalendarOpened = true;
			this.cd.detectChanges();
		} else {
			this.CalendarOpened = false;
			this.cd.detectChanges();
			this.config.setCalendarType(ECalendarType[calendarKeys[calendarKeys.length - 1]]);
			this.CalendarOpened = true;
			this.cd.detectChanges();
		}
	}
}
