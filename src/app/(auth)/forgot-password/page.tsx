import { ForgotPasswordForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Forgot Password",
  description: "Reset your password"
};

export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeader title="Forgot your password?" subtitle="Enter your email to reset your password" />
      <ForgotPasswordForm />
    </>
  );
}
