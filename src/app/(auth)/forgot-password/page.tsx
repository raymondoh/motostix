import { ForgotPasswordForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Forgot Password | MotoStix",
  description: "Reset your password to regain access to your MotoStix account"
};

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeader
        title="Forgot Your Password?"
        subtitle="Enter your email address and we'll send you a link to reset your password"
      />
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </>
  );
}
