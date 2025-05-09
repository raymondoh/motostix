import type { Metadata } from "next";
import { VerificationSuccessForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata: Metadata = {
  title: "Verify Success",
  description: "Account Verified"
};

export default function VerifySuccessPage() {
  return (
    <>
      <AuthHeader title="You're verified!" subtitle="Your account has been successfully verified" />
      <VerificationSuccessForm />
    </>
  );
}
