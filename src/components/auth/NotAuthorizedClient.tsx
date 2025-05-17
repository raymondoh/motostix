// src/components/auth/NotAuthorizedClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export function NotAuthorizedClient() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("");
  const [returnUrl, setReturnUrl] = useState<string>("/");

  useEffect(() => {
    // Get the message and return URL from search params
    const messageParam = searchParams.get("message");
    const returnUrlParam = searchParams.get("returnUrl");

    if (messageParam) {
      setMessage(messageParam);
    } else {
      setMessage("You don't have the necessary permissions to access this resource.");
    }

    if (returnUrlParam) {
      setReturnUrl(returnUrlParam);
    }
  }, [searchParams]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-border/40 p-6 md:p-8">
      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-base">{message}</p>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please contact support or try logging in with a different account.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link href={returnUrl}>
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>

          <Button
            asChild
            className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-full">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In with Different Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
