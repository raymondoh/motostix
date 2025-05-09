"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { auth } from "@/firebase/client/firebase-client-init";
import { sendPasswordResetEmail } from "firebase/auth";
import { logPasswordResetActivity } from "@/actions/auth/reset-password";
import { firebaseError, isFirebaseError } from "@/utils/firebase-error";
import { SubmitButton } from "@/components/shared/SubmitButton";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/auth-action`,
        handleCodeInApp: false
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      await logPasswordResetActivity({ email });

      setIsSubmitted(true);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (err: unknown) {
      console.error("[FORGOT_PASSWORD] Error:", err);
      let errorMessage = "Failed to send password reset email. Please try again later.";

      if (isFirebaseError(err)) {
        if (err.code === "auth/user-not-found") {
          setIsSubmitted(true);
          return;
        }

        errorMessage = firebaseError(err);
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  function resetForm() {
    setEmail("");
    setError(null);
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md px-4 sm:px-6 mx-auto">
        <div className="relative py-8 sm:py-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
            <p className="text-muted-foreground">
              We've sent you a password reset link. Please check your inbox and spam folder.
            </p>
          </div>

          <div className="space-y-4 text-base">
            <p>
              Click the reset link in the email to set a new password. If you don&apos;t see the email, check your spam
              folder.
            </p>
            <p className="text-sm text-muted-foreground">The reset link will expire in 1 hour.</p>
          </div>

          <div className="mt-10 space-y-4">
            <Button asChild className="w-full h-12 text-base font-semibold">
              <Link href="/login">
                Return to login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive an email?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => {
                  resetForm();
                  setIsSubmitted(false);
                }}>
                Try again
              </Button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-4 sm:px-6 mx-auto">
      <div className="relative py-8 sm:py-10">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold uppercase tracking-wide">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="h-14 text-lg px-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary"
            />
          </div>

          <SubmitButton
            isLoading={isLoading}
            loadingText="Sending..."
            className="w-full h-14 text-lg font-bold tracking-wide uppercase">
            Send Reset Link
          </SubmitButton>
        </form>

        <div className="pt-10 text-sm text-center text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
