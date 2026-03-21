# Hauslash Website - Comprehensive Project Analysis

**Business:** Hauslash - Premium Lash Lift Services in Stoke-on-Trent, UK  
**Project Date:** March 2026  
**Status:** Functional booking and payment system with admin dashboard

---

## 1. PROJECT ARCHITECTURE & TECH STACK

### Core Framework & Technologies
- **Framework:** Next.js 16.1.6 with React 19.2.4
- **Language:** TypeScript 5.7.3
- **Database:** Neon Postgres (serverless)
- **Styling:** Tailwind CSS v4.2.0 + PostCSS
- **UI Component Library:** Radix UI (multiple components)
- **Form Handling:** React Hook Form + Zod validation
- **Payment Processing:** Stripe (v17.5.0)
- **Email Service:** Resend (react-email)
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics
- **Notifications:** Sonner toasts
- **Utilities:** clsx, tailwind-merge, date-fns

### Architecture Approach
- **App Router:** Next.js 13+ app directory structure
- **Server Components:** Server-side data fetching for pages
- **Client Components:** Interactive booking flow and admin dashboard
- **API Routes:** RESTful API endpoints for booking, availability, admin functions
- **Dynamic Routes:** Force-dynamic rendering for real-time data

---

## 2. PROJECT STRUCTURE & KEY DIRECTORIES

```
Root/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global Tailwind CSS + design tokens
│   ├── layout.tsx               # Root layout with metadata
│   ├── (marketing)/             # Marketing pages layout group
│   │   ├── page.tsx             # Landing/homepage
│   │   ├── services/page.tsx    # Services listing
│   │   ├── policies/page.tsx    # Cancellation & aftercare policies
│   │   └── layout.tsx           # Header + Footer wrapper
│   ├── admin/                   # Password-protected admin section
│   │   ├── page.tsx             # Bookings management dashboard
│   │   ├── services/page.tsx    # Service management
│   │   ├── calendar/page.tsx    # Availability management
│   │   ├── availability/page.tsx# Availability rules
│   │   └── layout.tsx           # Admin auth authentication
│   ├── book/                    # Booking flow
│   │   ├── page.tsx             # Multi-step booking wizard
│   │   └── success/page.tsx     # Post-payment confirmation
│   ├── api/                     # API routes
│   │   ├── bookings/route.ts    # Create bookings + Stripe checkout
│   │   ├── availability/route.ts # Get available time slots
│   │   ├── admin/               # Admin API endpoints
│   │   │   ├── bookings/        # Manage bookings (cancel/reschedule)
│   │   │   ├── services/        # CRUD services
│   │   │   ├── availability/    # Manage availability rules
│   │   │   ├── calendar/        # Block/unblock dates
│   │   │   └── slots/           # Manual time slot entry
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts  # Payment confirmation webhook
│   │   └── Send-confirmation/   # Email confirmation endpoint
│
├── components/                  # React components
│   ├── site-header.tsx         # Navigation bar (desktop + mobile)
│   ├── site-footer.tsx         # Footer with links
│   ├── theme-provider.tsx      # Next-themes wrapper
│   ├── home/                   # Homepage sections
│   │   ├── hero-section.tsx    # Hero intro + CTA
│   │   ├── trust-section.tsx   # Why Hauslash (4 features)
│   │   ├── gallery-section.tsx # Before/after images (3 images)
│   │   ├── faq-section.tsx     # FAQ accordion (6 questions)
│   │   └── cta-section.tsx     # Final call-to-action
│   ├── booking/                # Multi-step booking components
│   │   ├── booking-wizard.tsx  # Main wizard controller
│   │   ├── step-indicator.tsx  # Progress indicator
│   │   ├── service-step.tsx    # Service selection
│   │   ├── date-time-step.tsx  # Calendar + time slot picker
│   │   ├── details-step.tsx    # Customer info form
│   │   ├── review-step.tsx     # Booking summary + Stripe checkout
│   │   └── add-to-calendar.tsx # ICS calendar export
│   └── ui/                     # Radix UI-based component library
│       └── [40+ shadcn components] # Accordion, Dialog, Form, etc.
│
├── lib/                        # Utilities & database
│   ├── db.ts                   # Neon database connection
│   ├── types.ts                # TypeScript interfaces + formatters
│   ├── utils.ts                # Tailwind cn() utility
│   ├── email.ts                # Resend email client
│   ├── stripe.ts               # Stripe client
│   └── availability.ts         # (Referenced in imports)
│
├── emails/                     # Email templates (React Email)
│   ├── booking-confirmation.tsx # Booking confirmed
│   ├── booking-cancellation.tsx # Booking cancelled
│   └── booking-reschedule.tsx   # Rescheduled booking
│
├── scripts/                    # Database init
│   ├── 001-create-tables.sql   # Schema creation
│   └── 002-seed-data.sql       # Sample services & availability
│
├── public/images/
│   └── work/                   # Gallery images
│       ├── Hero.jpg
│       ├── Model1.jpg
│       └── Model2.jpeg
│
├── styles/
│   └── globals.css             # Custom theme variables (OKLch color tokens)
│
├── Configuration Files
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript config (@/* alias)
│   ├── next.config.mjs         # Next.js config (unoptimized images)
│   ├── postcss.config.mjs       # PostCSS + Tailwind config
│   ├── components.json         # UI component registry
│   └── .env.local              # (Database URL, Stripe keys, Admin password)
```

