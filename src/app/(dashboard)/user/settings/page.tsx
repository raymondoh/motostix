import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { DashboardShell, DashboardHeader } from "@/components";
import { ChangePasswordForm } from "@/components/dashboard/user/settings/ChangePasswordForm";
import { NotificationForm } from "@/components/dashboard/user/settings/NotificationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function UserSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <DashboardShell>
      {/* <DashboardHeader title="Settings" description="Manage your account settings and security preferences" /> */}
      <DashboardHeader
        title="Settings"
        description="Manage your account settings and security preferences"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/user" }, { label: "Settings" }]}
      />
      <Separator className="mb-8" />

      <div className="w-full max-w-4xl overflow-hidden">
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="mb-8 w-full sm:w-auto">
            <TabsTrigger value="security" className="flex-1 sm:flex-initial px-5">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 sm:flex-initial px-5">
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="space-y-6">
            <div className="profile-form-container">
              <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
              <p className="text-muted-foreground mb-6">Update your password and security preferences.</p>
              <ChangePasswordForm />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="profile-form-container">
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <p className="text-muted-foreground mb-6">Control which emails you receive from us.</p>
              <NotificationForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
