import { ResendVerificationForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Resend Verification",
  description: "Resend verification email"
};

export default function ResendVerificationPage() {
  return (
    <>
      <AuthHeader title="Verify your email" subtitle="Didn’t receive an email? Enter your address again below." />
      <ResendVerificationForm />
    </>
  );
}
