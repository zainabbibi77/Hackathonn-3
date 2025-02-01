import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Debug: Log incoming request data
    console.log("Received order data:", body);

    // ✅ Validate required fields before inserting into Sanity
    if (!body.customer || !body.products || !body.totalPrice || !body.paymentIntentId) {
      console.error("❌ Missing required fields:", body);
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Save Stripe Payment in Sanity first
    const stripePayment = await client.create({
      _type: "stripePayment",
      orderId: `ORD-${Date.now()}`, // Unique order ID
      paymentIntentId: body.paymentIntentId,
      paymentStatus: body.paymentStatus || "pending",
      paymentMethod: body.paymentMethod || "Stripe",
      amountPaid: body.totalPrice,
      currency: "usd",
      paymentDate: new Date().toISOString(),
    });

    console.log("✅ Stripe payment stored:", stripePayment);

    // ✅ Create the order in Sanity
    const newOrder = await client.create({
      _type: "order",
      orderId: stripePayment.orderId, // Link with Stripe payment order ID
      customer: body.customer,
      products: body.products,
      totalPrice: body.totalPrice,
      orderStatus: "Pending",
      createdAt: new Date().toISOString(),
      stripePayment: {
        _type: "reference",
        _ref: stripePayment._id, // Reference to Stripe payment document
      },
    });

    console.log("✅ Order created successfully:", newOrder);
    return NextResponse.json({ success: true, order: newOrder }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Sanity order creation error:", error.message || error);
    return NextResponse.json({ error: "Failed to submit order", details: error.message }, { status: 500 });
  }
}
