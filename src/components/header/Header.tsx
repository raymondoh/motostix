// "use client";
// import Link from "next/link";
// import { Navbar } from "@/components/header/Navbar";
// import { usePathname } from "next/navigation";
// import { Logo } from "./Logo";

// export function Header() {
//   const pathname = usePathname();

//   const excludedPaths = new Set([
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

//   const showMinimalHeader = [...excludedPaths].some(path => pathname.startsWith(path));

//   if (showMinimalHeader) {
//     return (
//       <header className="sticky top-0 z-40 w-full border-b border-border bg-white dark:bg-background">
//         <div className="container px-4 py-4 mx-auto flex items-center justify-center">
//           <Link href="/" className="flex items-center">
//             <Logo className="h-9 w-9" />
//             <span className="ml-3 text-2xl font-bold tracking-tight">
//               MOTO<span className="text-accent">STIX</span>
//             </span>
//           </Link>
//         </div>
//       </header>
//     );
//   }

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

  // Define paths where the header should be completely hidden
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

  // Don't render any header on auth pages
  if (hiddenHeaderPaths.has(pathname)) {
    return null;
  }

  // Render the full header on all other pages
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white dark:bg-background">
      <div className="container px-4 mx-auto">
        <Navbar />
      </div>
    </header>
  );
}
