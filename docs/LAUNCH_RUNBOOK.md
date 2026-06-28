# Hauslash Launch Runbook

Target launch: Tuesday 30 June 2026.

## Must Do Before Launch

1. Run the production database migration in Neon:

   ```sql
   -- scripts/003-launch-hardening.sql
   ```

2. Confirm Vercel environment variables:

   - `DATABASE_URL`
   - `NEXT_PUBLIC_SITE_URL=https://hauslash.co.uk`
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...`
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
   - `RESEND_API_KEY`
   - `RESEND_FROM_ADDRESS` using a Resend-verified sender
   - `ADMIN_EMAIL=Hauslash@outlook.com`
   - `ADMIN_PASSWORD` long random password
   - `CRON_SECRET` different long random secret

3. Stripe webhook destination:

   - Endpoint: `https://hauslash.co.uk/api/webhooks/stripe`
   - Required events:
     - `checkout.session.completed`
     - `checkout.session.expired`

4. Resend sender:

   - Verify the sender/domain used in `RESEND_FROM_ADDRESS`.
   - Send a real booking confirmation test to a customer email.
   - Confirm replies go to `Hauslash@outlook.com`.

5. Services in production database:

   - Patch Test: price `£0`, deposit `£0`, duration `15 minutes`.
   - Korean Lash Lift - In-Studio: duration `90 minutes`, deposit `£15`.
   - Korean Lash Lift - Mobile Outcall: duration `90 minutes`, deposit `£15`.

6. End-to-end test matrix:

   - Book free Patch Test and receive confirmation email.
   - Book paid in-studio lash lift with Stripe live/test mode as appropriate.
   - Book Mobile Outcall and confirm email/calendar does not show studio address.
   - Cancel appointment in Admin and confirm cancellation email plus cancellation calendar file.
   - Reschedule appointment in Admin and confirm reschedule email plus new calendar file.
   - Submit review and confirm it stays pending until approved.
   - View My Bookings and confirm the email code flow works.
   - Submit contact form and confirm customer/admin emails arrive.

## Current Security Notes

- Public forms and customer booking lookup now use database-backed rate limiting.
- Customer booking history requires a one-time email code.
- Stripe webhook rejects requests if `STRIPE_WEBHOOK_SECRET` is missing.
- Reviews are pending by default and public pages only show approved reviews.
- Legal pages added: `/privacy`, `/cookies`, `/terms`, `/policies`.

## Remaining Dependency Task

Run locally or in CI once the local runtime has enough disk/runtime availability:

```bash
pnpm update next
pnpm audit --prod
pnpm typecheck || npx tsc --noEmit
pnpm build
```

Do not launch until high-severity production dependency advisories are resolved or explicitly accepted with a documented reason.
