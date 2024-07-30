import {
    ChangeDetectionStrategy,
    Component, ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy, OnInit,
    Output, Renderer2, ViewChild,
} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {DatePickerConfig} from '../lc-date-picker-config-helper';

@Component({
    selector: 'lc-header',
    templateUrl: 'header.component.html',
    styleUrls: ['./header.component.style.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LCHeaderComponent implements OnInit {

    @Input() public headerLabel: string;
    @Input() public backgroundColor: string;

    @ViewChild('label', { static: true })
    public labelElement: ElementRef<HTMLDivElement>;

    constructor(
        private readonly renderer: Renderer2,
    ) {}

    public ngOnInit(): void {
        this.setStyles();
    }

    private setStyles(): void {
      this.renderer.setStyle(this.labelElement.nativeElement, 'background', this.backgroundColor);
    }
}
