"use client";

import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { BreadcrumbCollapsed } from "@/components/Breadcrupm";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  phoneNumber: z.string().regex(/^\d{10,}$/, "Phone number must be at least 10 digits"),
});

type FormData = z.infer<typeof formSchema>;
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

function Checkout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartArray = useSelector((state: { cart: any[] }) => state.cart);

  const total = cartArray.reduce((sum, item) => {
    const discountedPrice =
      item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price;
    return sum + discountedPrice * item.qty;
  }, 0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", shippingAddress: "", phoneNumber: "" },
  });

  const notifySuccess = (message: string) =>
    toast.success(message, { position: "bottom-right", autoClose: 5000, transition: Bounce });

  const notifyError = (error: string) =>
    toast.error(error, { position: "bottom-right", autoClose: 5000, transition: Bounce });

  async function onSubmit(values: FormData) {
    try {
      const orderData = {
        customer: values,
        products: cartArray,
        totalPrice: total,
        orderStatus: "Pending",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderData }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to place order");

      notifySuccess("🎉 Order placed successfully! Redirecting to Stripe...");
      router.push(result.url); // ✅ Use Next.js router for redirection

    } catch (error: any) {
      notifyError(error.message);
    }
  }

  return (
    <main className="mt-28 lg:mt-36">
      <BreadcrumbCollapsed />
      <div className="flex flex-col md:flex-row space-y-5 sm:space-y-0 p-5 justify-center items-start lg:space-x-6">
        {cartArray.length > 0 && (
          <div className="w-full lg:w-[600px] space-y-4 border rounded-[20px] pt-2">
            <h1 className="text-2xl font-bold px-5">Order Summary</h1>
            {cartArray.map((item, index) => (
              <div key={index} className="flex justify-between items-start px-5">
                <div className="flex items-start space-x-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-[80px]"
                    width={100}
                    height={100}
                  />
                  <h1 className="sm:font-bold text-sm md:text-xl mt-3">{item.name}</h1>
                </div>
                <p className="font-bold mt-3">${item.price}</p>
              </div>
            ))}
            <div className="flex w-full justify-between p-5">
              <h1 className="font-bold">Total</h1>
              <h1 className="font-bold">${total}</h1>
            </div>
          </div>
        )}

        <div className="rounded-[20px] border p-5 w-full lg:w-[50%]">
          <h1 className="text-2xl font-bold mb-4">Shipping Details</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="shippingAddress" render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button className="w-full" type="submit">Place Order</Button>
            </form>
          </Form>
          <ToastContainer />
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return <Elements stripe={stripePromise}><Checkout /></Elements>;
}
