//src/components/checkout/payment-form.tsx
"use client";

import type React from "react";

import { useState } from "react";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createPaymentIntent } from "@/actions/orders/stripe";
import { createOrderAction } from "@/actions/orders/create-order";

import type { CartItem } from "@/contexts/CartContext";

// Load Stripe outside of component to avoid recreating it on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  shippingDetails: any;
  items: CartItem[];
  onSuccess: (orderId: string) => void;
}

function PaymentFormContent({ amount, shippingDetails, items, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent on the server
      const { clientSecret } = await createPaymentIntent({
        amount: Math.round(amount * 100), // Convert to cents
        shipping: shippingDetails
      });

      // Confirm the payment with Stripe.js
      const cardElement = elements.getElement(CardElement);

      if (!clientSecret) {
        throw new Error("Missing client secret from payment intent");
      }

      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingDetails.fullName,
            email: shippingDetails.email,
            phone: shippingDetails.phone,
            address: {
              line1: shippingDetails.address,
              city: shippingDetails.city,
              state: shippingDetails.state,
              postal_code: shippingDetails.zipCode,
              country: shippingDetails.country
            }
          }
        }
      });

      if (paymentError) {
        setError(paymentError.message || "An error occurred with your payment");
      } else if (paymentIntent.status === "succeeded") {
        // Payment successful - create order directly here
        const orderItems = items.map(item => ({
          productId: item.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        }));

        const orderResult = await createOrderAction({
          paymentIntentId: paymentIntent.id,
          amount: amount,
          customerEmail: shippingDetails.email,
          customerName: shippingDetails.fullName,
          items: orderItems,
          shippingAddress: {
            address: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state,
            zipCode: shippingDetails.zipCode,
            country: shippingDetails.country
          },
          status: "processing"
        });

        if (orderResult.success) {
          onSuccess(orderResult.orderId);
        } else {
          throw new Error("Failed to create order");
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md border p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4"
                }
              },
              invalid: {
                color: "#9e2146"
              }
            }
          }}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={!stripe || processing}>
        {processing
          ? "Processing..."
          : `Pay ${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD"
            }).format(amount)}`}
      </Button>
    </form>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  );
}
