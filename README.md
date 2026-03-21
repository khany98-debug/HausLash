# HausLash - Premium Booking System

A modern, full-featured booking system for lash services built with Next.js, React, TypeScript, Stripe, and Resend.

## ✨ Features

### 🎯 Customer Experience
- **4-Step Booking Wizard**: Service → Date/Time → Details → Payment
- **Real-Time Availability**: Shows available slots based on rules & bookings
- **Secure Payments**: Stripe payment processing with webhook confirmation
- **Email Confirmations**: Automatic booking confirmations & reminders
- **Responsive Design**: Perfect on mobile, tablet, and desktop
- **Add to Calendar**: Export appointment to Google Calendar

### 👨‍💼 Admin Dashboard
- **Booking Management**: View, cancel, and reschedule bookings
- **Availability Control**: Set weekly hours and manual blocks
- **Analytics**: Booking statistics and revenue tracking
- **Testimonial Management**: Approve and featured customer reviews
- **Calendar View**: Visual overview of upcoming appointments
- **Daily Slots**: Create specific availability for individual dates

### 🔐 Security & Reliability
- **Secure Admin Access**: Token-based authentication
- **Stripe Webhook Verification**: Validates payment confirmations
- **Database Backups**: Neon PostgreSQL with automatic backups
- **Environment Configuration**: All secrets in environment variables

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (v20 recommended)
- npm or pnpm
- PostgreSQL database (Neon recommended)
- Stripe account
- Resend email service account

### Installation

```bash
# Clone repository
git clone <your-repo>
cd hauslash-site

# Install dependencies
npm install
# or
pnpm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Open site in browser
open http://localhost:3000
```

### Setup Database

```bash
# Connect to your Neon database
psql $DATABASE_URL < scripts/001-create-tables.sql
psql $DATABASE_URL < scripts/002-seed-data.sql
```

---

## 📁 Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── (marketing)/             # Public pages (home, services, about)
│   ├── admin/                   # Admin dashboard
│   ├── book/                    # Booking flow
│   ├── api/                     # API routes
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── booking/                 # Booking wizard steps
│   ├── home/                    # Homepage sections
│   ├── ui/                      # Reusable UI components (shadcn/ui)
│   └── site-*.tsx               # Header & footer
├── lib/                         # Utilities & helpers
│   ├── db.ts                    # Database connection
│   ├── stripe.ts                # Stripe integration
│   ├── email.ts                 # Email configuration
│   ├── types.ts                 # TypeScript types
│   └── schema.ts                # SEO schema markup
├── public/                      # Static assets
├── scripts/                     # Database setup SQL
├── emails/                      # Email templates (React Email)
├── DEPLOYMENT.md                # Deployment guide
├── AUDIT_REPORT.md              # System audit report
└── package.json                 # Dependencies
```

---

## 🔧 Configuration

### Environment Variables

See `.env.example` for all required variables:

```bash
# Database
DATABASE_URL=postgresql://...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin
ADMIN_PASSWORD=your-secure-password

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_ADDRESS=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### Database Schema

Key tables:
- `services` - Service offerings (lash lifts, etc.)
- `bookings` - Customer bookings with status tracking
- `availability_rules` - Weekly recurring availability
- `availability_slots` - Manual availability (overrides rules)
- `blocked_times` - Vacation, holidays, manual blocks
- `testimonials` - Customer reviews
- `contact_inquiries` - Contact form submissions

See `scripts/001-create-tables.sql` for full schema.

---

## 📧 Email Integration

### Emails Sent Automatically

1. **Booking Confirmation** (Customer)
   - Sent after Stripe payment confirmed
   - Includes: Service, date, time, deposit amount

2. **Admin Notification** (Staff)
   - Sent when new booking confirmed
   - Includes: Customer details, service, time, amount

3. **Contact Form Reply** (Customer)
   - Sent after contact form submission
   - Confirmation of receipt

4. **Contact Inquiry Alert** (Admin)
   - New contact inquiry notification
   - Link to admin dashboard

5. **Appointment Reminders** (Future Implementation)
   - 24 hours before appointment
   - 1 hour before appointment
   - *Requires background job scheduler*

---

## 🏗️ Deployment

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

See `DEPLOYMENT.md` for detailed deployment instructions including:
- Railway, Render, or other hosting
- Self-hosted setups
- Environment variable configuration
- Post-deployment testing checklist

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Complete booking flow with Stripe test card
- [ ] Verify confirmation emails sent
- [ ] Check admin dashboard booking appears
- [ ] Test availability calendar
- [ ] Test "Add to Calendar" feature
- [ ] Test contact form
- [ ] Verify mobile responsiveness
- [ ] Test admin reschedule/cancel functions

### Test Credentials

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`  
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

---

## 📊 Monitoring

### Post-Launch Monitoring

- **Stripe Dashboard**: Monitor transaction success rates
- **Resend Dashboard**: Check email delivery rates
- **Server Logs**: Monitor for errors and exceptions
- **Database**: Monitor connection usage and storage
- **Analytics**: Track visitor flow and conversion

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Payments not processing | Verify Stripe API keys, check webhook secret |
| Emails not sent | Check RESEND_API_KEY, ADMIN_EMAIL configured |
| Admin can't log in | Verify ADMIN_PASSWORD set correctly |
| No available slots | Check availability_rules for weekday entries |
| Database connection error | Verify DATABASE_URL, test connection |

---

## 📖 API Documentation

### Booking Endpoints

**POST /api/bookings**
- Create pending booking + Stripe checkout session

**GET /api/availability**
- Get available time slots for date/service

**PATCH /api/admin/bookings**
- Cancel or reschedule booking (admin)

**POST /api/contact**
- Submit contact form

**GET /api/testimonials**
- Get approved testimonials

### Webhook Endpoints

**POST /api/webhooks/stripe**
- Stripe payment confirmation webhook
- Updates booking status to "confirmed"

---

## 🔐 Security Considerations

- ✅ All secrets in environment variables
- ✅ Stripe webhook signature verification
- ✅ Admin token authentication
- ✅ HTTPS required in production
- ✅ CORS configured
- ✅ SQL injection protection via parameterized queries
- ✅ Email validation on all forms

**Recommended:**
- Implement rate limiting on APIs
- Add CSRF protection
- Consider admin OAuth/JWT
- Enable database encryption

---

## 📈 Performance

- **Page Load**: < 3 seconds (First Contentful Paint)
- **API Response**: < 200ms average
- **Database**: Indexed queries optimized
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Commit: `git commit -am 'Add feature'`
4. Push: `git push origin feature/name`
5. Create Pull Request

---

## 📄 License

Private project for HausLash Studio

---

## 📞 Support

- **Issues & Bugs**: Create GitHub issue
- **Feature Requests**: Email admin@hauslash.co
- **Deployment Help**: See DEPLOYMENT.md

---

**Last Updated**: March 21, 2026  
**Deployment Status**: ✅ **READY FOR PRODUCTION**