---

## 3. PAGES & ROUTES

### Public Pages (Marketing)
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `(marketing)/page.tsx` | Landing page with hero, trust, gallery, FAQ, CTA |
| `/services` | `(marketing)/services/page.tsx` | Service catalog with pricing and booking links |
| `/policies` | `(marketing)/policies/page.tsx` | Cancellation policy and patch test info |
| `/book` | `book/page.tsx` | Multi-step booking wizard |
| `/book/success` | `book/success/page.tsx` | Booking confirmation after payment |

### Admin Pages (Password-Protected)
| Route | Purpose |
|-------|---------|
| `/admin` | Bookings dashboard with filter by status |
| `/admin/services` | Add/edit/delete services |
| `/admin/calendar` | Block/unblock dates |
| `/admin/availability` | Set weekly availability rules |

### API Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/bookings` | POST | Create booking + generate Stripe checkout |
| `/api/availability` | GET | Get available time slots for a date |
| `/api/admin/bookings` | GET/PATCH | List bookings / cancel or reschedule |
| `/api/admin/services` | GET/POST/PUT/DELETE | Manage services |
| `/api/admin/availability` | GET/POST | Manage availability rules |
| `/api/admin/calendar` | GET/POST | Block/unblock dates |
| `/api/admin/slots` | GET/POST | Manual time slot entry |
| `/api/webhooks/stripe` | POST | Stripe webhook for payment confirmation |
| `/api/Send-confirmation` | POST | Email confirmation trigger |

---

## 4. COMPONENTS IN DETAIL

### Home Page Sections

#### Hero Section (`components/home/hero-section.tsx`)
- **Headline:** "Effortless beauty, naturally elevated"
- **Tagline:** "Premium Lash & Brow Studio - Stoke-on-Trent"
- **Description:** Highlights Korean lash lifts, brow lamination, tinting
- **CTAs:** "Book Your Appointment" + "View Services" buttons
- **Image:** Responsive hero image (4:5 aspect ratio)
- **Design:** Center-aligned text with side image (responsive layout)

#### Trust Section (`components/home/trust-section.tsx`)
Four value propositions displayed as cards:
1. **Korean Technique** - Trained in latest methods, natural dramatic curl
2. **Long-Lasting** - Results last 6-8 weeks
3. **Safe & Gentle** - Premium, cruelty-free products
4. **Personalized Care** - Treatments tailored to individual needs

