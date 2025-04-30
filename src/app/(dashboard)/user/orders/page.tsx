// import { Metadata } from "next";
// import { UserOrdersClient } from "@/components/dashboard/user/orders/UserOrdersClient";

// export const metadata: Metadata = {
//   title: "Your Orders | MotorStix",
//   description: "View all your past orders"
// };

// export default function UserOrdersPage() {
//   return (
//     <div className="container py-10">
//       <UserOrdersClient />
//     </div>
//   );
// }
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserOrdersClient } from "@/components/dashboard/user/orders/UserOrdersClient";

export const metadata: Metadata = {
  title: "Your Orders | MotorStix",
  description: "View all your past orders"
};

export default async function UserOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container py-10">
      <UserOrdersClient />
    </div>
  );
}
