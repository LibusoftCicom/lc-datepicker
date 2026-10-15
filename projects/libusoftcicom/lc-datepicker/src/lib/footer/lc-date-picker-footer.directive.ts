import { Directive, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Type, ViewContainerRef } from '@angular/core';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { DATE_PICKER_FOOTER } from './footer-provider.class';
import { IDatePickerFooter } from './footer.component.interface';
import { DynamicComponentLifecycle } from '../dynamic-component-lifecycle';

@Directive({
  selector: '[lc-date-picker-footer]'
})
export class LcDatePickerFooterDirective implements OnChanges, OnInit, OnDestroy {
  @Input() public control!: LCDatePickerControl;
  @Output() public confirm = new EventEmitter<void>();
  @Output() public cancel = new EventEmitter<void>();
  @Output() public clear = new EventEmitter<void>();

  private lifecycle: DynamicComponentLifecycle<IDatePickerFooter>;

  constructor(
    private readonly container: ViewContainerRef,
    @Inject(DATE_PICKER_FOOTER) private readonly footer: Type<IDatePickerFooter>
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.control && this.lifecycle) {
      this.lifecycle.setInput('control', this.control);
    }
  }

  public ngOnInit(): void {
    const componentRef = this.container.createComponent(this.footer);
    this.lifecycle = new DynamicComponentLifecycle(componentRef);
    this.lifecycle.setInput('control', this.control);
    this.lifecycle.subscribe(componentRef.instance.confirm, () => this.confirm.emit());
    this.lifecycle.subscribe(componentRef.instance.cancel, () => this.cancel.emit());
    if (componentRef.instance.clear) {
      this.lifecycle.subscribe(componentRef.instance.clear, () => this.clear.emit());
    }
  }

  public ngOnDestroy(): void {
    this.lifecycle?.destroy();
  }
}