#### Gallery Section (`components/home/gallery-section.tsx`)
- Displays 3 before/after images in grid layout
- Responsive: 1 column mobile, 2 columns tablet, 3 columns desktop
- Hover zoom effect on images
- Images: Hero.jpg, Model1.jpg, Model2.jpeg

#### FAQ Section (`components/home/faq-section.tsx`)
Six accordion items:
1. What is a Korean lash lift?
2. How long does a treatment take?
3. Do I need a patch test?
4. How long do results last?
5. Is a deposit required to book?
6. What is your cancellation policy?

#### CTA Section (`components/home/cta-section.tsx`)
Final conversion section with headline, description, and "Book Your Appointment" button

### Booking Wizard Flow

**Step 1: Service Selection** (`components/booking/service-step.tsx`)
- Radio-style card selection of services
- Shows service name, description, duration, price, deposit amount
- Highlights selected service with primary color

**Step 2: Date & Time** (`components/booking/date-time-step.tsx`)
- Calendar picker (60-day window from today)
- Loads available time slots via API based on selected date
- Shows availability from rules, minus booked times and blocked dates
- Radio buttons for time slot selection

**Step 3: Customer Details** (`components/booking/details-step.tsx`)
- Form fields: Name, Email, Phone, Notes (optional)
- Validation using React Hook Form + Zod
- Email format validation
- Phone validation (7-20 chars, digits + special formatting chars)

**Step 4: Review & Pay** (`components/booking/review-step.tsx`)
- Summary of appointment details
- Shows service name, date, time, duration, customer info
- Integrates Stripe checkout form
- Deposit amount shown
- Redirects to Stripe hosted checkout on confirmation

### Admin Features

#### Bookings Dashboard (`app/admin/page.tsx`)
- Table displaying all bookings sorted by date
- Columns: Service, Customer, Date, Time, Status, Deposit, Actions
- Status filter dropdown: Pending Payment, Confirmed, Completed, Cancelled, Refunded
- Pagination (20 items per page)
- Cancel booking action with dialog confirmation
- Reschedule booking with new date/time/reason
- Email notifications sent on cancel/reschedule
- Color-coded status badges

---

## 5. DATABASE SCHEMA

### Tables

#### `services`
```sql
id (UUID)              - Primary key
name (TEXT)            - Service name
slug (TEXT UNIQUE)     - URL-friendly identifier
description (TEXT)     - Service description
duration_minutes (INT) - Appointment length (30-90 min)
price_pence (INT)      - Full price in pence (0-7500p)
deposit_pence (INT)    - Deposit required (1000-2000p)
active (BOOLEAN)       - Show in booking flow
sort_order (INT)       - Display order
created_at (TIMESTAMPTZ) - Creation timestamp
```

#### `availability_rules`
```sql
id (UUID)         - Primary key
weekday (INT)     - 0-6 (Sun-Sat)
start_time (TIME) - Opening time (e.g., 09:00)
end_time (TIME)   - Closing time (e.g., 17:00)
buffer_minutes(INT) - Break between appointments (15 min default)
```

#### `blocked_times`
```sql
id (UUID)           - Primary key
start_at (TIMESTAMPTZ) - Block start
end_at (TIMESTAMPTZ)   - Block end
reason (TEXT)          - Why blocked (holiday, etc.)
```

#### `bookings`
```sql
id (UUID)       - Primary key
service_id (UUID) - Foreign key to services
start_at (TIMESTAMPTZ) - Appointment start
end_at (TIMESTAMPTZ)   - Appointment end
customer_name (TEXT)   - Full name
customer_email (TEXT)  - Email address
customer_phone (TEXT)  - Phone number
notes (TEXT)           - Special requests
status (TEXT)          - pending_payment, confirmed, cancelled, completed, refunded
stripe_checkout_session_id (TEXT) - Stripe session reference
deposit_amount_pence (INT) - Deposit paid
created_at (TIMESTAMPTZ) - Booking created
updated_at (TIMESTAMPTZ) - Last updated
expires_at (TIMESTAMPTZ) - Expiry if payment pending (30 min default)
```

