import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginRedirect } from "@/components/auth/LoginRedirect";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Create Account | MotoStix",
  description: "Sign up for a MotoStix account to start shopping for premium stickers"
};

export default function RegisterPage() {
  return (
    <>
      <LoginRedirect />
      <AuthHeader title="Create Account" subtitle="Join MotoStix to access exclusive designs and track your orders" />
      <div className="mt-8">
        <RegisterForm />
      </div>
    </>
  );
}
