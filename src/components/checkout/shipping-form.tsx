// src/components/checkout/shipping-form.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingSchema, type ShippingSchema } from "@/schemas/ecommerce/stripe";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ShippingFormProps {
  onSubmit: (values: ShippingSchema) => void;
  defaultValues?: Partial<ShippingSchema>;
}

export function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ShippingSchema>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      address: defaultValues?.address ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "",
      zipCode: defaultValues?.zipCode ?? "",
      country: defaultValues?.country ?? "GB"
    }
  });

  const handleSubmit = async (values: ShippingSchema) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
      onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold uppercase tracking-wide">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Smith" {...field} className="h-14 text-lg px-4" />
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
                <FormLabel className="text-base font-semibold uppercase tracking-wide">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g. john@example.com" {...field} className="h-14 text-lg px-4" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold uppercase tracking-wide">Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="e.g. +44 7123 456789" {...field} className="h-14 text-lg px-4" />
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
              <FormLabel className="text-base font-semibold uppercase tracking-wide">Address</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. 221B Baker Street, Flat 2A" {...field} className="text-lg px-4 py-3" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold uppercase tracking-wide">City</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. London" {...field} className="h-14 text-lg px-4" />
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
                <FormLabel className="text-base font-semibold uppercase tracking-wide">County / Region</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Greater London" {...field} className="h-14 text-lg px-4" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold uppercase tracking-wide">Postcode</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. SW1A 1AA" {...field} className="h-14 text-lg px-4" />
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
                <FormLabel className="text-base font-semibold uppercase tracking-wide">Country</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-14 text-lg px-4">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                    <SelectItem value="IE">Ireland</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full h-14 text-lg font-bold tracking-wide uppercase" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Continue to Payment"}
        </Button>
      </form>
    </Form>
  );
}