### Indexes
- `bookings(status)` - Filter by booking status
- `bookings(start_at)` - Query by date
- `bookings(expires_at) WHERE status = 'pending_payment'` - Find expired pending bookings
- `bookings(stripe_checkout_session_id)` - Webhook lookups

---

## 6. SERVICES OFFERED

| Service | Duration | Price | Deposit | Description |
|---------|----------|-------|---------|-------------|
| Classic Lash Lift | 60 min | £45.00 | £15.00 | Enhances natural lashes for up to 8 weeks |
| Korean Lash Lift | 75 min | £55.00 | £15.00 | Signature Korean-technique lift with dramatic curl |
| Lash Lift & Brow Lamination | 90 min | £75.00 | £20.00 | Complete eye-framing combo |
| Brow Lamination | 45 min | £35.00 | £10.00 | Sculpted, groomed brows with tint |
| Lash Tint | 30 min | £20.00 | £10.00 | Colour boost for natural lashes |

**Current Availability:**
- **Monday-Friday:** 9:00 AM - 5:00 PM
- **Saturday:** 10:00 AM - 3:00 PM
- **Sunday:** Closed
- **Buffer time:** 15 minutes between appointments

---

## 7. BOOKING SYSTEM FLOW

### Customer Journey
1. **Browse Services** → `/services` page with pricing and durations
2. **Start Booking** → Click "Book" → `/book` page
3. **Multi-step Wizard:**
   - Select service
   - Pick date from 60-day calendar
   - Choose available time slot (auto-loaded from API)
   - Enter contact details (name, email, phone, notes)
   - Review booking details
4. **Deposit Payment** → Stripe checkout for deposit amount
5. **Confirmation** → Payment webhook updates booking status to "confirmed"
6. **Confirmation Email** → Resend email with appointment details
7. **Calendar Addition** → Option to download .ics file for calendar apps

### Payment Flow
- **Stripe Integration:** Hosted checkout for security
- **Deposit Required:** Customer pays deposit upfront
- **Remaining Balance:** Paid in cash/card at appointment
- **Webhook Handler:** Updates booking status when payment confirmed
- **Checkout Expiry:** 30-minute hold on booking slots, expires if payment not completed

### Admin Cancellation/Rescheduling
- Admin cancels booking → Deposit forfeited → Email sent to customer
- Admin reschedules → Customer notified with new date/time → Email confirmation
- Reasons captured for tracking

---

## 8. STYLING & DESIGN

### Design Tokens (OKLch Color Space)
**Light Mode:**
- **Background:** Pure white (`oklch(1 0 0)`)
- **Foreground:** Near black (`oklch(0.145 0 0)`)
- **Primary:** Dark gray (`oklch(0.205 0 0)`)
- **Primary Foreground:** White (`oklch(0.985 0 0)`)
- **Muted:** Off-white (`oklch(0.97 0 0)`)
- **Border:** Light gray (`oklch(0.922 0 0)`)
- **Card Background:** `#EEEDE9` (warm beige/tan)

**Dark Mode:**
- Inverted color scheme with light text on dark background
- Primary accent becomes light for contrast

### Key Design Features
- **Typography:** Serif fonts (Playfair Display) for headings, sans-serif (Inter) for body
- **Spacing:** Consistent padding/margins using Tailwind scale
- **Rounded Corners:** `border-radius: 0.625rem` (10px) default
- **Responsive:** Tailwind breakpoints (sm: 640px, md: 768px, lg: 1024px)
- **Animations:** Smooth transitions, hover effects on interactive elements
- **Header:** Sticky navigation with mobile hamburger menu
- **Layout:** Max-width container (6rem / 1536px) for readable text

### Component Styling
- **Buttons:** Rounded-full (pill shape), size variants (sm, md, lg)
- **Forms:** Clean input fields, error states in red, validation feedback
- **Cards:** Bordered with slight shadow on hover
- **Modals/Dialogs:** Alert dialogs for destructive actions (cancel booking)
- **Status Badges:** Color-coded by booking status (green=confirmed, amber=pending, etc.)

