import { google } from 'googleapis';
import {
  COSTA_RICA_TIME_ZONE,
  formatCostaRicaDateTimeForCalendar,
} from './costa-rica-time';

// Crear autenticación con Service Account
const getAuth = () => {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!serviceAccountEmail || !privateKey) {
    throw new Error('Google Service Account credentials not configured in .env');
  }

  return new google.auth.JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
};

export async function createCalendarEvent(event: {
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  clientEmail?: string;
}): Promise<string | null> {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID not configured in .env');
  }

  try {
    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: formatCostaRicaDateTimeForCalendar(event.startTime),
          timeZone: COSTA_RICA_TIME_ZONE,
        },
        end: {
          dateTime: formatCostaRicaDateTimeForCalendar(event.endTime),
          timeZone: COSTA_RICA_TIME_ZONE,
        },
        reminders: {
          useDefault: true,
        },
      },
    });

    console.log('Google Calendar event created:', response.data.id);
    return response.data.id || null;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
}

export async function getCalendarEvents(
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID not configured in .env');
  }

  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    return [];
  }
}

export async function updateCalendarEvent(
  eventId: string,
  event: {
    summary: string;
    description: string;
    startTime: Date;
    endTime: Date;
  }
): Promise<boolean> {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID not configured in .env');
  }

  try {
    await calendar.events.update({
      calendarId,
      eventId,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: formatCostaRicaDateTimeForCalendar(event.startTime),
          timeZone: COSTA_RICA_TIME_ZONE,
        },
        end: {
          dateTime: formatCostaRicaDateTimeForCalendar(event.endTime),
          timeZone: COSTA_RICA_TIME_ZONE,
        },
        reminders: {
          useDefault: true,
        },
      },
    });

    console.log('Google Calendar event updated:', eventId);
    return true;
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    return false;
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
  const auth = getAuth();
  const calendar = google.calendar({ version: 'v3', auth });

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!calendarId) {
    throw new Error('GOOGLE_CALENDAR_ID not configured in .env');
  }

  try {
    await calendar.events.delete({
      calendarId,
      eventId,
    });

    console.log('Google Calendar event deleted:', eventId);
    return true;
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    return false;
  }
}
