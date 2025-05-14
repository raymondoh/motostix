// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { ModeToggle } from "@/components/header/ModeToggle";
// import { LayoutDashboard, Menu, LogIn, LogOut, UserPlus, User } from "lucide-react";
// import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// import { useSession, signOut } from "next-auth/react";
// import { generalNavItems, adminNavItems, type NavItem } from "@/lib/navigation";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu";
// import { Logo } from "./Logo";
// import { UserAvatar } from "../shared/UserAvatar";
// import { HeaderIconButton } from "./header-icon-button";
// import { cn } from "@/lib/utils";
// import { CartIcon } from "@/components/cart/cart-icon"; // Import the correct CartIcon component

// // Track if we've already checked the session
// let hasCheckedSession = false;
// let lastPathname = "";

// const useMediaQuery = (query: string) => {
//   const [matches, setMatches] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const media = window.matchMedia(query);
//     const listener = () => setMatches(media.matches);
//     setMatches(media.matches);
//     setIsLoading(false);
//     media.addListener(listener);
//     return () => media.removeListener(listener);
//   }, [query]);

//   return { matches, isLoading };
// };

// const NavLinks = ({ setOpen, isMobile }: { setOpen?: (open: boolean) => void; isMobile: boolean }) => {
//   const pathname = usePathname();

//   // Function to determine if a nav item is active
//   const isActive = (href: string) => {
//     // Special case for home page to prevent it from matching everything
//     if (href === "/") {
//       return pathname === "/";
//     }

//     // For other pages, check if the current path starts with the href
//     return pathname.startsWith(href);
//   };

//   const renderNavItem = (item: NavItem) => (
//     <Link
//       key={item.href}
//       href={item.href}
//       className={cn(
//         "text-sm font-bold uppercase tracking-wide transition-colors px-4 py-2 rounded-full",
//         isActive(item.href)
//           ? "bg-black text-white dark:bg-white dark:text-black"
//           : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800",
//         isMobile ? "w-full text-center" : ""
//       )}
//       onClick={() => setOpen?.(false)}>
//       <span>{item.title}</span>
//     </Link>
//   );

//   return (
//     <div className={`flex ${isMobile ? "flex-col space-y-4" : "space-x-2"}`}>{generalNavItems.map(renderNavItem)}</div>
//   );
// };

// export const Navbar = () => {
//   const { matches: isMobile, isLoading } = useMediaQuery("(max-width: 768px)");
//   const [open, setOpen] = useState(false);
//   const { data: session, status } = useSession();

//   if (isLoading) {
//     return <NavbarSkeleton />;
//   }

//   return (
//     <nav className="container max-w-8xl mx-auto flex items-center justify-between py-4 px-0">
//       <div className="flex items-center">
//         {isMobile ? (
//           <div className="flex items-center">
//             <Sheet open={open} onOpenChange={setOpen}>
//               <SheetTrigger asChild>
//                 <HeaderIconButton aria-label="Open menu">
//                   <Menu className="h-5 w-5" />
//                 </HeaderIconButton>
//               </SheetTrigger>
//               <SheetContent side="left">
//                 <SheetHeader>
//                   <SheetTitle>Menu</SheetTitle>
//                   <SheetDescription></SheetDescription>
//                 </SheetHeader>
//                 <div className="py-4">
//                   <NavLinks setOpen={setOpen} isMobile={true} />
//                 </div>
//               </SheetContent>
//             </Sheet>
//             <Link href="/" className="flex items-center ml-2 mr-0">
//               <Logo className="h-8 w-8" />
//               <span className="ml-2 text-xl font-bold tracking-tight">
//                 MOTO<span className="text-accent">STIX</span>
//               </span>
//             </Link>
//           </div>
//         ) : (
//           <div className="flex items-center">
//             <Link href="/" className="flex items-center mr-10">
//               <Logo className="h-9 w-9" />
//               <span className="ml-3 text-2xl font-bold tracking-tight">
//                 MOTO<span className="text-accent">STIX</span>
//               </span>
//             </Link>

//             <NavLinks isMobile={false} />
//           </div>
//         )}
//       </div>

//       <div className="flex items-center space-x-3">
//         <CartIcon />
//         <ModeToggle />
//         <UserMenu isMobile={isMobile} />
//       </div>
//     </nav>
//   );
// };

// const UserMenu = ({ isMobile }: { isMobile?: boolean }) => {
//   const { data: session, status, update } = useSession();
//   const router = useRouter();
//   const [isSigningOut, setIsSigningOut] = useState(false);
//   const pathname = usePathname();
//   const sessionCheckRef = useRef(false);
//   const lastSessionCheckTimeRef = useRef(0);
//   const isUpdatingSessionRef = useRef(false);
//   const componentId = useRef(`user-menu-${Math.random().toString(36).substring(7)}`).current;

