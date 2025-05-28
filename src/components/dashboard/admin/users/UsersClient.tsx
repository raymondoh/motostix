// "use client";

// import * as React from "react"; // Recommended for broader type compatibility
// import { useState, useTransition } from "react";

// import type { SerializedUser } from "@/types/user/common";
// import { getUserColumns } from "./users-columns";
// import { fetchAllUsersClient } from "@/actions/client/users"; // Ensure this returns SerializedUser[]
// import { UsersDataTable } from "./UsersDataTable"; // Use the refactored version
// import { toast } from "sonner"; // For error notifications

// interface UsersClientProps {
//   users: SerializedUser[];
// }

// export function UsersClient({ users: initialUsers }: UsersClientProps) {
//   const [users, setUsers] = useState<SerializedUser[]>(initialUsers);
//   const [isPending, startTransition] = useTransition();

//   const handleRefresh = () => {
//     startTransition(async () => {
//       try {
//         // Assuming fetchAllUsersClient directly returns SerializedUser[]
//         // or an object like { success: boolean, data: SerializedUser[] }
//         const result = await fetchAllUsersClient();
//         if (Array.isArray(result)) {
//           setUsers(result);
//         } else if (result && typeof result === "object" && "data" in result && Array.isArray(result.data)) {
//           // Handle cases where the action might return an object with a data property
//           setUsers(result.data as SerializedUser[]);
//         } else {
//           // Fallback if the structure is unexpected, but ideally, align fetchAllUsersClient
//           // For example, if it returns { success: true, users: [] }
//           const usersData = (result as any).users || (result as any).data || [];
//           setUsers(usersData);
//           if (!(result as any).success && (result as any).error) {
//             toast.error(`Failed to refresh user list: ${(result as any).error}`);
//           }
//         }
//       } catch (err) {
//         console.error("Error refreshing users:", err);
//         toast.error("Failed to refresh user list due to an unexpected error.");
//       }
//     });
//   };

//   // The columns definition now correctly receives onRefreshData
//   const columns = getUserColumns({
//     onView: id => {
//       // For client-side navigation if not handled by Link in actions
//       // router.push(`/admin/users/${id}`); // if useRouter is setup
//       window.location.href = `/admin/users/${id}`; // Simple redirect
//     },
//     onRefreshData: handleRefresh
//   });

//   return (
//     <UsersDataTable
//       data={users}
//       columns={columns}
//       onRefresh={handleRefresh} // For the toolbar's global refresh button
//     />
//   );
// }
// src/components/dashboard/admin/users/UsersClient.tsx
"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { toast } from "sonner"; // Assuming you use sonner for toasts

import type { SerializedUser } from "@/types/user/common";
import { getUserColumns } from "./users-columns";
import { fetchAllUsersClient } from "@/actions/client/users";
import { UsersDataTable } from "./UsersDataTable";

interface UsersClientProps {
  users: SerializedUser[];
}

export function UsersClient({ users: initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState<SerializedUser[]>(initialUsers);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const apiResult = await fetchAllUsersClient(); // Renamed to avoid conflict with 'result' keyword if any

        if (Array.isArray(apiResult)) {
          setUsers(apiResult);
        } else if (apiResult && typeof apiResult === "object" && apiResult !== null) {
          // apiResult is now confirmed to be a non-null object.
          // Explicitly type what we expect the object might look like to help TypeScript.
          const resultObject = apiResult as {
            data?: unknown;
            users?: unknown;
            error?: string;
            success?: boolean; // Assuming your API might return a success flag
          };

          if (resultObject.data && Array.isArray(resultObject.data)) {
            // Ensure the elements of data are SerializedUser before setting
            setUsers(resultObject.data as SerializedUser[]);
          } else if (resultObject.users && Array.isArray(resultObject.users)) {
            // Handle the case where the key might be 'users'
            setUsers(resultObject.users as SerializedUser[]);
          } else if (typeof resultObject.error === "string") {
            // Check if there's an error property and success is explicitly false or not present
            if (resultObject.success === false || !("success" in resultObject)) {
              toast.error(`Failed to refresh user list: ${resultObject.error}`);
            } else {
              // Object has an error string, but success might be true or structure is ambiguous
              toast.error(`An error occurred: ${resultObject.error}`);
            }
            // Decide if you want to clear users or keep existing list on error
            // setUsers(initialUsers); // or setUsers([]);
          } else {
            // Unrecognized object structure from the API
            // console.warn("fetchAllUsersClient returned an unrecognized object structure:", apiResult);
            // Potentially set to empty or show a generic error if data isn't as expected
            // setUsers([]);
            // If there's a 'success: true' but no data/users, it might mean an empty successful fetch
            if (resultObject.success === true) {
              // Successfully fetched but no users (or data in unexpected format)
              // setUsers([]); // Depending on desired behavior
            } else {
              // toast.error("Failed to refresh user list: Unrecognized response format.");
            }
          }
        } else {
          // Handle cases where apiResult is not an array and not a recognizable object
          // (e.g., null, undefined, string, number - highly unexpected from an API client)
          // console.error("fetchAllUsersClient returned an unexpected type:", apiResult);
          // toast.error("Failed to refresh user list: Invalid response type from server.");
        }
      } catch (err) {
        console.error("Error during handleRefresh:", err);
        toast.error("An unexpected error occurred while refreshing users.");
      }
    });
  };

  const columns = getUserColumns({
    onView: id => {
      window.location.href = `/admin/users/${id}`;
    },
    onRefreshData: handleRefresh
  });

  return <UsersDataTable data={users} columns={columns} onRefresh={handleRefresh} />;
}