---

## 9. FUNCTIONALITY & FEATURES

### Booking System
✅ Multi-step booking wizard with progress indicator  
✅ Real-time availability calculation  
✅ Conflict detection (prevent double-bookings)  
✅ Deposit payment via Stripe  
✅ Email confirmations (Resend)  
✅ Calendar integration (.ics file export)  
✅ Customer validation (name, email, phone)  
✅ Optional notes field  

### Admin Dashboard
✅ Password-protected authentication (token-based)  
✅ Browse all bookings with pagination  
✅ Filter by status (pending, confirmed, completed, cancelled, refunded)  
✅ Cancel bookings with email notification  
✅ Reschedule bookings with email notification  
✅ Manage services (add/edit/delete)  
✅ Set availability rules per weekday  
✅ Block/unblock dates (holidays, events)  
✅ Manual time slot entry  

### Payment & Webhooks
✅ Stripe checkout integration  
✅ Webhook handling for payment confirmation  
✅ 30-minute booking expiry timer  
✅ Automatic status updates on payment success  
✅ Checkout expiry handling  

### Communication
✅ Email confirmations via Resend  
✅ Cancellation emails with refund info  
✅ Rescheduling emails with new details  
✅ HTML email templates using React Email  

### Content
✅ Service catalog with descriptions  
✅ FAQ section with 6 common questions  
✅ Cancellation and patch test policies  
✅ Trust/social proof section  
✅ Image gallery  

---

## 10. CURRENT CONTENT & MESSAGING

### Brand Position
**"Elevate your natural beauty with expert Korean lash lifts, brow lamination, and lash tinting."**

### Key Messages
- Premium quality with Korean techniques
- Long-lasting results (6-8 weeks)
- Safe, gentle, cruelty-free products
- Personalized to individual needs
- Located in Stoke-on-Trent, UK
- Effortless maintenance

### Call-to-Action Copy
- "Book Your Appointment"
- "View Services"
- "Discover the Hauslash difference"
- "Ready to elevate your look?"

### Trust Signals
- Korean lash lifting training
- Results last 6-8 weeks
- Premium cruelty-free products
- Personalized care approach

### Policy Information
- Non-refundable deposits secure time slots
- 24+ hours notice required to reschedule without losing deposit
- Patch test required 48 hours before first treatment
- Free patch test appointments available

---

## 11. MISSING & INCOMPLETE FEATURES

### Content/Marketing Gaps
⚠️ **Contact/Location Information** - No phone number, address, or contact form visible  
⚠️ **Instagram/Social Links** - No social media integration in header/footer  
⚠️ **Team/About Section** - No artist bios or credentials  
⚠️ **Testimonials/Reviews** - No customer reviews or ratings section  
⚠️ **Blog/Resources** - No aftercare guide, lash care tips, or blog content  

### Booking System Gaps
⚠️ **Availability Slots Table Missing** - `availability_slots` table referenced in API but not created  
  - Blocks booking from using manual time slots feature
  - API expects `SELECT * FROM availability_slots` but table undefined
⚠️ **Time Slot Validation** - Date/time picker may not properly validate against manual slots  
⚠️ **Guest Booking Option** - No option to book without account/email  
⚠️ **Booking Confirmation SMS** - Only email confirmations, no SMS option  

### Admin Features
⚠️ **No Staff Management** - Single service provider assumption, no staff assignment  
⚠️ **No Service Customization UI** - Admin can manage but no UI for services page visible  
⚠️ **No Calendar Day View** - No visual calendar view of booked appointments  
⚠️ **No Reporting/Analytics** - No revenue tracking, booking trends, or metrics  
⚠️ **No Bulk Actions** - Can't cancel multiple bookings at once  