//   // Check for account deletion cookie
//   useEffect(() => {
//     const checkAccountDeleted = () => {
//       if (typeof document !== "undefined") {
//         const cookies = document.cookie.split(";");
//         const hasDeletedCookie = cookies.some(cookie => cookie.trim().startsWith("account-deleted="));

//         if (hasDeletedCookie) {
//           document.cookie = "account-deleted=; Max-Age=-1; path=/;";
//           window.location.reload();
//         }
//       }
//     };

//     checkAccountDeleted();
//   }, []);

//   // Session check effect
//   useEffect(() => {
//     console.log(`[${componentId}] UserMenu session check effect triggered`, {
//       pathname,
//       hasCheckedSession,
//       lastPathname,
//       sessionCheckRef: sessionCheckRef.current,
//       isUpdatingSession: isUpdatingSessionRef.current,
//       timeSinceLastCheck: Date.now() - lastSessionCheckTimeRef.current
//     });

//     if (isUpdatingSessionRef.current) {
//       console.log(`[${componentId}] Skipping session check - already updating session`);
//       return;
//     }

//     if (pathname === lastPathname && hasCheckedSession) {
//       console.log(`[${componentId}] Skipping session check - already checked for this pathname`);
//       return;
//     }

//     const now = Date.now();
//     if (now - lastSessionCheckTimeRef.current < 2000) {
//       console.log(`[${componentId}] Throttling session check - too frequent`);
//       return;
//     }

//     if (!sessionCheckRef.current) {
//       sessionCheckRef.current = true;
//       lastPathname = pathname;
//       lastSessionCheckTimeRef.current = now;
//       hasCheckedSession = true;
//       isUpdatingSessionRef.current = true;

//       console.log(`[${componentId}] Performing session check/update`);
//       update()
//         .then(() => {
//           console.log(`[${componentId}] Session update completed`);
//           isUpdatingSessionRef.current = false;
//         })
//         .catch(error => {
//           console.error(`[${componentId}] Error refreshing session:`, error);
//           isUpdatingSessionRef.current = false;
//         });
//     }
//   }, [update, pathname, componentId]);

//   // Storage event listener
//   useEffect(() => {
//     const handleStorageChange = (event: StorageEvent) => {
//       console.log(`[${componentId}] Storage event detected:`, event.key);
//       if (event.key?.includes("session") || event.key?.includes("token")) {
//         console.log(`[${componentId}] Session-related storage change, updating session`);
//         update();
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, [update, componentId]);

//   const handleSignOut = async () => {
//     if (isSigningOut) return;

//     setIsSigningOut(true);
//     try {
//       const result = await signOut({ redirect: false, callbackUrl: "/" });
//       router.push(result?.url || "/");
//       toast("You are now signed out.");
//     } catch (error) {
//       console.error("Error signing out:", error);
//       toast.error("An error occurred while signing out");
//     } finally {
//       setIsSigningOut(false);
//     }
//   };

//   const handleNavigation = (path: string) => {
//     console.log("Navigating to:", path);
//     router.push(path);
//   };

