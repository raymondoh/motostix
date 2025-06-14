"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { shippingSchema, type ShippingFormValues } from "@/schemas/ecommerce/stripe";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { TAX_RATE, SHIPPING_CONFIG, DEFAULT_CURRENCY } from "@/config/checkout";
import { CheckoutSummary } from "./checkout-summary";
import { formatPrice } from "@/lib/utils";

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    }
  });

  useEffect(() => {
    if (session?.user) {
      if (session.user.displayName || session.user.name) {
        form.setValue("fullName", session.user.displayName || session.user.name || "");
      }
      if (session.user.email) {
        form.setValue("email", session.user.email);
      }
      const phone = (session.user as any).phone;
      if (phone) {
        form.setValue("phone", phone);
      }
    }
  }, [session, form]);

  const tax = subtotal * TAX_RATE;
  const shippingCost = subtotal > SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.flatRate;
  const total = subtotal + tax + shippingCost;

  async function onSubmit(values: ShippingFormValues) {
    if (!stripe || !elements) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100), shipping: values })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment.");
      const { error } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
          billing_details: {
            name: values.fullName,
            email: values.email,
            phone: values.phone,
            address: {
              line1: values.address,
              city: values.city,
              state: values.state,
              postal_code: values.zipCode,
              country: values.country
            }
          }
        },
        shipping: {
          name: values.fullName,
          phone: values.phone,
          address: {
            line1: values.address,
            city: values.city,
            state: values.state,
            postal_code: values.zipCode,
            country: values.country
          }
        }
      });
      if (error) throw error;
      clearCart();
      window.location.href = "/checkout/success";
    } catch (err: any) {
      toast.error(err.message || "Payment failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return <p className="text-center">Your cart is empty.</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input className="bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input className="bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input className="bg-background" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input className="bg-background" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4 space-y-4">
              <CardNumberElement options={{ style: { base: { fontSize: '16px' } } }} />
              <div className="grid grid-cols-2 gap-4">
                <CardExpiryElement options={{ style: { base: { fontSize: '16px' } } }} />
                <CardCvcElement options={{ style: { base: { fontSize: '16px' } } }} />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting || !stripe} className="w-full">
              {isSubmitting ? "Processing..." : `Pay ${formatPrice(total, DEFAULT_CURRENCY)}`}
            </Button>
          </form>
        </Form>
        <CheckoutSummary subtotal={subtotal} tax={tax} shipping={shippingCost} total={total} />
      </div>
    </div>
  );
}
