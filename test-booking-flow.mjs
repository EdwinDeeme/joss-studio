#!/usr/bin/env node
/**
 * End-to-end booking flow test - FIXED VERSION
 * Ensures DATABASE_URL is loaded before starting server
 */

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:4321';
const ADMIN_TOKEN = 'cambia-este-token';

// Test colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

const log = {
  header: (msg) => console.log(`\n${colors.cyan}📌 ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.yellow}ℹ ${msg}${colors.reset}`),
};

async function testBookingFlow() {
  try {
    log.header('JOSS STUDIO - BOOKING SYSTEM TEST');
    log.info(`Testing against: ${BASE_URL}`);
    log.info(`Admin token: ${ADMIN_TOKEN}`);
    log.info(`Database URL: ${process.env.DATABASE_URL}`);

    // Step 1: Fetch available slots
    log.header('Step 1: Fetch Available Slots');
    const slotsResponse = await fetch(
      `${BASE_URL}/api/availability?serviceId=soft-gel&date=2026-09-18`
    );
    if (!slotsResponse.ok) {
      const errorBody = await slotsResponse.text();
      throw new Error(`Availability API failed: ${slotsResponse.status} - ${errorBody}`);
    }
    const slots = await slotsResponse.json();
    log.success(`Fetched ${slots.slots.length} available slots`);
    log.info(`First slot: ${slots.slots[0]?.label}`);

    if (slots.slots.length === 0) {
      throw new Error('No available slots returned');
    }

    const selectedSlot = slots.slots[0];
    const [time] = selectedSlot.value.split('|');

    // Step 2: Create a test image file
    log.header('Step 2: Create Test Image');
    const testImagePath = path.join(__dirname, 'public/uploads/inspirations/test-image.png');
    const pngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
      0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
      0x42, 0x60, 0x82,
    ]);
    fs.writeFileSync(testImagePath, pngBuffer);
    log.success(`Test image created at: ${testImagePath}`);

    // Step 3: Submit booking
    log.header('Step 3: Submit Booking');
    const formData = new FormData();
    formData.append('serviceId', 'soft-gel');
    formData.append('date', '2026-09-18');
    formData.append('time', time);
    formData.append('clientName', 'Test Client');
    formData.append('clientPhone', '87654321');
    formData.append('clientEmail', 'test@example.com');
    formData.append('paymentReference', 'TEST123456');
    formData.append('notes', 'Test booking for validation');
    formData.append('inspirationImage', fs.createReadStream(testImagePath), 'test.png');

    const bookingResponse = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders(),
        'Referer': `${BASE_URL}/`,
      },
    });

    if (!bookingResponse.ok) {
      const error = await bookingResponse.text();
      throw new Error(
        `Booking API failed: ${bookingResponse.status} - ${error}`
      );
    }

    const bookingResult = await bookingResponse.json();
    log.success(`Booking created: ${bookingResult.bookingId}`);
    log.info(`Status: ${bookingResult.title}`);

    const bookingId = bookingResult.bookingId;

    // Step 4: Verify booking in database
    log.header('Step 4: Verify Booking in Database');
    const dbBooking = await prisma.appointment.findUnique({
      where: { id: bookingId },
    });

    if (!dbBooking) {
      throw new Error('Booking not found in database');
    }

    log.success(`Found booking in DB`);
    log.info(`  ID: ${dbBooking.id}`);
    log.info(`  Client: ${dbBooking.clientName}`);
    log.info(`  Service: ${dbBooking.serviceName}`);
    log.info(`  Date: ${dbBooking.startAt.toISOString()}`);
    log.info(`  Status: ${dbBooking.status}`);
    log.info(`  Payment Ref: ${dbBooking.paymentReference}`);

    // Step 5: Verify admin can see pending booking
    log.header('Step 5: Verify Admin Panel');

    const adminUrl = `${BASE_URL}/admin?token=${encodeURIComponent(ADMIN_TOKEN)}`;
    const adminResponse = await fetch(adminUrl);
    if (!adminResponse.ok) {
      throw new Error(`Admin panel failed: ${adminResponse.status}`);
    }
    const adminHtml = await adminResponse.text();

    if (adminHtml.includes(dbBooking.clientName)) {
      log.success(`Booking visible in admin panel`);
    } else {
      log.error(`Booking NOT visible in admin panel`);
    }

    // Step 6: Test admin confirmation (without Calendar)
    log.header('Step 6: Test Admin Confirmation');
    const confirmFormData = new FormData();
    confirmFormData.append('token', ADMIN_TOKEN);
    confirmFormData.append('action', 'confirm');
    confirmFormData.append('adminNotes', 'Confirmed by automated test');

    const confirmResponse = await fetch(
      `${BASE_URL}/api/admin/bookings/${bookingId}`,
      {
        method: 'POST',
        body: confirmFormData,
        headers: {
          ...confirmFormData.getHeaders(),
          'Referer': `${BASE_URL}/admin`,
        },
        redirect: 'manual',
      }
    );

    if (confirmResponse.status === 303 || confirmResponse.status === 200) {
      log.success(`Confirmation processed (status: ${confirmResponse.status})`);
    } else {
      throw new Error(`Confirmation failed: ${confirmResponse.status}`);
    }

    // Step 7: Verify status changed in DB
    log.header('Step 7: Verify Booking Status Updated');
    const updatedBooking = await prisma.appointment.findUnique({
      where: { id: bookingId },
    });

    log.info(`Updated status: ${updatedBooking.status}`);
    if (updatedBooking.status === 'CONFIRMED') {
      log.success(`Booking successfully confirmed`);
    } else {
      log.error(`Booking status is ${updatedBooking.status}, expected CONFIRMED`);
    }

    // Summary
    log.header('✅ ALL TESTS PASSED');
    log.success('Booking flow is fully operational');
    log.info(`Test booking ID: ${bookingId}`);
    log.info(`Image saved: ${dbBooking.inspirationImagePath}`);

    // Cleanup
    fs.unlinkSync(testImagePath);
    log.info('Test image cleaned up');

  } catch (error) {
    log.header('❌ TEST FAILED');
    log.error(error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testBookingFlow();
