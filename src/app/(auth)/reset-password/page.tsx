import { ResetPasswordForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Reset Password | MotoStix",
  description: "Create a new password for your MotoStix account"
};

export default function ResetPasswordPage() {
  return (
    <>
      <AuthHeader
        title="Reset Your Password"
        subtitle="Create a new secure password for your account. Make sure it's at least 8 characters long."
      />
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
    </>
  );
}
