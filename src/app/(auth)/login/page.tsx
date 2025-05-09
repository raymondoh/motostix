import { LoginForm } from "@/components/auth/LoginForm";
import { LoginRedirect } from "@/components/auth/LoginRedirect";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Login",
  description: "Login to your account"
};

export default function LoginPage() {
  return (
    <>
      <LoginRedirect />
      <AuthHeader title="Welcome back" subtitle="Sign in to your account to continue" />
      <LoginForm />
    </>
  );
}
