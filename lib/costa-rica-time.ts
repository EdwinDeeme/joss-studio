const COSTA_RICA_UTC_OFFSET_HOURS = 6;

export const COSTA_RICA_TIME_ZONE = 'America/Costa_Rica';

export function getCostaRicaDateTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
  second = 0
): Date {
  return new Date(
    Date.UTC(year, month - 1, day, hour + COSTA_RICA_UTC_OFFSET_HOURS, minute, second)
  );
}

export function parseCostaRicaDateTime(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  return getCostaRicaDateTime(year, month, day, hour, minute, 0);
}

export function formatCostaRicaDateTimeForCalendar(date: Date): string {
  const costaRicaClockTime = new Date(
    date.getTime() - COSTA_RICA_UTC_OFFSET_HOURS * 60 * 60 * 1000
  );

  const year = costaRicaClockTime.getUTCFullYear();
  const month = String(costaRicaClockTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(costaRicaClockTime.getUTCDate()).padStart(2, '0');
  const hour = String(costaRicaClockTime.getUTCHours()).padStart(2, '0');
  const minute = String(costaRicaClockTime.getUTCMinutes()).padStart(2, '0');
  const second = String(costaRicaClockTime.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}