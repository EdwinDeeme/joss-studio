import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/calendar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId') || '';
    const date = searchParams.get('date') || '';
    const selectedPromo = searchParams.get('selectedPromo') === 'true';

    if ((!serviceId && !selectedPromo) || !date) {
      return NextResponse.json(
        { error: 'Missing serviceId or date' },
        { status: 400 }
      );
    }

    // Get available slots
    const slots = await getAvailableSlots(date, serviceId, selectedPromo);

    return NextResponse.json({ slots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
