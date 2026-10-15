import Holidays from 'date-holidays';
import { IDatePickerEvent } from '@libusoftcicom/lc-datepicker';

export type HolidayLanguage = 'en' | 'hr';

const SOURCE = 'Zakon o blagdanima, spomendanima i neradnim danima u RH, NN 110/2019, čl. 1 i 4';
const SOURCE_URL = 'https://narodne-novine.nn.hr/clanci/sluzbeni/2019_11_110_2212.html';

export function getCroatianPublicHolidayEvents(
  firstYear: number,
  lastYear: number,
  language: HolidayLanguage
): IDatePickerEvent[] {
  if (!Number.isInteger(firstYear) || !Number.isInteger(lastYear) || firstYear > lastYear) {
    throw new RangeError('Holiday year range must contain ordered integer years.');
  }

  const holidays = new Holidays('HR', {
    languages: [language, 'hr', 'en'],
    timezone: 'Europe/Zagreb',
    types: ['public']
  });
  const events: IDatePickerEvent[] = [];
  const seen = new Set<string>();

  for (let year = firstYear; year <= lastYear; year++) {
    holidays.getHolidays(year, language)
      .filter(holiday => holiday.type === 'public')
      .forEach(holiday => {
        const date = holiday.date.slice(0, 10);
        const key = `${date}|${holiday.rule}|${holiday.name}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        events.push({
          date,
          label: holiday.name,
          description: language === 'hr'
            ? 'Blagdan i neradni dan u Republici Hrvatskoj.'
            : 'Public holiday in the Republic of Croatia.',
          metadata: {
            country: 'HR',
            type: 'public',
            source: SOURCE,
            sourceUrl: SOURCE_URL,
            rule: holiday.rule,
            substitute: !!holiday.substitute
          }
        });
      });
  }

  return events;
}
