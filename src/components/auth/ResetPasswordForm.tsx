"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, XCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { auth } from "@/firebase/client/firebase-client-init";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { updatePasswordHash, getUserIdByEmail } from "@/actions/auth/reset-password";
import { firebaseError, isFirebaseError } from "@/utils/firebase-error";
import { SubmitButton } from "@/components/shared/SubmitButton";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<"verifying" | "ready" | "submitting" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oobCode, setOobCode] = useState("");
  const [userId, setUserId] = useState("");

  function resetForm() {
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setStatus("ready");
  }

  useEffect(() => {
    const mode = searchParams.get("mode");
    const code = searchParams.get("oobCode");

    if (mode === "resetPassword" && code) {
      setOobCode(code);

      const verifyCode = async () => {
        try {
          const email = await verifyPasswordResetCode(auth, code);
          setEmail(email);

          const result = await getUserIdByEmail({ email });
          if (result.success && result.userId) {
            setUserId(result.userId);
          }

          setStatus("ready");
        } catch (err) {
          console.error("[RESET_PASSWORD][VERIFY_CODE]", err);
          const msg = isFirebaseError(err) ? firebaseError(err) : "Invalid or expired password reset link";
          setErrorMessage(msg);
          setStatus("error");
        }
      };

      verifyCode();
    } else if (mode === "verifyEmail") {
      router.push(`/verify-email?${searchParams.toString()}`);
    } else {
      setErrorMessage("Invalid password reset link");
      setStatus("error");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setStatus("submitting");

    try {
      await confirmPasswordReset(auth, oobCode, password);

      const resolvedUserId = userId || (await getUserIdByEmail({ email })).userId;
      if (resolvedUserId) {
        await updatePasswordHash({ userId: resolvedUserId, newPassword: password });
      }

      setStatus("success");
      toast.success("Password reset successful! You can now log in.");

      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      console.error("[RESET_PASSWORD][SUBMIT]", err);
      const msg = isFirebaseError(err) ? firebaseError(err) : "Failed to reset password";
      setErrorMessage(msg);
      setStatus("error");
      toast.error(msg);
    }
  };

  if (status === "success") {
    return (
      <div className="w-full">
        <div className="relative py-8 sm:py-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">Password Reset Successful!</h1>
            <p className="text-muted-foreground">Your password has been reset successfully.</p>
          </div>

          <div className="mt-8">
            <Button asChild className="w-full h-14 text-lg font-semibold">
              <Link href="/login">Continue to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full">
        <div className="relative py-8 sm:py-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">Reset Link Invalid</h1>
            <p className="text-muted-foreground">{errorMessage}</p>
          </div>

          <div className="mt-8">
            <Button
              variant="default"
              className="w-full h-14 text-lg font-semibold"
              onClick={() => {
                resetForm();
                router.push("/forgot-password");
              }}>
              Request New Reset Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="relative py-8 sm:py-10">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground">Create a new password for {email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-semibold uppercase tracking-wide">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-4 flex items-center justify-center text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base font-semibold uppercase tracking-wide">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 px-4 flex items-center justify-center text-muted-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <SubmitButton
            isLoading={status === "submitting"}
            loadingText="Resetting..."
            className="w-full h-14 text-lg font-bold">
            Reset Password
          </SubmitButton>
        </form>

        <div className="pt-6 text-center">
          <p className="text-base text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
