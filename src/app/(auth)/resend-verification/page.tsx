import { ResendVerificationForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Verify Email | MotoStix",
  description: "Resend your email verification link to complete your MotoStix account setup"
};

export default function ResendVerificationPage() {
  return (
    <>
      <AuthHeader
        title="Verify Your Email"
        subtitle="Didn't receive a verification email? Enter your email address below and we'll send a new link."
      />
      <div className="mt-8">
        <ResendVerificationForm />
      </div>
    </>
  );
}
