export class DatePickerPopoverBehavior {

  constructor(private readonly host: HTMLElement) {}

  public focus(): void {
    this.host.focus();
  }

  public getMarginTop(): number | string {
    const anchor = this.host.parentElement;
    if (!anchor) {
      throw new Error('DatePicker popover host must have a parent element.');
    }

    const remainingHeight = window.innerHeight - anchor.getBoundingClientRect().top;
    const popoverHeight = this.host.getBoundingClientRect().height;
    if (!Number.isFinite(popoverHeight) || popoverHeight <= 0) {
      throw new Error('DatePicker popover must have a measurable height when opened.');
    }

    return remainingHeight > popoverHeight ? 0 : `${popoverHeight * -1}px`;
  }
}
