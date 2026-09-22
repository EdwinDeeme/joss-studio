import { prisma } from './prisma';
import { getCalendarEvents } from './google-calendar';

const BUSINESS_HOURS = {
  start: 9,
  end: 16,
};

const SLOT_DURATION = 30;
const BREAK_START_HOUR = 12;
const BREAK_END_HOUR = 13;
const COSTA_RICA_UTC_OFFSET_HOURS = 6;

function getCostaRicaDateTime(year: number, month: number, day: number, hour: number, minute = 0, second = 0): Date {
  return new Date(Date.UTC(year, month - 1, day, hour + COSTA_RICA_UTC_OFFSET_HOURS, minute, second));
}

export function getServiceDurationMinutes(serviceId?: string, selectedPromo = false): number {
  if (selectedPromo) return 180;

  switch (serviceId) {
    case 'semi-natural':
    case 'gel-sm':
    case 'semi-feet':
      return 120;
    default:
      return 120;
  }
}

export async function getAvailableSlots(
  date: string,
  serviceId?: string,
  selectedPromo = false
): Promise<Array<{ label: string; value: string }>> {
  const slots: Array<{ label: string; value: string }> = [];

  try {
    const [year, month, day] = date.split('-').map(Number);
    const now = new Date();
    const durationMinutes = getServiceDurationMinutes(serviceId, selectedPromo);

    const dayStart = getCostaRicaDateTime(year, month, day, BUSINESS_HOURS.start, 0, 0);
    const dayEnd = getCostaRicaDateTime(year, month, day, BUSINESS_HOURS.end, 59, 59);

    let googleEvents: any[] = [];
    try {
      googleEvents = await getCalendarEvents(dayStart, dayEnd);
    } catch (googleError) {
      console.warn('Could not fetch Google Calendar events, continuing with database slots only:', googleError);
      googleEvents = [];
    }

    for (let hour = BUSINESS_HOURS.start; hour <= BUSINESS_HOURS.end; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
        if (hour === BUSINESS_HOURS.end && minute > 0) continue;

        const slotTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const startDateTime = getCostaRicaDateTime(year, month, day, hour, minute, 0);
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);

        if (startDateTime < now) continue;
        if (startDateTime.getHours() < BUSINESS_HOURS.start || startDateTime.getHours() > BUSINESS_HOURS.end) continue;
        if (startDateTime.getHours() === BUSINESS_HOURS.end && startDateTime.getMinutes() > 0) continue;

        const breakStart = getCostaRicaDateTime(year, month, day, BREAK_START_HOUR, 0, 0);
        const breakEnd = getCostaRicaDateTime(year, month, day, BREAK_END_HOUR, 0, 0);
        if (startDateTime < breakEnd && endDateTime > breakStart) {
          continue;
        }

        let conflict = null;
        try {
          conflict = await prisma.appointment.findFirst({
            where: {
              startAt: {
                lt: endDateTime,
              },
              endAt: {
                gt: startDateTime,
              },
              status: { not: 'CANCELLED' },
            },
          });
        } catch (dbError) {
          conflict = null;
        }

        let googleConflict = false;
        if (googleEvents.length > 0) {
          googleConflict = googleEvents.some((event) => {
            if (!event.start?.dateTime || !event.end?.dateTime) return false;
            const eventStart = new Date(event.start.dateTime);
            const eventEnd = new Date(event.end.dateTime);
            return startDateTime < eventEnd && endDateTime > eventStart;
          });
        }

        if (!conflict && !googleConflict) {
          slots.push({ label: slotTime, value: slotTime });
        }
      }
    }
  } catch (error) {
    console.error('Error generating slots:', error);
  }

  return slots.length > 0
    ? slots
    : [{ label: 'No disponible', value: '' }];
}
