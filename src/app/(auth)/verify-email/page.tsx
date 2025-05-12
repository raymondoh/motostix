import { VerifyEmailForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Verify Email | MotoStix",
  description: "Verify your email address to complete your MotoStix account setup"
};

export default function VerifyEmailPage() {
  return (
    <>
      <AuthHeader
        title="Verify Your Email"
        subtitle="We've sent a verification code to your email address. Please check your inbox and enter the code below to complete your account setup."
      />
      <div className="mt-8">
        <VerifyEmailForm />
      </div>
    </>
  );
}
