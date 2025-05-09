import { VerifyEmailForm } from "@/components";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Verify Email",
  description: "Verify your account"
};

export default function VerifyEmailPage() {
  return (
    <>
      <AuthHeader title="Verify your email" subtitle="Please check your inbox and enter the code below" />
      <VerifyEmailForm />
    </>
  );
}
