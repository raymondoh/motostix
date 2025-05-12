import { LoginForm } from "@/components/auth/LoginForm";
import { LoginRedirect } from "@/components/auth/LoginRedirect";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Login | MotoStix",
  description: "Sign in to your MotoStix account to access your dashboard, orders, and more"
};

export default function LoginPage() {
  return (
    <>
      <LoginRedirect />
      <AuthHeader title="Welcome Back" subtitle="Sign in to your account to access your dashboard, orders, and more" />
      <div className="mt-8">
        <LoginForm />
      </div>
    </>
  );
}
