// import { Separator } from "@/components/ui/separator";
// import { DashboardShell, DashboardHeader } from "@/components";
// import { UserActivityPreview } from "@/components";
// import { UserAccountPreview } from "@/components/dashboard/user/overview/UserAccountPreview";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { adminDb } from "@/firebase/admin/firebase-admin-init";
// import { parseServerDate } from "@/utils/date-server";
// import type { User, SerializedUser } from "@/types/user";
// import { serializeUser } from "@/utils/serializeUser";
// import { fetchActivityLogs } from "@/actions/dashboard/activity-logs";

// export default async function UserDashboardOverviewPage() {
//   const session = await auth();

//   if (!session?.user) {
//     redirect("/login");
//   }

//   const userId = session.user.id;
//   const sessionUser = session.user as User;

//   // fetch activity logs
//   const result = await fetchActivityLogs({ limit: 5 });
//   const logs = result.success && Array.isArray(result.activities) ? result.activities : [];

//   // Start with session values and fallback structure
//   let userData: User = {
//     id: userId,
//     name: sessionUser.name ?? "",
//     email: sessionUser.email ?? "",
//     image: sessionUser.image ?? "",
//     role: sessionUser.role,
//     emailVerified: sessionUser.emailVerified ?? false,
//     hasPassword: false,
//     has2FA: false,
//     createdAt: new Date(),
//     lastLoginAt: new Date(),
//     updatedAt: new Date()
//   };

//   try {
//     const doc = await adminDb.collection("users").doc(userId).get();

//     if (doc.exists) {
//       const firestoreData = doc.data() as Partial<User>;

//       userData = {
//         ...userData,
//         ...firestoreData,
//         createdAt: parseServerDate(firestoreData.createdAt) ?? new Date(),
//         lastLoginAt: parseServerDate(firestoreData.lastLoginAt) ?? new Date(),
//         updatedAt: parseServerDate(firestoreData.updatedAt) ?? new Date(),
//         hasPassword: !!firestoreData.passwordHash || firestoreData.provider !== "google",
//         has2FA: firestoreData.has2FA ?? false
//       };
//     }
//   } catch (error) {
//     console.error("Error fetching Firestore user:", error);
//     // Continue with fallback session data
//   }

//   const serializedUserData: SerializedUser = serializeUser(userData);
//   const userName = serializedUserData.name || serializedUserData.email?.split("@")[0] || "User";

//   return (
//     <DashboardShell>
//       <DashboardHeader heading="Dashboard" text={`Welcome back, ${userName}! Here's an overview of your account.`} />
//       <Separator className="mb-8" />

//       {/* Updated layout with consistent width */}
//       <div className="w-full max-w-8xl mx-auto max-w-8xl flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-8">
//         {/* Account summary in its own container */}
//         <div className="w-full min-w-0 overflow-hidden">
//           <UserAccountPreview serializedUserData={serializedUserData} isLoading={!serializedUserData} />
//         </div>

//         {/* Activity preview in its own scrollable container */}
//         <div className="w-full min-w-0 overflow-hidden">
//           <UserActivityPreview
//             activities={logs}
//             limit={5}
//             showFilters={false}
//             showHeader={true}
//             showViewAll={true}
//             viewAllUrl="/user/activity"
//           />
//         </div>
//       </div>
//     </DashboardShell>
//   );
// }
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { adminDb } from "@/firebase/admin/firebase-admin-init";
import { parseServerDate } from "@/utils/date-server";
import type { User, SerializedUser } from "@/types/user";
import { serializeUser } from "@/utils/serializeUser";
import { fetchActivityLogs } from "@/actions/dashboard/activity-logs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { UserAccountPreview } from "@/components/dashboard/user/overview/UserAccountPreview";
import { UserActivityPreview } from "@/components";
import { Clock, UserIcon } from "lucide-react";

export default async function UserDashboardOverviewPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;
  const sessionUser = session.user as User;

  // fetch activity logs
  const result = await fetchActivityLogs({ limit: 5 });
  const logs = result.success && Array.isArray(result.activities) ? result.activities : [];

  // Start with session values and fallback structure
  let userData: User = {
    id: userId,
    name: sessionUser.name ?? "",
    email: sessionUser.email ?? "",
    image: sessionUser.image ?? "",
    role: sessionUser.role,
    emailVerified: sessionUser.emailVerified ?? false,
    hasPassword: false,
    has2FA: false,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    updatedAt: new Date()
  };

  try {
    const doc = await adminDb.collection("users").doc(userId).get();

    if (doc.exists) {
      const firestoreData = doc.data() as Partial<User>;

      userData = {
        ...userData,
        ...firestoreData,
        createdAt: parseServerDate(firestoreData.createdAt) ?? new Date(),
        lastLoginAt: parseServerDate(firestoreData.lastLoginAt) ?? new Date(),
        updatedAt: parseServerDate(firestoreData.updatedAt) ?? new Date(),
        hasPassword: !!firestoreData.passwordHash || firestoreData.provider !== "google",
        has2FA: firestoreData.has2FA ?? false
      };
    }
  } catch (error) {
    console.error("Error fetching Firestore user:", error);
    // Continue with fallback session data
  }

  const serializedUserData: SerializedUser = serializeUser(userData);
  const userName = serializedUserData.name || serializedUserData.email?.split("@")[0] || "User";

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description={`Welcome back, ${userName}! Here's an overview of your account.`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      />

      {/* Updated layout with consistent width */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account summary in a card */}
        <DashboardCard
          title="Account Summary"
          description="Your account information and status"
          icon={<UserIcon className="h-5 w-5" />}>
          <UserAccountPreview serializedUserData={serializedUserData} isLoading={!serializedUserData} />
        </DashboardCard>

        {/* Activity preview in a card */}
        <DashboardCard
          title="Recent Activity"
          description="Your latest account activities"
          icon={<Clock className="h-5 w-5" />}>
          <UserActivityPreview
            activities={logs}
            limit={5}
            showFilters={false}
            showHeader={false} // We're using the card header instead
            showViewAll={true}
            viewAllUrl="/user/activity"
          />
        </DashboardCard>
      </div>
    </>
  );
}
