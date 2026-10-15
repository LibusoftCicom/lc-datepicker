import { Component, Input, OnDestroy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LCDatePickerControl } from '../lc-date-picker-control';
import { Panel } from '../base-date-picker.class';
import { withDatePickerHeader } from './header-provider.class';
import { IDatePickerHeader } from './lc-date-picker-header.interface';
import { LcDatePickerHeaderDirective } from './lc-date-picker-header.directive';

@Component({
  selector: 'test-header',
  template: '<tr><th>{{ type }}</th></tr>'
})
class TestHeaderComponent implements IDatePickerHeader, OnDestroy {
  @Input() public control: LCDatePickerControl;
  @Input() public type: Panel;
  public destroyed = false;
  public static latest: TestHeaderComponent;

  constructor() {
    TestHeaderComponent.latest = this;
  }

  public ngOnDestroy(): void {
    this.destroyed = true;
  }
}

@Component({
  selector: 'test-header-host',
  template: '<table><thead lc-date-picker-header [control]="control" [type]="type"></thead></table>',
  providers: [withDatePickerHeader(TestHeaderComponent)]
})
class TestHeaderHostComponent {
  @Input() public control = {} as LCDatePickerControl;
  @Input() public type = Panel.Day;
}

describe('LcDatePickerHeaderDirective', () => {
  let fixture: ComponentFixture<TestHeaderHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHeaderComponent, TestHeaderHostComponent, LcDatePickerHeaderDirective],
      providers: [withDatePickerHeader()]
    });
    fixture = TestBed.createComponent(TestHeaderHostComponent);
    fixture.detectChanges();
  });

  it('creates the header within the table head using the provided inputs', () => {
    const head = fixture.nativeElement.querySelector('thead') as HTMLTableSectionElement;
    expect(head.querySelector('tr th').textContent.trim()).toBe(String(Panel.Day));
    expect(TestHeaderComponent.latest.control).toBe(fixture.componentInstance.control);
    expect(TestHeaderComponent.latest.type).toBe(Panel.Day);
  });

  it('updates dynamic header inputs and destroys the component with its host', () => {
    const nextControl = {} as LCDatePickerControl;
    fixture.componentRef.setInput('control', nextControl);
    fixture.componentRef.setInput('type', Panel.Year);
    fixture.detectChanges();

    const header = TestHeaderComponent.latest;
    expect(header.control).toBe(nextControl);
    expect(header.type).toBe(Panel.Year);
    expect(fixture.nativeElement.querySelector('thead tr th').textContent.trim()).toBe(String(Panel.Year));

    fixture.destroy();
    expect(header.destroyed).toBe(true);
  });
});