### Security & Data
⚠️ **No User Accounts** - Customers can't view/manage past bookings  
⚠️ **Password Policy** - Admin password stored in environment variable, no password reset  
⚠️ **GDPR Compliance** - No privacy policy page or data deletion mechanism  
⚠️ **Booking History** - Customers have no way to access their booking history  

### User Experience
⚠️ **No Availability Alerts** - Can't notify customers when preferred slots open up  
⚠️ **No Reminders** - No pre-appointment reminder emails (24h, 1h before)  
⚠️ **No Waitlist** - Can't add to waitlist if no availability  
⚠️ **Incomplete Policies Page** - Only cancellation and patch test info, missing:
  - Aftercare instructions
  - Contraindications/allergies info
  - Full T&Cs

### Technical Issues
⚠️ **Slot API Bug** - `availability_slots` table doesn't exist but API tries to query it  
⚠️ **Image Optimization** - `unoptimized: true` in Next.js config (performance impact)  
⚠️ **TypeScript Errors Ignored** - `ignoreBuildErrors: true` in Next.js config  
⚠️ **No Error Boundaries** - No error handling component for failed API calls  

### Integrations Missing
⚠️ **Google/Apple Calendar Sync** - No two-way calendar integration  
⚠️ **SMS Notifications** - No SMS confirmations or reminders  
⚠️ **Marketing Automation** - No email sequences, upsells, or loyalty program  
⚠️ **Analytics Integration** - Only basic Vercel Analytics, no custom tracking  

---

## 12. ENHANCEMENT OPPORTUNITIES

### High Priority
1. **Create `availability_slots` table** - Enable manual time slot functionality
2. **Add Customer Account System** - Let customers view/manage their bookings
3. **Pre-appointment Reminders** - Email reminders 24h and 1h before
4. **Contact Page** - Phone, address, contact form, map integration
5. **Testimonials Section** - Customer reviews and ratings

### Medium Priority
6. **Staff Management** - Multiple therapists with individual calendars
7. **Service Packages** - Bundle discounts (e.g., 3 treatments)
8. **Waitlist Feature** - Notify customers when slots available
9. **Aftercare Guide** - Detailed post-treatment instructions
10. **Admin Analytics Dashboard** - Revenue, booking trends, popular services

### Nice-to-Have
11. **Loyalty Program** - Point system or referral rewards
12. **Gift Certificates** - Digital gift card sales
13. **WhatsApp Integration** - Appointment reminders via WhatsApp
14. **Before/After Gallery** - User-submitted results with permission
15. **Blog** - SEO-friendly content about lash care, trends

---

## 13. ENVIRONMENT & DEPLOYMENT

### Required Environment Variables
```
DATABASE_URL=postgresql://...  # Neon Postgres connection
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
ADMIN_PASSWORD=...             # Password for admin section
```

### Build Configuration
- TypeScript errors ignored (for deployment)
- Images unoptimized (set to optimized for production)
- Dynamic rendering on force-dynamic pages

### Deployment Target
- Built for Vercel (Next.js native)
- Database: Neon Postgres (serverless)
- Email: Resend (serverless)
- Payments: Stripe (SaaS)
- Analytics: Vercel Analytics

---

## SUMMARY

The **Hauslash website** is a fully-functional booking and payment system for a premium lash services studio in Stoke-on-Trent. It features:

✅ **Modern tech stack** (Next.js, React, TypeScript, Tailwind)  
✅ **Complete booking flow** from service selection to payment  
✅ **Admin dashboard** for managing appointments and services  
✅ **Payment processing** via Stripe with webhook confirmation  
✅ **Email notifications** for confirmations and updates  
✅ **Responsive design** across all devices  
✅ **Real-time availability** calculation to prevent double-bookings  

The main limitations are:
- Missing `availability_slots` table (blocks manual slot feature)
- No customer accounts or booking history
- Limited aftercare/educational content
- No reminder system or analytics
- Single provider assumption

These gaps present good opportunities for growth and additional value delivery to customers and the business owner.
