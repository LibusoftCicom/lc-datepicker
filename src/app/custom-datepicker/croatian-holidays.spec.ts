import { getCroatianPublicHolidayEvents } from './croatian-holidays';

describe('Croatian public holiday data', () => {
  it('returns the complete 2026 national public-holiday set with Croatian names', () => {
    const holidays = getCroatianPublicHolidayEvents(2026, 2026, 'hr');
    expect(holidays.length).toBe(14);
    expect(holidays.map(event => event.date)).toEqual([
      '2026-01-01',
      '2026-01-06',
      '2026-04-05',
      '2026-04-06',
      '2026-05-01',
      '2026-05-30',
      '2026-06-04',
      '2026-06-22',
      '2026-08-05',
      '2026-08-15',
      '2026-11-01',
      '2026-11-18',
      '2026-12-25',
      '2026-12-26'
    ]);
    expect(holidays.find(event => event.date === '2026-05-30').label).toBe('Dan državnosti');
    expect(holidays.find(event => event.date === '2026-04-05').label).toBe('Uskrs');
    expect(holidays.every(event =>
      event.metadata.country === 'HR' &&
      event.metadata.type === 'public' &&
      event.metadata.sourceUrl === 'https://narodne-novine.nn.hr/clanci/sluzbeni/2019_11_110_2212.html'
    )).toBe(true);
  });

  it('localizes labels and does not add substitute days when a holiday falls on Sunday', () => {
    const croatian = getCroatianPublicHolidayEvents(2026, 2026, 'hr');
    const english = getCroatianPublicHolidayEvents(2026, 2026, 'en');
    expect(english.find(event => event.date === '2026-05-30').label).toBe('National Day');
    expect(english.find(event => event.date === '2026-04-05').description)
      .toBe('Public holiday in the Republic of Croatia.');
    expect(croatian.some(event => event.date === '2026-11-02')).toBe(false);
    expect(new Set(croatian.map(event => `${event.date}|${event.label}`)).size).toBe(croatian.length);
  });

  it('returns events for adjacent years and rejects invalid year ranges', () => {
    const holidays = getCroatianPublicHolidayEvents(2025, 2026, 'en');
    expect(holidays.some(event => event.date === '2025-01-01')).toBe(true);
    expect(holidays.some(event => event.date === '2025-04-20' && event.label === 'Easter Sunday')).toBe(true);
    expect(holidays.some(event => event.date === '2025-04-21' && event.label === 'Easter Monday')).toBe(true);
    expect(holidays.some(event => event.date === '2026-01-01')).toBe(true);
    expect(() => getCroatianPublicHolidayEvents(2027, 2026, 'hr')).toThrowError(RangeError);
    expect(() => getCroatianPublicHolidayEvents(2026.5, 2027, 'hr')).toThrowError(RangeError);
  });
});
