import Stripe from "stripe";

let _stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      // Return a dummy client that throws meaningful errors
      // when env var isn't set (build-time safe)
      throw new Error(
        "STRIPE_SECRET_KEY is not configured. " +
        "Set it in your .env.local or Vercel environment variables."
      );
    }
    _stripe = new Stripe(key, {
      apiVersion: "2024-11-20.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

// Lazy proxy: Stripe methods are only initialized when first called
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: keyof Stripe) {
    return getStripeClient()[prop];
  },
});

export const STRIPE_PLANS = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "",
    name: "Starter",
    amount: 1900,
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    name: "Pro",
    amount: 3900,
  },
} as const;

export function getPlanByPriceId(priceId: string) {
  for (const [key, plan] of Object.entries(STRIPE_PLANS)) {
    if (plan.priceId === priceId) return { ...plan, key };
  }
  return null;
}