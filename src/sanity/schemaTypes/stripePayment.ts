// stripePayment.js (Sanity Schema)
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'stripePayment',
  title: 'Stripe Payment',
  type: 'document',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string', // Unique Order ID
    }),
    defineField({
      name: 'paymentIntentId',
      title: 'Payment Intent ID',
      type: 'string', // Stripe's Payment Intent ID
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string', // e.g., "succeeded", "pending", "failed"
    }),
    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string', // e.g., "Credit Card", "Stripe"
    }),
    defineField({
      name: 'amountPaid',
      title: 'Amount Paid',
      type: 'number', // Payment amount (in cents)
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string', // e.g., USD
    }),
    defineField({
      name: 'paymentDate',
      title: 'Payment Date',
      type: 'datetime', // Date of payment
    }),
  ],
});
