import { AppComponent } from './app.component';
import { LuxonDateAdapterService } from './luxon-date-adapter.service';

describe('AppComponent optional keyboard navigation', () => {
  let component: AppComponent;

  beforeEach(() => {
    component = new AppComponent(new LuxonDateAdapterService());
    spyOn(component.datePickerConfig, 'isOpen').and.returnValue(true);
    spyOn(component.datePickerConfig, 'isFocused').and.returnValue(true);
  });

  function keyEvent(key: string, options: KeyboardEventInit = {}): KeyboardEvent {
    return new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options });
  }

  it('leaves keyboard navigation disabled by default', () => {
    const navigate = spyOn(component.datePickerConfig, 'navigateRight');
    const event = keyEvent('ArrowRight');
    component.onDatePickerKeydown(event);
    expect(navigate).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('keeps the default range demo free of date and time restrictions', () => {
    const rangeControl = component.dateRangePickerConfig.getControl();
    expect(component.dateRangePickerConfig.getDisabledDates()).toEqual([]);
    expect(rangeControl.getMinDate()).toEqual(rangeControl.getDefaultMinDate());
    expect(rangeControl.getMaxDate()).toEqual(rangeControl.getDefaultMaxDate());
    expect(rangeControl.getDisabledTimeRanges()).toEqual([]);
  });

  it('keeps the standard event-preview toggle state in sync with its configuration', () => {
    expect(component.dateEventPreviewOpen).toBe(component.dateEventPreviewConfig.isOpen());

    component.toggleDateEventPreview();
    expect(component.dateEventPreviewOpen).toBe(component.dateEventPreviewConfig.isOpen());

    component.toggleDateEventPreview();
    expect(component.dateEventPreviewOpen).toBe(component.dateEventPreviewConfig.isOpen());
  });

  const bindings = [
    ['ArrowUp', 'navigateUp'],
    ['ArrowDown', 'navigateDown'],
    ['ArrowLeft', 'navigateLeft'],
    ['ArrowRight', 'navigateRight'],
    ['PageUp', 'previousPage'],
    ['PageDown', 'nextPage'],
    ['Enter', 'confirm'],
    ['Escape', 'close']
  ] as const;

  bindings.forEach(([key, method]) => {
    it(`maps ${key} to ${method} only when enabled`, () => {
      component.keyboardNavigationEnabled = true;
      const action = spyOn(component.datePickerConfig, method);
      const otherPicker = spyOn(component.dateRangePickerConfig, method);
      const event = keyEvent(key);
      const propagation = spyOn(event, 'stopPropagation');
      component.onDatePickerKeydown(event);
      expect(action).toHaveBeenCalledTimes(1);
      expect(otherPicker).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(true);
      expect(propagation).toHaveBeenCalledTimes(1);
    });
  });

  it('does not handle keys when a child button, input or another picker has focus', () => {
    component.keyboardNavigationEnabled = true;
    (component.datePickerConfig.isFocused as jasmine.Spy).and.returnValue(false);
    const confirm = spyOn(component.datePickerConfig, 'confirm');
    const event = keyEvent('Enter');
    component.onDatePickerKeydown(event);
    expect(confirm).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('does not handle keys while the picker is closed', () => {
    component.keyboardNavigationEnabled = true;
    (component.datePickerConfig.isOpen as jasmine.Spy).and.returnValue(false);
    const navigate = spyOn(component.datePickerConfig, 'navigateRight');
    const event = keyEvent('ArrowRight');
    component.onDatePickerKeydown(event);
    expect(navigate).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('leaves Tab, text and application shortcuts untouched', () => {
    component.keyboardNavigationEnabled = true;
    const navigate = spyOn(component.datePickerConfig, 'navigateRight');
    const events = [
      keyEvent('Tab'), keyEvent('a'), keyEvent('ArrowRight', { ctrlKey: true }),
      keyEvent('ArrowRight', { altKey: true }), keyEvent('ArrowRight', { metaKey: true })
    ];
    events.forEach(event => {
      component.onDatePickerKeydown(event);
      expect(event.defaultPrevented).toBe(false);
    });
    expect(navigate).not.toHaveBeenCalled();
  });

  it('ignores events already handled by the implementation', () => {
    component.keyboardNavigationEnabled = true;
    const confirm = spyOn(component.datePickerConfig, 'confirm');
    const event = keyEvent('Enter');
    event.preventDefault();
    component.onDatePickerKeydown(event);
    expect(confirm).not.toHaveBeenCalled();
  });
});