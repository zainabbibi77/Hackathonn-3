// order.js (Sanity Schema)
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
    }),
    defineField({
      name: 'customer',
      title: 'Customer Details',
      type: 'object',
      fields: [
        { name: 'fullName', title: 'Full Name', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'phoneNumber', title: 'Phone Number', type: 'string' },
        { name: 'shippingAddress', title: 'Shipping Address', type: 'text' },
      ],
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Product Name', type: 'string' },
            { name: 'price', title: 'Price', type: 'number' },
            { name: 'qty', title: 'Quantity', type: 'number' },
            { name: 'TrackingId', title: 'Tracking ID', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
    }),
    // Reference to the Stripe payment document
    defineField({
      name: 'stripePayment',
      title: 'Stripe Payment Information',
      type: 'reference',
      to: [{ type: 'stripePayment' }],
    }),
    defineField({
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      },
      initialValue: 'Pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: new Date().toISOString(),
    }),
  ],
});
