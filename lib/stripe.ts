import Stripe from 'stripe';

function createStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Add it to your .env file.\n' +
      'Get your key from https://dashboard.stripe.com/apikeys'
    );
  }
  return new Stripe(key, { apiVersion: '2025-10-29.clover' });
}

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) _stripe = createStripe();
  return _stripe;
}

export default getStripe;
