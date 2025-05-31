"use client";

import type React from "react";
import { useState, useRef } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/firebase/client/firebase-client-init";
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { logActivity } from "@/firebase/actions";
import { UniversalInput } from "@/components/forms/UniversalInput";
import { UniversalPasswordInput } from "@/components/forms/UniversalPasswordInput";

export function ResendVerificationForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setEmail("");
    setPassword("");
    emailInputRef.current?.focus();
  }

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        toast.success("Your email is already verified. You can log in now.");
        resetForm();
        return;
      }

      await sendEmailVerification(user);
      await logActivity({
        userId: user.uid,
        type: "email_verification_resent",
        description: "User requested new verification email",
        status: "success",
        metadata: { email }
      });

      toast.success("Verification email sent! Please check your inbox and spam folder.");
      resetForm();
    } catch (error: unknown) {
      console.error("[RESEND_VERIFICATION] Error:", error);

      if (isFirebaseError(error)) {
        switch (error.code) {
          case "auth/wrong-password":
          case "auth/user-not-found":
            toast.error("Invalid email or password");
            break;
          case "auth/too-many-requests":
            toast.error("Too many attempts. Please try again later.");
            break;
          default:
            toast.error(firebaseError(error));
            break;
        }
      } else {
        toast.error("Unexpected error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative py-8 sm:py-10">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Resend Verification Email</h1>
          <p className="text-muted-foreground">Enter your credentials to resend the verification email</p>
        </div>

        <form onSubmit={handleResendVerification} className="space-y-6">
          <UniversalInput
            id="email"
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="Enter your email"
            required
            ref={emailInputRef}
          />

          <UniversalPasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
          />

          <SubmitButton isLoading={isLoading} loadingText="Sending..." className="w-full h-14 text-lg font-bold">
            Resend Verification Email
          </SubmitButton>
        </form>

        <div className="pt-6 text-center">
          <p className="text-base text-muted-foreground">
            Already verified?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
