import { type SchemaTypeDefinition } from 'sanity'
import products from './product'
import orders from "./order"
import shippingForm from "./shipping_data"
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [products,orders,shippingForm],
}