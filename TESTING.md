# 🎉 Joss Studio Booking MVP - READY FOR TESTING

## ✅ Status
**FULLY FUNCTIONAL AND TESTED END-TO-END**

All booking workflows have been validated:
- ✓ Available slots calculation
- ✓ Booking creation with image upload
- ✓ Database persistence
- ✓ Admin panel display
- ✓ Admin confirmation workflow
- ✓ Status transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 22.6.0+ (already confirmed ✓)
- PostgreSQL 14+ (Docker container running ✓)
- `.env` file configured (already created ✓)

### Run Locally

```bash
# Terminal 1: Build and start server
npm run build
node run-server.mjs

# Opens on http://localhost:4321

# Terminal 2: Run test suite (in another terminal)
node test-booking-flow.mjs
```

Expected output:
```
📌 ✅ ALL TESTS PASSED
✓ Booking flow is fully operational
```

## 📋 What Works Now

### User Booking Page (`/`)
- Service selection dropdown (3 options)
- Date picker (with timezone Costa Rica)
- Real-time availability slots (30-min intervals)
- Client info form (name, phone, email)
- Payment reference (#)
- Inspiration image upload
- Form validation with real-time feedback

### Admin Dashboard (`/admin?token=cambia-este-token`)
- Lists pending bookings (PENDING_VALIDATION status)
- Shows confirmed upcoming citas (CONFIRMED status)
- Confirm button → changes status to CONFIRMED
- Reject button → changes status to REJECTED with admin notes

### Backend APIs
- `GET /api/availability?serviceId=soft-gel&date=2026-09-18` → Returns available slots
- `POST /api/bookings` → Create new booking with image upload
- `POST /api/admin/bookings/[id]` → Admin confirm or reject action

### Database
- PostgreSQL table `appointment` with 18 fields
- Status workflow: PENDING_VALIDATION → CONFIRMED (or REJECTED)
- Image storage: `/public/uploads/inspirations/`
- Indexes on date range and payment reference

## 🔗 Next Steps

### Option 1: Add Google Calendar Integration
To auto-create Calendar events when citas are confirmed:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a service account or use existing one
3. Enable Google Calendar API
4. Download the JSON key file
5. Add to `.env`:
   ```
   GOOGLE_CALENDAR_ID="your-calendar@gmail.com"
   GOOGLE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
6. Uncomment Calendar code in `src/pages/api/admin/bookings/[id].ts`
7. Rebuild: `npm run build`

### Option 2: Deploy to Production

```bash
# Build production artifacts
npm run build

# Deploy dist/ folder to your hosting:
# - Vercel (automatic)
# - Railway: Add DATABASE_URL + other secrets to environment
# - Render: Add build command `npm run build`
# - Self-hosted: Run `node run-server.mjs` on your server
```

Environment variables needed on production server:
- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_TOKEN` - Admin panel access token (change from default!)
- `PUBLIC_SITE_URL` - Your domain (e.g., https://joss-studio.com)
- `GOOGLE_CALENDAR_ID` (optional)
- `GOOGLE_CLIENT_EMAIL` (optional)
- `GOOGLE_PRIVATE_KEY` (optional)

### Option 3: Add Features

Common additions:
- Email notifications on booking
- WhatsApp notification to admin
- Edit/cancel booking self-service
- Payment integration (Stripe, PayPal)
- Real authentication system (Lucia, Auth0)
- SMS confirmations

## ⚙️ Configuration

### Services (Modify in `src/lib/services.ts`)
```typescript
{
  id: 'soft-gel',
  name: 'Soft Gel Natural',
  durationMinutes: 90,
  price: 18000, // CRC
  deposit: 9000,  // 50% deposit
}
```

### Business Hours (Modify in `src/lib/availability.ts`)
```typescript
const BUSINESS_SCHEDULE: Record<number, BusinessHours[]> = {
  0: [],  // Sunday - closed
  1: [{ start: '09:00', end: '18:00' }],  // Monday
  // ... etc
  6: [{ start: '08:00', end: '16:00' }],  // Saturday
};
```

### Admin Token
- Located in `.env` → `ADMIN_TOKEN`
- Change before production!
- Access: `http://localhost:4321/admin?token={ADMIN_TOKEN}`

## 📊 Database Schema

```
Appointment {
  id              String        @id @default(cuid())
  serviceId       String
  serviceName     String
  servicePrice    Int
  depositAmount   Int
  clientName      String
  clientPhone     String
  clientEmail     String?
  paymentReference String
  inspirationImagePath String?
  notes           String?
  adminNotes      String?
  startAt         DateTime      // Appointment start (Costa Rica TZ)
  endAt           DateTime      // Appointment end
  status          BookingStatus // PENDING_VALIDATION | CONFIRMED | REJECTED | CANCELLED
  googleEventId   String?       // Calendar event ID (if created)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([startAt, status])
  @@index([paymentReference])
}

enum BookingStatus {
  PENDING_VALIDATION  // Awaiting admin review
  CONFIRMED           // Admin approved + payment verified
  REJECTED            // Admin rejected
  CANCELLED           // User or admin cancelled
}
```

## 🧪 Test Suite

Run automated tests anytime:
```bash
node test-booking-flow.mjs
```

What it tests:
1. Fetches available slots from API
2. Creates a booking with image upload
3. Verifies booking persisted to database
4. Checks admin panel displays pending booking
5. Tests admin confirmation workflow
6. Verifies database status updated to CONFIRMED

## 🔒 Security Considerations

Before production:

- [ ] Re-enable CSRF protection (`astro.config.mjs`: `security: {checkOrigin: true}`)
- [ ] Change `ADMIN_TOKEN` in `.env`
- [ ] Add real authentication (not just token query param)
- [ ] Set strong PostgreSQL password
- [ ] Enable HTTPS on your domain
- [ ] Add rate limiting to APIs
- [ ] Validate/sanitize all file uploads

## 📞 Support

If you encounter issues:

1. Check logs: Terminal should show request details
2. Database: Run `npx prisma studio` to inspect data
3. Network: Ensure PostgreSQL container is running (`docker ps`)
4. Env: Verify `.env` file exists in project root

## 🎯 What's Next?

Small checklist of recommended next actions:

- [ ] Test booking form on mobile device
- [ ] Add admin notification emails
- [ ] Implement real login system
- [ ] Add payment verification logic
- [ ] Set up Google Calendar sync
- [ ] Deploy to production domain
- [ ] Add booking edit/cancel flow

---

Built with **Astro 5 + Prisma + PostgreSQL + Node.js**
Tested: September 18, 2026 ✓
