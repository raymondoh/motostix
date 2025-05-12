import type { Metadata } from "next";
import { VerificationSuccessForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Email Verified | MotoStix",
  description: "Your MotoStix account has been successfully verified"
};

export default function VerifySuccessPage() {
  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <AuthHeader
        title="Email Verified!"
        subtitle="Your account has been successfully verified. You now have full access to all MotoStix features and services."
      />

      <div className="mt-8">
        <VerificationSuccessForm />
      </div>
    </>
  );
}
