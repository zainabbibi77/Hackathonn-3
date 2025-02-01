import { type SchemaTypeDefinition } from 'sanity'
import products from './product'
import orders from './order'
import stripePayment from './stripePayment' // Import the new Stripe payment schema

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [products, orders, stripePayment], // Add stripePayment schema here
}
