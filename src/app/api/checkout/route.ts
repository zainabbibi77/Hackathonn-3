import { NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "@/sanity/lib/client";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const { orderData } = await req.json();

    if (!orderData || !orderData.customer || !orderData.products || !orderData.totalPrice) {
      console.error("❌ Invalid order data received:", orderData);
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const orderId = `ORD-${Date.now()}`; // Unique Order ID

    // ✅ Ensure `NEXT_PUBLIC_DOMAIN` is defined
    const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_DOMAIN is not set in environment variables.");
    }

    // ✅ Create a Stripe Checkout session with metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`, // ✅ Works both locally and on Vercel
      cancel_url: `${baseUrl}/checkout`, // User will return here if they cancel
      customer_email: orderData.customer.email,
      line_items: orderData.products.map((product: any) => ({
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: product.price * 100, // Convert to cents
        },
        quantity: product.qty,
      })),
      metadata: { orderId }, // Add order ID metadata
    });

    console.log("✅ Stripe session created:", session.id);

    // ✅ Save Stripe Payment in Sanity
    const stripePayment = await client.create({
      _type: "stripePayment",
      orderId,
      paymentIntentId: session.id,
      paymentStatus: "pending",
      paymentMethod: "Stripe",
      amountPaid: orderData.totalPrice,
      currency: "usd",
      paymentDate: new Date().toISOString(),
    });

    console.log("✅ Stripe payment stored in Sanity:", stripePayment);

    // ✅ Save Order in Sanity
    const newOrder = await client.create({
      _type: "order",
      orderId,
      customer: orderData.customer,
      products: orderData.products,
      totalPrice: orderData.totalPrice,
      orderStatus: "Pending",
      createdAt: new Date().toISOString(),
      stripePayment: {
        _type: "reference",
        _ref: stripePayment._id, // Reference to Stripe payment document
      },
    });

    console.log("✅ Order created successfully in Sanity:", newOrder);

    // ✅ Return Stripe checkout session URL
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("❌ Checkout processing error:", error.message || error);
    return NextResponse.json({ error: "Failed to process checkout", details: error.message }, { status: 500 });
  }
}
