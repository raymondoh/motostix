// "use client";
// import { Navbar } from "@/components/header/Navbar";
// import { usePathname } from "next/navigation";

// export function Header() {
//   const pathname = usePathname();

//   // Define paths where the header should be completely hidden
//   const hiddenHeaderPaths = new Set([
//     "/login",
//     "/register",
//     "/forgot-password",
//     "/reset-password",
//     "/not-authorized",
//     "/error",
//     "/resend-verification",
//     "/verify-email",
//     "/verify-success"
//   ]);

//   // Don't render any header on auth pages
//   if (hiddenHeaderPaths.has(pathname)) {
//     return null;
//   }

//   // Render the full header on all other pages
//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-background">
//       <div className="container px-4 mx-auto">
//         <Navbar />
//       </div>
//     </header>
//   );
// }
"use client";
import { Navbar } from "@/components/header/Navbar";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const hiddenHeaderPaths = new Set([
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/not-authorized",
    "/error",
    "/resend-verification",
    "/verify-email",
    "/verify-success"
  ]);

  if (hiddenHeaderPaths.has(pathname)) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background text-foreground shadow-md">
      <div className="container px-4 mx-auto">
        <Navbar />
      </div>
    </header>
  );
}
