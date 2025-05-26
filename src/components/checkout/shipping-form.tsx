// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { shippingSchema, type ShippingSchema } from "@/schemas/ecommerce/stripe";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { MapPin, Mail, Phone } from "lucide-react";

// interface ShippingFormProps {
//   onSubmit: (values: ShippingSchema) => void;
//   defaultValues?: Partial<ShippingSchema>;
// }

// export function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<ShippingSchema>({
//     resolver: zodResolver(shippingSchema),
//     defaultValues: {
//       fullName: defaultValues?.fullName ?? "",
//       email: defaultValues?.email ?? "",
//       phone: defaultValues?.phone ?? "",
//       address: defaultValues?.address ?? "",
//       city: defaultValues?.city ?? "",
//       state: defaultValues?.state ?? "",
//       zipCode: defaultValues?.zipCode ?? "",
//       country: defaultValues?.country ?? "GB"
//     }
//   });

//   const handleSubmit = async (values: ShippingSchema) => {
//     setIsSubmitting(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 500));
//       onSubmit(values);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
//         <div className="space-y-6">
//           <div className="flex items-center gap-2 pb-2 border-b border-border/40">
//             <MapPin className="h-5 w-5 text-muted-foreground" />
//             <h3 className="text-base font-medium">Contact Information</h3>
//           </div>

//           <div className="grid gap-6 sm:grid-cols-2">
//             <FormField
//               control={form.control}
//               name="fullName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base font-semibold uppercase tracking-wide">Full Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="e.g. John Smith"
//                       {...field}
//                       className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base font-semibold uppercase tracking-wide">Email</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Input
//                         type="email"
//                         placeholder="e.g. john@example.com"
//                         {...field}
//                         className="h-14 text-lg pl-10 pr-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//                       />
//                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={form.control}
//             name="phone"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-base font-semibold uppercase tracking-wide">Phone Number</FormLabel>
//                 <FormControl>
//                   <div className="relative">
//                     <Input
//                       type="tel"
//                       placeholder="e.g. +44 7123 456789"
//                       {...field}
//                       className="h-14 text-lg pl-10 pr-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//                     />
//                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="space-y-6">
//           <div className="flex items-center gap-2 pb-2 border-b border-border/40">
//             <MapPin className="h-5 w-5 text-muted-foreground" />
//             <h3 className="text-base font-medium">Shipping Address</h3>
//           </div>

//           <FormField
//             control={form.control}
//             name="address"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-base font-semibold uppercase tracking-wide">Address</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="e.g. 221B Baker Street, Flat 2A"
//                     {...field}
//                     className="min-h-[90px] text-base px-4 py-3 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="grid gap-6 sm:grid-cols-2">
//             <FormField
//               control={form.control}
//               name="city"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base font-semibold uppercase tracking-wide">City</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="e.g. London"
//                       {...field}
//                       className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="state"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base font-semibold uppercase tracking-wide">County / Region</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="e.g. Greater London"
//                       {...field}
//                       className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <div className="grid gap-6 sm:grid-cols-2">
//             <FormField
//               control={form.control}
//               name="zipCode"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base font-semibold uppercase tracking-wide">Postcode</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="e.g. SW1A 1AA"
//                       {...field}
//                       className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="country"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-base font-semibold uppercase tracking-wide">Country</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary">
//                         <SelectValue placeholder="Select a country" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="GB">United Kingdom</SelectItem>
//                       <SelectItem value="US">United States</SelectItem>
//                       <SelectItem value="CA">Canada</SelectItem>
//                       <SelectItem value="AU">Australia</SelectItem>
//                       <SelectItem value="IE">Ireland</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>

//         <Button type="submit" className="w-full h-14 text-lg font-bold" disabled={isSubmitting}>
//           {isSubmitting ? "Processing..." : "Continue to Payment"}
//         </Button>
//       </form>
//     </Form>
//   );
// }
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingSchema, type ShippingSchema } from "@/schemas/ecommerce/stripe";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UniversalInput } from "@/components/forms/UniversalInput";
import { UniversalTextarea } from "@/components/forms/UniversalTextarea";
import { UniversalSelect } from "@/components/forms/UniversalSelect";
import { UniversalButton } from "@/components/forms/UniversalButton";
import { MapPin, Mail, Phone } from "lucide-react";

interface ShippingFormProps {
  onSubmit: (values: ShippingSchema) => void;
  defaultValues?: Partial<ShippingSchema>;
}

const countryOptions = [
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "IE", label: "Ireland" }
];

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
      await new Promise(resolve => setTimeout(resolve, 500));
      onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-medium">Contact Information</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <UniversalInput
                      id="fullName"
                      label="Full Name"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. John Smith"
                      required
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <UniversalInput
                        id="email"
                        label="Email"
                        type="email"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="e.g. john@example.com"
                        required
                        error={fieldState.error?.message}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-[42px] h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <UniversalInput
                      id="phone"
                      label="Phone Number"
                      type="tel"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. +44 7123 456789"
                      required
                      error={fieldState.error?.message}
                      className="pl-10"
                    />
                    <Phone className="absolute left-3 top-[42px] h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-border/40">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-medium">Shipping Address</h3>
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <UniversalTextarea
                    id="address"
                    label="Address"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="e.g. 221B Baker Street, Flat 2A"
                    required
                    error={fieldState.error?.message}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <UniversalInput
                      id="city"
                      label="City"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. London"
                      required
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <UniversalInput
                      id="state"
                      label="County / Region"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. Greater London"
                      error={fieldState.error?.message}
                    />
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
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <UniversalInput
                      id="zipCode"
                      label="Postcode"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="e.g. SW1A 1AA"
                      required
                      error={fieldState.error?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <UniversalSelect
                      id="country"
                      label="Country"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select a country"
                      required
                      error={fieldState.error?.message}
                      options={countryOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <UniversalButton type="submit" loading={isSubmitting} className="w-full h-14 text-lg font-bold">
          Continue to Payment
        </UniversalButton>
      </form>
    </Form>
  );
}
