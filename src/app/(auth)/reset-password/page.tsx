import { ResetPasswordForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Reset Password",
  description: "Reset your password"
};

export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeader title="Reset your password" subtitle="Enter your new password below" />
      <ResetPasswordForm />
    </>
  );
}
