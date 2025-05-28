// // src/components/dashboard/admin/users/UsersClient.tsx
// "use client";

// import * as React from "react";
// import { useState, useTransition } from "react";

// import type { SerializedUser } from "@/types/user/common";
// import { getUserColumns } from "./users-columns"; // Assuming getUserColumns is updated to accept onRefreshData
// import { fetchAllUsersClient } from "@/actions/client/users";
// import { UsersDataTable } from "./UsersDataTable";

// interface UsersClientProps {
//   users: SerializedUser[];
// }

// export function UsersClient({ users: initialUsers }: UsersClientProps) {
//   const [users, setUsers] = useState<SerializedUser[]>(initialUsers);
//   const [isPending, startTransition] = useTransition();

//   /**
//    * Fetches the latest user list from the server and updates the local state.
//    * This function is passed down to trigger data refresh after actions like delete or edit,
//    * and also used by the global refresh button.
//    */
//   const handleRefresh = () => {
//     console.log("🔄 handleRefresh triggered: Requesting fresh user data...");
//     startTransition(async () => {
//       try {
//         const freshUsers = await fetchAllUsersClient();
//         console.log("✅ Refreshed users:", freshUsers);
//         setUsers(freshUsers);
//       } catch (err) {
//         console.error("❌ Error refreshing users:", err);
//         // Optionally, show a toast notification to the user about the failed refresh
//         // import { toast } from "sonner";
//         // toast.error("Failed to refresh user list.");
//       }
//     });
//   };

//   return (
//     <UsersDataTable
//       data={users}
//       // Pass the handleRefresh function down to the column definitions
//       // Renamed prop to 'onRefreshData' for clarity, indicating its purpose.
//       // getUserColumns, UserRowActions, AdminUserEditDialog, and AdminUserDeleteDialog
//       // need to be updated accordingly to receive and propagate this prop correctly.
//       columns={getUserColumns({
//         onView: id => {
//           // Standard navigation for viewing user details
//           window.location.href = `/admin/users/${id}`;
//         },
//         // This prop should be passed down through getUserColumns -> UserRowActions
//         // and eventually called by AdminUserDeleteDialog and AdminUserEditDialog
//         // upon successful completion of their respective actions.
//         onRefreshData: handleRefresh
//       })}
//       // Pass handleRefresh specifically for the global refresh button within UsersDataTable
//       onRefresh={handleRefresh}
//       // Indicate loading state to the DataTable if needed (optional)
//       // isLoading={isPending}
//     />
//   );
// }
// src/components/dashboard/admin/users/UsersClient.tsx
"use client";

import * as React from "react"; // Recommended for broader type compatibility
import { useState, useTransition } from "react";

import type { SerializedUser } from "@/types/user/common";
import { getUserColumns } from "./users-columns";
import { fetchAllUsersClient } from "@/actions/client/users"; // Ensure this returns SerializedUser[]
import { UsersDataTable } from "./UsersDataTable"; // Use the refactored version
import { toast } from "sonner"; // For error notifications

interface UsersClientProps {
  users: SerializedUser[];
}

export function UsersClient({ users: initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<SerializedUser[]>(initialUsers);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        // Assuming fetchAllUsersClient directly returns SerializedUser[]
        // or an object like { success: boolean, data: SerializedUser[] }
        const result = await fetchAllUsersClient();
        if (Array.isArray(result)) {
          setUsers(result);
        } else if (result && typeof result === "object" && "data" in result && Array.isArray(result.data)) {
          // Handle cases where the action might return an object with a data property
          setUsers(result.data as SerializedUser[]);
        } else {
          // Fallback if the structure is unexpected, but ideally, align fetchAllUsersClient
          // For example, if it returns { success: true, users: [] }
          const usersData = (result as any).users || (result as any).data || [];
          setUsers(usersData);
          if (!(result as any).success && (result as any).error) {
            toast.error(`Failed to refresh user list: ${(result as any).error}`);
          }
        }
      } catch (err) {
        console.error("Error refreshing users:", err);
        toast.error("Failed to refresh user list due to an unexpected error.");
      }
    });
  };

  // The columns definition now correctly receives onRefreshData
  const columns = getUserColumns({
    onView: id => {
      // For client-side navigation if not handled by Link in actions
      // router.push(`/admin/users/${id}`); // if useRouter is setup
      window.location.href = `/admin/users/${id}`; // Simple redirect
    },
    onRefreshData: handleRefresh
  });

  return (
    <UsersDataTable
      data={users}
      columns={columns}
      onRefresh={handleRefresh} // For the toolbar's global refresh button
    />
  );
}
