// // src/app/(dashboard)/admin/not-found.tsx
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { ShieldAlert } from "lucide-react";

// export default function AdminNotFound() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
//       <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
//       <h1 className="text-2xl font-bold">Admin Page Not Found - admin not-found</h1>
//       <p className="text-muted-foreground">The admin page you are looking for doesn't exist.</p>
//       <div className="mt-6 flex gap-4">
//         <Button asChild variant="outline">
//           <Link href="/admin">Return Home</Link>
//         </Button>
//         <Button asChild>
//           <Link href="/login">Login</Link>
//         </Button>
//       </div>
//     </div>
//   );
// }
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="rounded-full bg-red-100 p-6 mb-6">
        <ShieldAlert className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Admin Page Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The admin page you are looking for doesn't exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link href="/admin">Return to Admin Dashboard</Link>
        </Button>
        <Button asChild>
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
