import { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardShell, DashboardHeader } from "@/components";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { UserLikesClient } from "@/components/dashboard/user/likes/UserLikesClient";

export const metadata: Metadata = {
  title: "Your Likes | MotorStix",
  description: "View all your liked products"
};

export default async function UserLikesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="My Likes" text="View the products you liked." />
      <Separator className="mb-8" />
      <div className="w-full overflow-hidden">
        <UserLikesClient />
      </div>
    </DashboardShell>
  );
}
