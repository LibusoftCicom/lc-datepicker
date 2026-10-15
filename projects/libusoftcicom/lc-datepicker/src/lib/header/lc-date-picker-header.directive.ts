import {
  ApplicationRef,
  createComponent,
  Directive,
  ElementRef,
  EnvironmentInjector,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Type,
} from '@angular/core';
import { Panel } from '../base-date-picker.class';
import { DynamicComponentLifecycle } from '../dynamic-component-lifecycle';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { DATE_PICKER_HEADER } from './header-provider.class';
import { IDatePickerHeader } from './lc-date-picker-header.interface';

@Directive({
  selector: '[lc-date-picker-header]'
})
export class LcDatePickerHeaderDirective implements OnChanges, OnInit, OnDestroy {

  @Input() public control!: LCDatePickerControl;

  @Input() public type: Panel;

  private lifecycle: DynamicComponentLifecycle<IDatePickerHeader>;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly injector: Injector,
    private readonly environmentInjector: EnvironmentInjector,
    private readonly applicationRef: ApplicationRef,
    @Inject(DATE_PICKER_HEADER) private readonly HEADER: Type<IDatePickerHeader>,
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.lifecycle) {
      return;
    }

    if (changes.control) {
      this.lifecycle.setInput('control', this.control);
    }
    if (changes.type) {
      this.lifecycle.setInput('type', this.type);
    }

    this.lifecycle.detectChanges();
  }

  public ngOnInit(): void {
    this.prepareHeader();
  }

  public ngOnDestroy(): void {
    this.lifecycle?.destroy();
  }

  private prepareHeader(): void {
    const componentRef = createComponent(this.HEADER, {
      hostElement: this.elementRef.nativeElement,
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector
    });

    this.applicationRef.attachView(componentRef.hostView);
    this.lifecycle = new DynamicComponentLifecycle(
      componentRef,
      () => this.applicationRef.detachView(componentRef.hostView)
    );
    this.lifecycle.setInput('control', this.control);
    this.lifecycle.setInput('type', this.type);
    this.lifecycle.detectChanges();
  }
}