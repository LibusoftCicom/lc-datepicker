import { LCDatePickerPage } from './app.po';

describe('lc-date-picker App', () => {
  let page: LCDatePickerPage;

  beforeEach(() => {
    page = new LCDatePickerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
