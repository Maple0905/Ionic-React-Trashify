import Stripe from 'stripe';

const stripe = new Stripe('sk_test_FadEebB2cpXoGCMWNaoOpUG3', {
  apiVersion: "2022-11-15",
});

export default stripe;
