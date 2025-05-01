// "use client";

// import { formatDate } from "@/utils/date";
// import { formatPriceWithCode } from "@/lib/utils";
// import type { Order } from "@/types/order";
// import { Separator } from "@/components/ui/separator";

// interface AdminOrderDetailCardProps {
//   order: Order;
// }

// export function AdminOrderDetailCard({ order }: AdminOrderDetailCardProps) {
//   return (
//     <div className="space-y-6 text-sm">
//       <div className="space-y-2">
//         <div className="flex justify-between">
//           <span className="font-medium text-muted-foreground">Date:</span>
//           <span>{order.createdAt ? formatDate(order.createdAt) : "-"}</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="font-medium text-muted-foreground">Customer:</span>
//           <span>
//             {order.customerName} ({order.customerEmail})
//           </span>
//         </div>

//         <div className="flex justify-between">
//           <span className="font-medium text-muted-foreground">Total:</span>
//           <span>{formatPriceWithCode(order.amount, "GB")}</span>
//         </div>

//         <div className="flex justify-between">
//           <span className="font-medium text-muted-foreground">Status:</span>
//           <span className="capitalize">{order.status}</span>
//         </div>
//       </div>

//       <Separator />

//       <div>
//         <h3 className="font-semibold mb-2">Items Ordered</h3>
//         <ul className="list-disc ml-5 space-y-1 text-muted-foreground text-sm">
//           {order.items.map((item, i) => (
//             <li key={i}>
//               {item.quantity} × {item.name} @ {formatPriceWithCode(item.price, "GB")}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <Separator />

//       <div>
//         <h3 className="font-semibold mb-2">Shipping Address</h3>
//         <div className="space-y-0.5 text-muted-foreground text-sm">
//           <p>{order.shippingAddress.address}</p>
//           <p>
//             {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
//           </p>
//           <p>{order.shippingAddress.country}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { formatDate } from "@/utils/date";
import { formatPriceWithCode } from "@/lib/utils";
import { TAX_RATE, SHIPPING_CONFIG } from "@/config/checkout";
import type { Order } from "@/types/order";
import { Separator } from "@/components/ui/separator";

interface AdminOrderDetailCardProps {
  order: Order;
}

export function AdminOrderDetailCard({ order }: AdminOrderDetailCardProps) {
  const subtotal = order.amount;
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal > SHIPPING_CONFIG.freeShippingThreshold ? 0 : SHIPPING_CONFIG.flatRate;
  const total = subtotal + tax + shipping;

  return (
    <div className="space-y-6 text-sm">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Date:</span>
          <span>{order.createdAt ? formatDate(order.createdAt) : "-"}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-muted-foreground">Customer:</span>
          <span>
            {order.customerName} ({order.customerEmail})
          </span>
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
          <span>Total:</span>
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
    </div>
  );
}
