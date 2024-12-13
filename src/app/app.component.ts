import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import {
  DatePickerConfig,
  ECalendarType,
  EHourFormat,
  IDatePickerConfiguration,
  IDisabledTimeRange,
  LCDatePickerAdapter
} from '@libusoftcicom/lc-datepicker';

@Component({
	selector: 'lc-app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	public title = 'LC DatePicker';
	public year = new Date().getFullYear();
	public datePickerConfig: DatePickerConfig;
	public dateRangePickerConfig: DatePickerConfig;

	public inputDate: string;

	@ViewChild('dateInput', { static: true })
	public dateInput: ElementRef;

	@ViewChild('dateRangeInput', { static: true })
	public dateRangeInput: ElementRef;

	constructor(
		private readonly renderer: Renderer2,
		private readonly dateAdapter: LCDatePickerAdapter,
	) {

    const timezone = 'Europe/Zagreb';
    const minDate =
      this.dateAdapter.toISOString(
        this.dateAdapter.subtract(
          this.dateAdapter.subtract(this.dateAdapter.today(timezone), 40, 'day'),
          100,
          'year'
        )
      );

    const maxDate =
      this.dateAdapter.toISOString(
        this.dateAdapter.add(
          this.dateAdapter.add(this.dateAdapter.today(timezone), 40, 'day'),
          100,
          'year'
        )
      );

    this.inputDate = this.dateAdapter.toISOString(this.dateAdapter.now(timezone));

    const datePickerConfiguration: IDatePickerConfiguration = {
      value: this.inputDate,
      calendarType: ECalendarType.Date,
      localization: 'hr',
      hourFormat: EHourFormat.TWENTY_FOUR_HOUR,
      timezone,
      minimumDate: minDate,
      maximumDate: maxDate,
      disabledDates: this.generateRandomDisabledDates(timezone),
      disabledTimeRanges: this.getDisabledTimeRanges(),
      labels: { confirmLabel: 'OK', fromLabel: 'From', toLabel: 'To' },
      theme: { primaryColor: '#5e666f', fontColor: '#5e666f' }
    };

    this.datePickerConfig = new DatePickerConfig(datePickerConfiguration, this.dateAdapter);

    const today = this.dateAdapter.today(timezone);

    const dateRange =
      this.dateAdapter.toISOString(today) + '/' + this.dateAdapter.toISOString(this.dateAdapter.add(today, 1, 'day'));

    const dateRangePickerConfiguration = {
      ...Object.assign(datePickerConfiguration),
      value: dateRange,
      calendarType: ECalendarType.DateRange
    };

    this.dateRangePickerConfig = new DatePickerConfig(dateRangePickerConfiguration, this.dateAdapter);

		this.registerKeyNavigation();
	}

  public openCalendar(): void {

    this.datePickerConfig.setValue(this.dateInput.nativeElement.value);
    this.datePickerConfig.setOpen(true);
    this.datePickerConfig.focus();
  }

  public toggleCalendarOpen(): void {

    if (!this.datePickerConfig.isOpen()) {
        this.datePickerConfig.setValue(this.dateInput.nativeElement.value);
    }

    this.datePickerConfig.setOpen(!this.datePickerConfig.isOpen());
  }

  public openCalendarRange(): void {

    this.dateRangePickerConfig.setValue(this.dateRangeInput.nativeElement.value);
    this.dateRangePickerConfig.setOpen(true);
    this.dateRangePickerConfig.focus();
  }

	public clearCalendar(): void {
		this.dateInput.nativeElement.value = '';
	}

	public get CalendarType() {
		return this.datePickerConfig.getCalendarType();
	}

	public set CalendarType(value: ECalendarType) {
    this.datePickerConfig.setCalendarType(1 * value);
	}
	public get Localization() {
		return this.datePickerConfig.getLocalization();
	}

	public set Localization(value: string) {
    this.datePickerConfig.setLocalization(value);
    this.dateRangePickerConfig.setLocalization(value);
	}

	public get ConfirmLabel() {
		return this.datePickerConfig.getLabels().confirmLabel;
	}

	public set ConfirmLabel(value: string) {
    const labels = this.datePickerConfig.getLabels();
    labels.confirmLabel = value;
    this.datePickerConfig.setLabels(labels);
    this.dateRangePickerConfig.setLabels(labels);
	}

	public get FromLabel() {
		return this.datePickerConfig.getLabels().fromLabel;
	}

	public set FromLabel(value: string) {
    const labels = this.datePickerConfig.getLabels();
    labels.fromLabel = value;
    this.datePickerConfig.setLabels(labels);
    this.dateRangePickerConfig.setLabels(labels);
	}
	public get ToLabel() {
		return this.datePickerConfig.getLabels().toLabel;
	}

	public set ToLabel(value: string) {
    const labels = this.datePickerConfig.getLabels();
    labels.toLabel = value;
    this.datePickerConfig.setLabels(labels);
    this.dateRangePickerConfig.setLabels(labels);
	}

	public get PrimaryColor() {
		return this.datePickerConfig.getTheme().primaryColor;
	}

	public set PrimaryColor(value: string) {
    const theme = this.datePickerConfig.getTheme();
    theme.primaryColor = value;
    this.datePickerConfig.setTheme(theme);
    this.dateRangePickerConfig.setTheme(theme);
	}

	public get FontColor() {
		return this.datePickerConfig.getTheme().fontColor;
	}

	public set FontColor(value: string) {
    const theme = this.datePickerConfig.getTheme();
    theme.fontColor = value;
    this.datePickerConfig.setTheme(theme);
    this.dateRangePickerConfig.setTheme(theme);
	}

	public setCalendarDate(dateTime: string): void {
		this.dateInput.nativeElement.value = dateTime;
	}

	public setCalendarDateRange(dateRange: string): void {
		this.dateRangeInput.nativeElement.value = dateRange;
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

  public setDatePickerOpen(open: boolean): void {
    if (!open) {
      this.dateInput.nativeElement.click();
      this.dateInput.nativeElement.select();
    }
  }

  public setDateRangePickerOpen(open: boolean): void {
    if (!open) {
      this.dateRangeInput.nativeElement.click();
      this.dateRangeInput.nativeElement.select();
    }
  }

	private generateRandomDisabledDates(timezone: string): string[] {
		return Array(7)
			.fill(null)
			.map(() => {
				const rand = Math.floor(Math.random() * (15 - -15) + -15);
				return this.dateAdapter.toISOString(this.dateAdapter.add(this.dateAdapter.today(timezone), rand, 'days'));
			});
	}

	private getDisabledTimeRanges(): IDisabledTimeRange[] {

    const disabledTimeRanges: IDisabledTimeRange[] = [];

    disabledTimeRanges.push({
      startTime: { hour: 0, minute: 0 },
      stopTime: { hour: 7, minute: 59 },
    },{
      startTime: { hour: 14, minute: 0 },
      stopTime: { hour: 16, minute: 59 },
    },{
      startTime: { hour: 21, minute: 0 },
      stopTime: { hour: 23, minute: 59 },
    });

    return disabledTimeRanges;
	}

	/**
	 * demo implementation
	 * keyboard navigation
	 */
	private registerKeyNavigation(): void {
		this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
			if (!this.datePickerConfig.isFocused()) {
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
				this.datePickerConfig.navigateUp();
			}
			if (event.key === "ArrowDown") {
				this.datePickerConfig.navigateDown();
			}

			if (event.key === "ArrowRight" && !event.shiftKey) {
				this.datePickerConfig.navigateRight();
			}

			if (event.key === "ArrowLeft" && !event.shiftKey) {
				this.datePickerConfig.navigateLeft();
			}

			if (event.key === "Enter") {
				this.datePickerConfig.confirm();
			}

			if (event.key === "Escape") {
				this.datePickerConfig.close();
			}

			if (event.key === "PageDown") {
				this.datePickerConfig.nextPage();
			}
			if (event.key === "PageUp") {
				this.datePickerConfig.previousPage();
			}
		});
	}

	/**
	 * just for demo
	 */
	private changePanelType(jump: number) {
		const calendarKeys = Object.keys(ECalendarType).filter((val) => isNaN(parseInt(val)));
		const currentIndex =
      calendarKeys.findIndex((type) =>
        this.datePickerConfig.getCalendarType() === ECalendarType[type]);

		if (currentIndex + jump < calendarKeys.length && currentIndex + jump >= 0) {
      this.datePickerConfig.setCalendarType(ECalendarType[calendarKeys[currentIndex + jump]]);
		} else if (currentIndex + jump >= calendarKeys.length) {
      this.datePickerConfig.setCalendarType(ECalendarType[calendarKeys[0]]);
		} else {
      this.datePickerConfig.setCalendarType(ECalendarType[calendarKeys[calendarKeys.length - 1]]);
		}
	}
}