//   const user = session?.user;
//   const isLoggedIn = !!user;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <HeaderIconButton className=" hover:bg-background/70">
//           {isLoggedIn ? (
//             <UserAvatar src={user?.image} name={user?.name} email={user?.email} className="h-8 w-8" />
//           ) : (
//             <User className="h-5 w-5 text-black dark:text-white" />
//           )}
//         </HeaderIconButton>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-64">
//         {status === "loading" ? (
//           <DropdownMenuItem disabled>
//             <Skeleton className="h-4 w-full" />
//           </DropdownMenuItem>
//         ) : isLoggedIn ? (
//           <>
//             <DropdownMenuLabel className="flex items-center gap-3 p-4">
//               <UserAvatar src={user?.image} name={user?.name} email={user?.email} className="h-10 w-10" />
//               <div className="flex flex-col">
//                 <span className="font-medium text-base">{user?.name || user?.email}</span>
//                 {user?.email && user?.name && (
//                   <span className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</span>
//                 )}
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               {user.role === "admin" ? (
//                 adminNavItems.map(item => (
//                   <DropdownMenuItem key={item.href} onClick={() => handleNavigation(item.href)} className="py-3">
//                     <item.icon className="mr-3 h-5 w-5" />
//                     <span className="text-base">{item.title}</span>
//                   </DropdownMenuItem>
//                 ))
//               ) : (
//                 <DropdownMenuItem onClick={() => handleNavigation("/user")} className="py-3">
//                   <LayoutDashboard className="mr-3 h-5 w-5" />
//                   <span className="text-base">Dashboard</span>
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut} className="py-3">
//               <LogOut className="mr-3 h-5 w-5" />
//               <span className="text-base">{isSigningOut ? "Signing out..." : "Log out"}</span>
//             </DropdownMenuItem>
//           </>
//         ) : (
//           <>
//             <DropdownMenuLabel className="p-4">
//               <span className="font-medium text-base">Account</span>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <Link href="/login" passHref>
//               <DropdownMenuItem className="py-3">
//                 <LogIn className="mr-3 h-5 w-5 text-primary" />
//                 <span className="text-base">Log in</span>
//               </DropdownMenuItem>
//             </Link>
//             <Link href="/register" passHref>
//               <DropdownMenuItem className="py-3 font-medium">
//                 <UserPlus className="mr-3 h-5 w-5 text-accent" />
//                 <span className="text-base">Sign up</span>
//               </DropdownMenuItem>
//             </Link>
//           </>
//         )}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };

// const NavbarSkeleton = () => (
//   <nav className="container mx-auto flex items-center justify-between p-4">
//     <Skeleton className="h-10 w-20" />
//     <div className="flex space-x-4">
//       <Skeleton className="h-10 w-10" />
//       <Skeleton className="h-10 w-10" />
//     </div>
//   </nav>
// );
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/header/ModeToggle";
import { LayoutDashboard, Menu, LogIn, LogOut, UserPlus, User, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession, signOut } from "next-auth/react";
import { generalNavItems, adminNavItems, type NavItem } from "@/lib/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Logo } from "./Logo";
import { UserAvatar } from "../shared/UserAvatar";
import { HeaderIconButton } from "./header-icon-button";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart/cart-icon";
import { useSearch } from "@/contexts/SearchContext";

// Track if we've already checked the session
let hasCheckedSession = false;
let lastPathname = "";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    setMatches(media.matches);
    setIsLoading(false);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query]);

  return { matches, isLoading };
};

const NavLinks = ({ setOpen, isMobile }: { setOpen?: (open: boolean) => void; isMobile: boolean }) => {
  const pathname = usePathname();

  // Function to determine if a nav item is active
  const isActive = (href: string) => {
    // Special case for home page to prevent it from matching everything
    if (href === "/") {
      return pathname === "/";
    }

    // For other pages, check if the current path starts with the href
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      className={cn(
        "text-sm font-bold uppercase tracking-wide transition-colors px-4 py-2 rounded-full",
        isActive(item.href)
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800",
        isMobile ? "w-full text-center" : ""
      )}
      onClick={() => setOpen?.(false)}>
      <span>{item.title}</span>
    </Link>
  );

  return (
    <div className={`flex ${isMobile ? "flex-col space-y-4" : "space-x-2"}`}>{generalNavItems.map(renderNavItem)}</div>
  );
};

