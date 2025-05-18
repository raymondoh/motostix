"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, LogIn } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";

export function NotAuthorizedClient() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string>("");
  const [returnUrl, setReturnUrl] = useState<string>("/");

  useEffect(() => {
    const messageParam = searchParams.get("message");
    const returnUrlParam = searchParams.get("returnUrl");

    setMessage(messageParam || "You don't have the necessary permissions to access this resource.");
    setReturnUrl(returnUrlParam || "/");
  }, [searchParams]);

  return (
    <div className="max-w-xl mx-auto text-center">
      <AuthHeader title="Access Denied" subtitle={message} />

      <div className="mt-6 bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please contact support or try logging in with a different account.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Button asChild variant="outline" className="h-12 text-base font-semibold px-6 rounded-full">
          <Link href={returnUrl}>
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Link>
        </Button>

        <Button asChild className="h-12 text-base font-semibold px-6 rounded-full">
          <Link href="/login">
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
}
