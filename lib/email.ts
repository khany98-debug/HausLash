import 'server-only'
import { Resend } from 'resend'

// Keep builds and non-email routes usable before production secrets are loaded.
// Resend will reject send attempts until a real key is configured.
export const resend = new Resend(process.env.RESEND_API_KEY || 'missing_configuration')