export const Navbar = () => {
  const { matches: isMobile, isLoading } = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const { openSearch } = useSearch();

  // Add keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  if (isLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <nav className="container max-w-8xl mx-auto flex items-center justify-between py-4 px-0">
      <div className="flex items-center">
        {isMobile ? (
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <HeaderIconButton aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </HeaderIconButton>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  {/* Add search button to mobile menu */}
                  <HeaderIconButton 
                    onClick={openSearch} 
                    className="w-full flex justify-center items-center gap-2 mb-4"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </HeaderIconButton>
                  <NavLinks setOpen={setOpen} isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center ml-2 mr-0">
              <Logo className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold tracking-tight">
                MOTO<span className="text-accent">STIX</span>
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-10">
              <Logo className="h-9 w-9" />
              <span className="ml-3 text-2xl font-bold tracking-tight">
                MOTO<span className="text-accent">STIX</span>
              </span>
            </Link>

            <NavLinks isMobile={false} />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {/* Add search button before cart icon */}
        <HeaderIconButton onClick={openSearch} aria-label="Search">
          <Search className="h-5 w-5" />
        </HeaderIconButton>
        <CartIcon />
        <ModeToggle />
        <UserMenu isMobile={isMobile} />
      </div>
    </nav>
  );
};

const UserMenu = ({ isMobile }: { isMobile?: boolean }) => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const pathname = usePathname();
  const sessionCheckRef = useRef(false);
  const lastSessionCheckTimeRef = useRef(0);
  const isUpdatingSessionRef = useRef(false);
  const componentId = useRef(`user-menu-${Math.random().toString(36).substring(7)}`).current;

  // Check for account deletion cookie
  useEffect(() => {
    const checkAccountDeleted = () => {
      if (typeof document !== "undefined") {
        const cookies = document.cookie.split(";");
        const hasDeletedCookie = cookies.some(cookie => cookie.trim().startsWith("account-deleted="));

        if (hasDeletedCookie) {
          document.cookie = "account-deleted=; Max-Age=-1; path=/;";
          window.location.reload();
        }
      }
    };

    checkAccountDeleted();
  }, []);

  // Session check effect
  useEffect(() => {
    console.log(`[${componentId}] UserMenu session check effect triggered`, {
      pathname,
      hasCheckedSession,
      lastPathname,
      sessionCheckRef: sessionCheckRef.current,
      isUpdatingSession: isUpdatingSessionRef.current,
      timeSinceLastCheck: Date.now() - lastSessionCheckTimeRef.current
    });

    if (isUpdatingSessionRef.current) {
      console.log(`[${componentId}] Skipping session check - already updating session`);
      return;
    }

    if (pathname === lastPathname && hasCheckedSession) {
      console.log(`[${componentId}] Skipping session check - already checked for this pathname`);
      return;
    }

    const now = Date.now();
    if (now - lastSessionCheckTimeRef.current < 2000) {
      console.log(`[${componentId}] Throttling session check - too frequent`);
      return;
    }

    if (!sessionCheckRef.current) {
      sessionCheckRef.current = true;
      lastPathname = pathname;
      lastSessionCheckTimeRef.current = now;
      hasCheckedSession = true;
      isUpdatingSessionRef.current = true;

      console.log(`[${componentId}] Performing session check/update`);
      update()
        .then(() => {
          console.log(`[${componentId}] Session update completed`);
          isUpdatingSessionRef.current = false;
        })
        .catch(error => {
          console.error(`[${componentId}] Error refreshing session:`, error);
          isUpdatingSessionRef.current = false;
        });
    }
  }, [update, pathname, componentId]);

  // Storage event listener
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      console.log(`[${componentId}] Storage event detected:`, event.key);
      if (event.key?.includes("session") || event.key?.includes("token")) {
        console.log(`[${componentId}] Session-related storage change, updating session`);
        update();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [update, componentId]);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      const result = await signOut({ redirect: false, callbackUrl: "/" });
      router.push(result?.url || "/");
      toast("You are now signed out.");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("An error occurred while signing out");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    router.push(path);
  };

  const user = session?.user;
  const isLoggedIn = !!user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <HeaderIconButton className=" hover:bg-background/70">
          {isLoggedIn ? (
            <UserAvatar src={user?.image} name={user?.name} email={user?.email} className="h-8 w-8" />
          ) : (
            <User className="h-5 w-5 text-black dark:text-white" />
          )}
        </HeaderIconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {status === "loading" ? (
          <DropdownMenuItem disabled>
            <Skeleton className="h-4 w-full" />
          </DropdownMenuItem>
        ) : isLoggedIn ? (
          <>
            <DropdownMenuLabel className="flex items-center gap-3 p-4">
              <UserAvatar src={user?.image} name={user?.name} email={user?.email} className="h-10 w-10" />
              <div className="flex flex-col">
                <span className="font-medium text-base">{user?.name || user?.email}</span>
                {user?.email && user?.name && (
                  <span className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {user.role === "admin" ? (
                adminNavItems.map(item => (
                  <DropdownMenuItem key={item.href} onClick={() => handleNavigation(item.href)} className="py-3">
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="text-base">{item.title}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem onClick={() => handleNavigation("/user")} className="py-3">
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  <span className="text-base">Dashboard</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut} className="py-3">
              <LogOut className="mr-3 h-5 w-5" />
              <span className="text-base">{isSigningOut ? "Signing out..." : "Log out"}</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="p-4">
              <span className="font-medium text-base">Account</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/login" passHref>
              <DropdownMenuItem className="py-3">
                <LogIn className="mr-3 h-5 w-5 text-primary" />
                <span className="text-base">Log in</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/register" passHref>
              <DropdownMenuItem className="py-3 font-medium">
                <UserPlus className="mr-3 h-5 w-5 text-accent" />
                <span className="text-base">Sign up</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavbarSkeleton = () => (
  <nav className="container mx-auto flex items-center justify-between p-4">
    <Skeleton className="h-10 w-20" />
    <div className="flex space-x-4">
      <Skeleton className="h-10 w-10" />
      <Skeleton className="h-10 w-10" />
    </div>
  </nav>
);