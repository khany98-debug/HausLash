import "server-only"
import Stripe from "stripe"

// Keep builds and non-payment routes usable before production secrets are loaded.
// Stripe calls will reject until a real secret key is configured.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_missing_configuration',
)
