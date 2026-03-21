# HausLash Booking System - Deployment & Configuration Guide

## 📋 Pre-Deployment Checklist

### Environment Variables
Before deploying, ensure all these environment variables are configured:

```
✅ DATABASE_URL - Neon PostgreSQL connection string
✅ STRIPE_SECRET_KEY - Stripe API secret key
✅ NEXT_PUBLIC_STRIPE_PUBLIC_KEY - Stripe public key
✅ STRIPE_WEBHOOK_SECRET - Stripe webhook signing secret
✅ ADMIN_PASSWORD - Strong password for admin access
✅ RESEND_API_KEY - API key for Resend email service
✅ RESEND_FROM_ADDRESS - Email address to send from (e.g., noreply@hauslash.co)
✅ ADMIN_EMAIL - Email for admin notifications
✅ NEXT_PUBLIC_YOUTUBE_VIDEO_ID - YouTube video ID (optional)
✅ NEXT_PUBLIC_SITE_URL - Your website URL
```

### Database Setup
1. Create a Neon PostgreSQL database
2. Run `/scripts/001-create-tables.sql` to create all tables
3. Run `/scripts/002-seed-data.sql` to load initial services & availability
4. Verify all indexes are created for performance

### Stripe Setup
1. Create a Stripe account
2. Set up a Product for lash services (or use existing)
3. Create API keys (Public & Secret)
4. Set webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
5. Enable webhook events: `checkout.session.completed`, `checkout.session.expired`

### Email Service (Resend)
1. Create account at resend.com
2. Verify your domain for sending emails
3. Add API key to environment variables
4. Test email sending before going live

## 🚀 Deployment Steps

### Option 1: Deploy to Vercel (Recommended)
```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect to Vercel
vercel

# 3. Set all environment variables in Vercel dashboard
# 4. Deploy
vercel --prod
```

### Option 2: Self-Hosted (e.g., Railway, Render)
```bash
# Build the project
npm run build

# Start the server
npm start
```

## 📊 Key Monitoring Points

### Before Going Live, Test:
- ✅ **Booking Flow**: Complete a test booking with real Stripe test card
- ✅ **Payment Processing**: Verify Stripe webhook updates booking status
- ✅ **Email Delivery**: Check confirmation emails are sent to correct addresses
- ✅ **Admin Dashboard**: Verify admin can access with correct password
- ✅ **Availability**: Test selecting different dates and times
- ✅ **Mobile Responsiveness**: Test on iOS and Android devices

### Post-Deployment Monitoring:
- Monitor Stripe webhook logs for failed events
- Check email delivery logs in Resend dashboard
- Monitor database performance and connection limits
- Set up alerts for critical errors

## 🔒 Security Checklist

- [ ] ADMIN_PASSWORD is at least 32 characters and randomly generated
- [ ] STRIPE_WEBHOOK_SECRET is correctly configured
- [ ] Database connection uses SSL (sslmode=require)
- [ ] All sensitive credentials are in environment variables (never in code)
- [ ] Stripe test mode is switched to production mode before launch
- [ ] CORS is properly configured if API is consumed from other domains
- [ ] Admin pages require proper authentication
- [ ] Rate limiting is implemented on booking API

## 📧 Email Configuration

### Customer Confirmation Email
- Sent automatically when Stripe payment succeeds
- Includes: Service, date, time, deposit amount, remaining balance
- Also offers "Add to Calendar" option

### Admin Notification Email
- Sent when new booking is confirmed
- Includes: Customer details, service, date, time, amount paid

### Appointment Reminders
- Database records created but need background job scheduler
- Requires CRON job or serverless scheduled task to send at scheduled times

## 💾 Backup & Maintenance

- Schedule regular backups of Neon database
- Monitor database storage usage
- Keep Stripe API integration up to date
- Review and rotate admin password regularly

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Payments not going through | Check Stripe API keys, webhook configuration, test card status |
| Confirmation emails not sent | Verify RESEND_API_KEY, check ADMIN_EMAIL is set |
| Admin login failing | Verify ADMIN_PASSWORD environment variable |
| No available slots showing | Check availability_rules table, ensure rules are set for weekdays |
| Database connection errors | Verify DATABASE_URL, check SSL certificate, test connection |

## 📞 Support Resources

- Stripe Docs: https://stripe.com/docs
- Resend Docs: https://resend.com/docs
- Next.js Docs: https://nextjs.org/docs
- Neon Docs: https://neon.tech/docs
