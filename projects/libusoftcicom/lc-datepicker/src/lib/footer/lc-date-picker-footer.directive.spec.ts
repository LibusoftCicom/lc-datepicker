import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { DATE_PICKER_FOOTER, withDatePickerFooter } from './footer-provider.class';
import { IDatePickerFooter } from './footer.component.interface';
import { LCDatePickerFooterComponent } from './footer.component';
import { LcDatePickerFooterDirective } from './lc-date-picker-footer.directive';

@Component({ selector: 'test-footer', standalone: true, template: '' })
class TestFooterComponent implements IDatePickerFooter, OnChanges {
  @Input() public control: LCDatePickerControl;
  @Output() public confirm = new EventEmitter<void>();
  @Output() public cancel = new EventEmitter<void>();
  @Output() public clear = new EventEmitter<void>();
  public controlChanges = 0;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.control) {
      this.controlChanges++;
    }
  }
}

@Component({
  selector: 'test-footer-host',
  template: `<ng-container lc-date-picker-footer [control]="control"
    (confirm)="confirmed()" (cancel)="cancelled()" (clear)="cleared()"></ng-container>`,
  providers: [withDatePickerFooter(TestFooterComponent)]
})
class TestFooterHostComponent {
  @Input() public control = {} as LCDatePickerControl;
  public confirmed = jasmine.createSpy('confirm');
  public cancelled = jasmine.createSpy('cancel');
  public cleared = jasmine.createSpy('clear');
}

describe('LcDatePickerFooterDirective', () => {
  let fixture: ComponentFixture<TestFooterHostComponent>;
  let footer: TestFooterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestFooterComponent],
      declarations: [TestFooterHostComponent, LcDatePickerFooterDirective],
      providers: [withDatePickerFooter()]
    });
    fixture = TestBed.createComponent(TestFooterHostComponent);
    fixture.detectChanges();
    footer = fixture.debugElement.query(By.directive(TestFooterComponent)).componentInstance;
  });

  it('uses the local provider without replacing the default provider', () => {
    expect(footer.control).toBe(fixture.componentInstance.control);
    expect(TestBed.inject(DATE_PICKER_FOOTER)).toBe(LCDatePickerFooterComponent);
  });

  it('forwards all footer actions', () => {
    footer.confirm.emit();
    footer.cancel.emit();
    footer.clear.emit();
    expect(fixture.componentInstance.confirmed).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.cancelled).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.cleared).toHaveBeenCalledTimes(1);
  });

  it('updates the dynamic footer input with host input changes', () => {
    const changedControl = {} as LCDatePickerControl;
    fixture.componentRef.setInput('control', changedControl);
    fixture.detectChanges();
    expect(footer.control).toBe(changedControl);
    expect(footer.controlChanges).toBe(2);
  });

  it('unsubscribes when the host is destroyed', () => {
    const host = fixture.componentInstance;
    fixture.destroy();
    footer.confirm.emit();
    footer.cancel.emit();
    footer.clear.emit();
    expect(host.confirmed).not.toHaveBeenCalled();
    expect(host.cancelled).not.toHaveBeenCalled();
    expect(host.cleared).not.toHaveBeenCalled();
  });
});