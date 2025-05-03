// src/components/dashboard/admin/users/UsersClient.tsx
"use client";

import * as React from "react";
import { useState, useTransition } from "react";

import type { SerializedUser } from "@/types/user/common";
import { getUserColumns } from "./users-columns"; // Assuming getUserColumns is updated to accept onRefreshData
import { fetchAllUsersClient } from "@/actions/client/users";
import { UsersDataTable } from "./UsersDataTable";

interface UsersClientProps {
  users: SerializedUser[];
}

export function UsersClient({ users: initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<SerializedUser[]>(initialUsers);
  const [isPending, startTransition] = useTransition();

  /**
   * Fetches the latest user list from the server and updates the local state.
   * This function is passed down to trigger data refresh after actions like delete or edit,
   * and also used by the global refresh button.
   */
  const handleRefresh = () => {
    console.log("🔄 handleRefresh triggered: Requesting fresh user data...");
    startTransition(async () => {
      try {
        const freshUsers = await fetchAllUsersClient();
        console.log("✅ Refreshed users:", freshUsers);
        setUsers(freshUsers);
      } catch (err) {
        console.error("❌ Error refreshing users:", err);
        // Optionally, show a toast notification to the user about the failed refresh
        // import { toast } from "sonner";
        // toast.error("Failed to refresh user list.");
      }
    });
  };

  return (
    <UsersDataTable
      data={users}
      // Pass the handleRefresh function down to the column definitions
      // Renamed prop to 'onRefreshData' for clarity, indicating its purpose.
      // getUserColumns, UserRowActions, AdminUserEditDialog, and AdminUserDeleteDialog
      // need to be updated accordingly to receive and propagate this prop correctly.
      columns={getUserColumns({
        onView: id => {
          // Standard navigation for viewing user details
          window.location.href = `/admin/users/${id}`;
        },
        // This prop should be passed down through getUserColumns -> UserRowActions
        // and eventually called by AdminUserDeleteDialog and AdminUserEditDialog
        // upon successful completion of their respective actions.
        onRefreshData: handleRefresh
      })}
      // Pass handleRefresh specifically for the global refresh button within UsersDataTable
      onRefresh={handleRefresh}
      // Indicate loading state to the DataTable if needed (optional)
      // isLoading={isPending}
    />
  );
}
