import { DatePickerPopoverBehavior } from './popover-behavior';

describe('DatePickerPopoverBehavior', () => {
  let host: HTMLElement;
  let behavior: DatePickerPopoverBehavior;

  beforeEach(() => {
    host = document.createElement('div');
    host.tabIndex = 0;
    document.body.appendChild(host);
    behavior = new DatePickerPopoverBehavior(host);
  });

  afterEach(() => {
    host.remove();
  });

  it('focuses the picker host', () => {
    behavior.focus();
    expect(document.activeElement).toBe(host);
  });

  it('positions using the measured popover height, including custom footer height', () => {
    const remainingSpace = spyOnProperty(window, 'innerHeight').and.returnValue(305);
    spyOn(host.parentElement, 'getBoundingClientRect').and.returnValue({ top: 0 } as DOMRect);
    const measuredHeight = spyOn(host, 'getBoundingClientRect').and.returnValue({ height: 320 } as DOMRect);
    expect(behavior.getMarginTop()).toBe('-320px');

    measuredHeight.and.returnValue({ height: 300 } as DOMRect);
    expect(behavior.getMarginTop()).toBe(0);

    measuredHeight.and.returnValue({ height: 340 } as DOMRect);
    remainingSpace.and.returnValue(330);
    expect(behavior.getMarginTop()).toBe('-340px');
  });
});
