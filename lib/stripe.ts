import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe client will use a placeholder key.");
}

export const stripe = new Stripe(secretKey ?? "sk_test_placeholder", {
  apiVersion: "2025-09-30.clover",
});

export function getCheckoutUrl(sessionId: string) {
  const publicKey = process.env.STRIPE_PUBLISHABLE_KEY;

  if (!publicKey) {
    throw new Error("STRIPE_PUBLISHABLE_KEY is not set");
  }

  return `https://checkout.stripe.com/pay/${sessionId}`;
}
