// "use client";

// import { useRouter } from "next/navigation";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { formatDate } from "@/utils/date";
// import { formatPriceWithCode } from "@/lib/utils";
// import type { Order } from "@/types/order";
// import { TAX_RATE, SHIPPING_CONFIG } from "@/config/checkout";
// import { generateReceiptPdf } from "@/utils/generateReceiptPdf";
// interface UserOrderDetailCardProps {
//   order: Order;
// }

// export function UserOrderDetailCard({ order }: UserOrderDetailCardProps) {
//   const router = useRouter();

//   const tax = order.amount * TAX_RATE;
//   const shipping = order.amount > SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.flatRate;
//   const total = order.amount + tax + shipping;

//   function handleDownload(order: Order) {
//     generateReceiptPdf(order).catch(err => {
//       console.error("Failed to generate PDF:", err);
//     });
//   }

//   return (
//     <div className="space-y-6 text-sm">
//       <div className="space-y-2">
//         <div className="flex justify-between">
//           <span className="font-medium text-muted-foreground">Order ID:</span>
//           <span>{order.id}</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="font-medium text-muted-foreground">Date:</span>
//           <span>{order.createdAt ? formatDate(order.createdAt) : "-"}</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="font-medium text-muted-foreground">Status:</span>
//           <span className="capitalize">{order.status}</span>
//         </div>
//       </div>

//       <Separator />

//       <div>
//         <h3 className="font-semibold mb-2">Items Ordered</h3>
//         <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
//           {order.items.map((item, i) => (
//             <li key={i}>
//               {item.quantity} × {item.name} @ {formatPriceWithCode(item.price, "GB")}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <Separator />

//       <div className="space-y-2 text-sm">
//         <div className="flex justify-between">
//           <span className="text-muted-foreground">Subtotal:</span>
//           <span>{formatPriceWithCode(order.amount, "GB")}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-muted-foreground">Tax ({TAX_RATE * 100}%):</span>
//           <span>{formatPriceWithCode(tax, "GB")}</span>
//         </div>
//         <div className="flex justify-between">
//           <span className="text-muted-foreground">Shipping:</span>
//           <span>{formatPriceWithCode(shipping, "GB")}</span>
//         </div>
//         <Separator />
//         <div className="flex justify-between font-semibold">
//           <span>Total Paid:</span>
//           <span>{formatPriceWithCode(total, "GB")}</span>
//         </div>
//       </div>

//       <Separator />

//       <div>
//         <h3 className="font-semibold mb-2">Shipping Address</h3>
//         <div className="space-y-0.5 text-muted-foreground">
//           <p>{order.shippingAddress.address}</p>
//           <p>
//             {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
//           </p>
//           <p>{order.shippingAddress.country}</p>
//         </div>
//       </div>

//       <Separator />

//       <div className="pt-2 flex justify-end">
//         <Button onClick={() => router.push("/user/orders")}>Back to My Orders</Button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date";
import { formatPriceWithCode } from "@/lib/utils";
import { TAX_RATE, SHIPPING_CONFIG } from "@/config/checkout";
import type { Order } from "@/types/order";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { generateReceiptPdf } from "@/utils/generateReceiptPdf";

interface UserOrderDetailCardProps {
  order: Order;
}

export function UserOrderDetailCard({ order }: UserOrderDetailCardProps) {
  const router = useRouter();
  const subtotal = order.amount;
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.flatRate;
  const total = subtotal + tax + shipping;

  const shouldShowDownload = ["processing", "shipped", "delivered"].includes(order.status);

  return (
    <div className="space-y-6 text-sm">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Date:</span>
          <span>{order.createdAt ? formatDate(order.createdAt) : "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Order ID:</span>
          <span>{order.id}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Subtotal:</span>
          <span>{formatPriceWithCode(subtotal, "GB")}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Tax:</span>
          <span>{formatPriceWithCode(tax, "GB")}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Shipping:</span>
          <span>{shipping === 0 ? "Free" : formatPriceWithCode(shipping, "GB")}</span>
        </div>

        <Separator />

        <div className="flex justify-between font-medium text-base">
          <span>Total Paid:</span>
          <span>{formatPriceWithCode(total, "GB")}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Status:</span>
          <span className="capitalize">{order.status}</span>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Items Ordered</h3>
        <ul className="list-disc ml-5 space-y-1 text-muted-foreground text-sm">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.quantity} × {item.name} @ {formatPriceWithCode(item.price, "GB")}
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-2">Shipping Address</h3>
        <div className="space-y-0.5 text-muted-foreground text-sm">
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      <div className="flex justify-between pt-6 gap-4">
        <Button variant="outline" onClick={() => router.push("/user/orders")}>
          Back to Orders
        </Button>
        {shouldShowDownload && <Button onClick={() => generateReceiptPdf(order)}>Download Receipt</Button>}
      </div>
    </div>
  );
}
