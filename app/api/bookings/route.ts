import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createCalendarEvent } from '@/lib/google-calendar';
import { parseCostaRicaDateTime } from '@/lib/costa-rica-time';

// Services data (same as in /api/services)
const SERVICES: Record<string, { name: string; price: number; deposit: number; duration: number }> = {
  'semi-natural': { name: 'Semi-permanente en uña natural', price: 5000, deposit: 2500, duration: 120 },
  'gel-sm': { name: 'Gel X', price: 8000, deposit: 4000, duration: 120 },
  'semi-feet': { name: 'Semi-permanente en pies', price: 4000, deposit: 2000, duration: 120 },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const serviceId = formData.get('serviceId') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const clientName = formData.get('clientName') as string;
    const clientPhone = formData.get('clientPhone') as string;
    const clientEmail = formData.get('clientEmail') as string;
    const paymentReference = formData.get('paymentReference') as string;
    const notes = formData.get('notes') as string;
    const inspirationImage = formData.get('inspirationImage') as File | null;
    const needsRemoval = formData.get('needsRemoval') === 'true';
    const selectedPromo = formData.get('selectedPromo') === 'true';
    const gelXSize = formData.get('gelXSize') as string | null;
    const gelXType = formData.get('gelXType') as string | null;

    // Validate required fields
    if (!serviceId || !date || !time || !clientName || !clientPhone || !paymentReference) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get service info
    let service = SERVICES[serviceId];
    if (!service && !selectedPromo) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    let serviceName = service?.name || 'Promo: Manos y Pies';
    let totalPrice = service?.price || 13000;
    let durationMinutes = service?.duration || 120;

    // Handle Gel X pricing
    if (serviceId === 'gel-sm' && gelXSize) {
      if (gelXSize === 'L') totalPrice += 3000;
      if (gelXSize === 'XL') totalPrice += 3500;
    }
    if (gelXType === 'piedrera') totalPrice += 2000;
    if (gelXType === '3d') totalPrice += 2500;

    // Add removal cost if selected
    if (needsRemoval) totalPrice += 2000;

    // Override for promo
    if (selectedPromo) {
      totalPrice = 13000;
      durationMinutes = 180; // 3 hours for hands + feet
      serviceName = 'Promo: Manos y Pies';
    }

    const totalDeposit = Math.ceil(totalPrice / 2);

    // Create start and end times
    const startAt = parseCostaRicaDateTime(date, time);

    const endAt = new Date(startAt);
    endAt.setMinutes(endAt.getMinutes() + durationMinutes);

    // Check for conflicts
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        startAt: {
          lt: endAt,
        },
        endAt: {
          gt: startAt,
        },
        status: { not: 'CANCELLED' },
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Time slot already booked' },
        { status: 409 }
      );
    }

    let imagePath: string | null = null;

    // Handle inspiration image upload
    if (inspirationImage) {
      const bytes = await inspirationImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${inspirationImage.name}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (err) {
        console.error('Error creating uploads directory:', err);
      }

      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    // Create appointment
    let googleEventId: string | null = null;

    try {
      // Create Google Calendar event automatically
      googleEventId = await createCalendarEvent({
        summary: `${clientName} - ${serviceName}`,
        description: `
Cliente: ${clientName}
Teléfono: ${clientPhone}
Correo: ${clientEmail || 'No proporcionado'}
Servicio: ${serviceName}
Precio: ₡${totalPrice.toLocaleString()}
Depósito: ₡${totalDeposit.toLocaleString()}
Referencia de pago: ${paymentReference}
${gelXSize ? `Gel X: ${gelXSize}${gelXType ? ` - ${gelXType}` : ''}` : ''}
${needsRemoval ? 'Con retiro de e.s.' : ''}
${notes ? `Notas: ${notes}` : ''}
        `.trim(),
        startTime: startAt,
        endTime: endAt,
        clientEmail: clientEmail || undefined,
      });
    } catch (calendarError) {
      console.warn('Could not create Google Calendar event, continuing with database booking:', calendarError);
    }

    const appointment = await prisma.appointment.create({
      data: {
        serviceId: selectedPromo ? 'promo' : serviceId,
        serviceName,
        servicePrice: totalPrice,
        depositAmount: totalDeposit,
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        paymentReference,
        notes: `${notes || ''}${gelXSize ? `\nGel X: ${gelXSize}${gelXType ? ` - ${gelXType}` : ''}` : ''}${needsRemoval ? '\nCon retiro' : ''}`.trim() || null,
        inspirationImagePath: imagePath,
        startAt,
        endAt,
        status: 'PENDING_VALIDATION',
        googleEventId,
      },
    });

    return NextResponse.json({
      success: true,
      bookingId: appointment.id,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}
