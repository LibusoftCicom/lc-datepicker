import {Subject} from 'rxjs';
import {DatePickerConfig} from './lc-date-picker-config-helper';
import {Panel} from './base-date-picker.class';
import {Injectable} from '@angular/core';
import {ECalendarType} from './enums';


@Injectable()
export class DatePicker {

    public readonly panelChanges: Subject<Panel> = new Subject();
    private datePickerConfig: DatePickerConfig;
    private activePanel: Panel;
    private calendarType: ECalendarType;

    constructor(datePickerConfig: DatePickerConfig) {
        this.datePickerConfig = datePickerConfig;
        this.calendarType = this.datePickerConfig.getCalendarType();
    }

    public getConfig(): DatePickerConfig {
        return this.datePickerConfig;
    }

    public setActivePanel(calendarType: ECalendarType): void {
        switch (calendarType) {
            case ECalendarType.DateTime: {
                this.setPanel(Panel.Day);
                break;
            }
            case ECalendarType.Date: {
                this.setPanel(Panel.Day);
                break;
            }
            case ECalendarType.MonthYear: {
                this.setPanel(Panel.Month);
                break;
            }
            case ECalendarType.Year: {
                this.setPanel(Panel.Year);
                break;
            }
            case ECalendarType.Time: {
                this.setPanel(Panel.Time);
                break;
            }
        }
    }

    public getActivePanel(): Panel {
        return this.activePanel;
    }

    public setPanel(panel: Panel): void {
        this.activePanel = panel;
        this.panelChanges.next(this.activePanel);
    }

    public getCalendarType(): ECalendarType {
        return this.calendarType;
    }

    public setCalendarType(calendarType: ECalendarType): void {
        this.calendarType = calendarType;
    }
}
