import { AfterViewInit, Component, ElementRef, Input, NgZone, Optional, Renderer2, ViewChild } from "@angular/core";
import { DateTimePart, LCDatePickerAdapter } from "../lc-date-picker-adapter.class";
import { IDatePickerHeader } from "./lc-date-picker-header.interface";
import { LCDatePickerControl } from "../lc-date-picker-control";
import { fromEvent, Subscription } from "rxjs";
import { Panel } from "../base-date-picker.class";
import { DayPicker } from "../day-picker/day-picker.class";
import { YearPicker } from "../year-picker/year-picker.class";
import { EHourFormat } from "../enums";



@Component({
    selector: '[lc-date-picker-basic-header]',
    templateUrl: './lc-date-picker-basic-header.component.html',
    styleUrls: ['./lc-date-picker-basic-header.component.scss']
})
export class LcDatePickerBasicHeaderComponent implements IDatePickerHeader, AfterViewInit {

    protected Panel = Panel;

    @Input() public control!: LCDatePickerControl;

    @Input() public type!: Panel;

    @ViewChild('reset', { static: true })
    public resetElement!: ElementRef<HTMLButtonElement>;

    @ViewChild('yearPanel', { static: false })
    public yearPanelElement!: ElementRef<HTMLButtonElement>;

    @ViewChild('previousButton', { static: false })
    public previousButtonElement!: ElementRef<HTMLButtonElement>;

    @ViewChild('monthPanel', { static: true })
    public monthPanelElement!: ElementRef<HTMLButtonElement>;

    @ViewChild('nextButton', { static: false })
    public nextButtonElement!: ElementRef<HTMLButtonElement>;

    private readonly subscriptions: Subscription[] = [];

    constructor(
        private readonly dateAdapter: LCDatePickerAdapter,
        @Optional() private readonly datePicker: DayPicker,
        @Optional() private readonly yearPicker: YearPicker,
        private readonly renderer: Renderer2,
        private readonly host: ElementRef,
        private readonly ngZone: NgZone) {
    }

    public ngAfterViewInit(): void {
        // const activePanel = this.control.getPanel();
        // console.log(activePanel);
        this.setStyles();
        this.ngZone.runOutsideAngular(() => this.registerViewEvents());
    }

    protected formattedMonth(): string {
        return this.datePicker.getFormattedMonth();
    } 

    protected formattedYear(): string {
        return this.dateAdapter.formatDateTimePart(
            this.control.getValue(),
            DateTimePart.YEAR,
            this.control.getLocalization()
        );
    }

    protected colspanSize(): string {
        if (this.type === Panel.Day) {
            return '7';
        }
        if (this.type === Panel.Year) {
            return '5';
        }
        if (this.type === Panel.Time && this.control.getHourFormat() === EHourFormat.TWENTY_FOUR_HOUR) {
            return '3';
        }
        return '4';
    }

    private registerViewEvents() {
        this.subscriptions.push(
            fromEvent<PointerEvent>(this.resetElement.nativeElement, 'click')
                .subscribe(() => this.resetDate())
        );

        this.subscriptions.push(
            fromEvent<PointerEvent>(this.monthPanelElement.nativeElement, 'click')
            .subscribe(() => this.switchPanels(Panel.Month))
        );

        if (this.yearPanelElement) {
            this.subscriptions.push(
                fromEvent<PointerEvent>(this.yearPanelElement.nativeElement, 'click')
                    .subscribe(() => this.switchPanels(Panel.Year))
            );
        }

        if (this.previousButtonElement) {
            this.subscriptions.push(
                fromEvent<PointerEvent>(this.previousButtonElement.nativeElement, 'click')
                    .subscribe(() => {
                        if (this.type === Panel.Day) {
                            this.datePicker.previousMonth();
                        } else if (this.type === Panel.Year) {
                            this.yearPicker.previousYears();
                        }
                        this.control.focus();
                    })
            );
        }

        if (this.nextButtonElement) {
            this.subscriptions.push(
            fromEvent<PointerEvent>(this.nextButtonElement.nativeElement, 'click')
                .subscribe(() =>{
                    if (this.type === Panel.Day) {
                        this.datePicker.nextMonth();
                    } else if (this.type === Panel.Year) {
                        this.yearPicker.nextYears();
                    }
                    this.control.focus();
                })
            );
        }
    }

    private resetDate(): void {
        this.control.reset();
    }

    private switchPanels(panel: Panel): void {
        this.control.setPanel(panel);
        this.control.focus();
    }

    private setStyles(): void {
        this.renderer.setStyle(this.host.nativeElement, 'background', `var(--lc-datepicker-header-background, ${this.control.getTheme().primaryColor})`);
    }
}