"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeftCircle, Home, LayoutDashboard, User } from "lucide-react";

export default function NotFoundCatchAllPage() {
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  return (
    <main className="min-h-screen">
      <section className="py-12 md:py-16 w-full bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 max-w-2xl mx-auto">
            {/* Error Icon and Circle */}
            <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-2">
              <AlertTriangle className="h-10 w-10 text-yellow-500 dark:text-yellow-400" />
            </div>

            {/* Heading and Description */}
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">Page Not Found</h1>
              <div className="w-12 h-0.5 bg-primary"></div>
              <p className="text-muted-foreground max-w-md text-lg">
                The page you were looking for doesn&apos;t exist or has been moved.
              </p>
            </div>

            {/* 404 Visual */}
            <div className="text-8xl font-bold text-gray-100 dark:text-gray-800">404</div>

            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Button
                asChild
                className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>

              {status === "loading" ? (
                <>
                  <div className="h-10 w-48 animate-pulse rounded-full bg-muted" />
                  <div className="h-10 w-48 animate-pulse rounded-full bg-muted/60" />
                </>
              ) : (
                <>
                  {role === "admin" && (
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  )}

                  {role === "user" && (
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/user">
                        <User className="mr-2 h-4 w-4" />
                        User Dashboard
                      </Link>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
