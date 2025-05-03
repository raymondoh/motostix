"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeCardElement } from "@stripe/stripe-js";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { createPaymentIntent } from "@/actions/ecommerce/create-payment-intent";
import { createOrderAction } from "@/actions/orders/create-order";

import type { CartItem } from "@/contexts/CartContext";
import type { ShippingFormValues } from "@/schemas/ecommerce/stripe";
import { getCurrencyCode } from "@/lib/utils";

// Load Stripe outside the component to avoid recreating on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  shippingDetails: ShippingFormValues; // Updated to use ShippingFormValues
  items: CartItem[];
  onSuccess: (orderId: string) => void;
}

function PaymentFormContent({ amount, shippingDetails, items, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  const getBillingAddress = () => ({
    name: shippingDetails.fullName,
    email: shippingDetails.email,
    phone: shippingDetails.phone,
    address: {
      line1: shippingDetails.address,
      city: shippingDetails.city,
      state: shippingDetails.state ?? "", // state is now required by ShippingFormValues
      postal_code: shippingDetails.zipCode,
      country: shippingDetails.country
    }
  });

  const mapCartItemsToOrderItems = () =>
    items.map(item => ({
      productId: item.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!stripe || !elements) return;

  //   setProcessing(true);
  //   setError(null);

  //   try {
  //     // Ensure that the amount is rounded to the nearest integer (pence)
  //     const amountInPence = Math.round(amount * 100);

  //     // Create payment intent
  //     const result = await createPaymentIntent({
  //       amount: amountInPence,
  //       shipping: { ...shippingDetails, state: shippingDetails.state ?? "" },
  //       return_url: `${window.location.origin}/checkout/success` // Stripe will redirect here after success
  //     });

  //     if (!("clientSecret" in result)) {
  //       throw new Error(result.error || "Failed to create payment intent");
  //     }

  //     // Get the card element
  //     const cardElement = elements.getElement(CardElement);
  //     if (!cardElement) throw new Error("Card element not found");

  //     // Confirm the payment with Stripe
  //     const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret, {
  //       payment_method: {
  //         card: cardElement as StripeCardElement,
  //         billing_details: getBillingAddress()
  //       }
  //     });

  //     // If payment failed, show an error
  //     if (paymentError) {
  //       setError(paymentError.message || "Payment failed");
  //       return;
  //     }

  //     // If payment was successful, proceed to create the order
  //     if (paymentIntent.status === "succeeded") {
  //       const orderResult = await createOrderAction({
  //         paymentIntentId: paymentIntent.id,
  //         amount,
  //         customerEmail: shippingDetails.email,
  //         customerName: shippingDetails.fullName,
  //         items: mapCartItemsToOrderItems(),
  //         shippingAddress: {
  //           address: shippingDetails.address,
  //           city: shippingDetails.city,
  //           state: shippingDetails.state ?? "",
  //           zipCode: shippingDetails.zipCode,
  //           country: shippingDetails.country
  //         },
  //         status: "processing"
  //       });

  //       if (orderResult.success && orderResult.orderId) {
  //         // Trigger page redirect after order is successfully created
  //         onSuccess(orderResult.orderId);
  //         router.push(`/checkout/success?orderId=${orderResult.orderId}`);
  //       } else {
  //         throw new Error(orderResult.error || "Failed to create order");
  //       }
  //     }
  //   } catch (err: unknown) {
  //     const errorMessage = err instanceof Error ? err.message : "Unexpected error";
  //     setError(errorMessage);
  //   } finally {
  //     setProcessing(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      // Round the amount after multiplying by 100 (to convert pounds to pence)
      const amountInPence = Math.round(amount * 100);

      const result = await createPaymentIntent({
        amount: amountInPence, // Pass the rounded amount in pence
        shipping: { ...shippingDetails, state: shippingDetails.state ?? "" },
        return_url: `${window.location.origin}/checkout/success`
      });

      if (!("clientSecret" in result)) {
        throw new Error(result.error || "Failed to create payment intent");
      }

      // Get the card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      // Confirm the payment with Stripe
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret, {
        payment_method: {
          card: cardElement as StripeCardElement,
          billing_details: getBillingAddress()
        }
      });

      if (paymentError) {
        console.error("Payment error:", paymentError); // Log the error for debugging
        setError(paymentError.message || "Payment failed");
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const orderResult = await createOrderAction({
          paymentIntentId: paymentIntent.id,
          amount,
          customerEmail: shippingDetails.email,
          customerName: shippingDetails.fullName,
          items: mapCartItemsToOrderItems(),
          shippingAddress: {
            address: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state ?? "",
            zipCode: shippingDetails.zipCode,
            country: shippingDetails.country
          },
          status: "processing"
        });

        if (orderResult.success && orderResult.orderId) {
          console.log(`Redirecting to /checkout/success?orderId=${orderResult.orderId}`);
          onSuccess(orderResult.orderId); // Ensure the order ID is passed correctly
          setTimeout(() => {
            router.push(`/checkout/success?orderId=${orderResult.orderId}`);
          }, 500); // Use a slight delay to ensure everything is settled before redirecting
        } else {
          throw new Error(orderResult.error || "Failed to create order");
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unexpected error";
      setError(errorMessage);
      console.error("Unexpected error:", err); // Log the unexpected error for debugging
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
                "::placeholder": { color: "#aab7c4" }
              },
              invalid: { color: "#9e2146" }
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
              currency: getCurrencyCode(shippingDetails.country)
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
