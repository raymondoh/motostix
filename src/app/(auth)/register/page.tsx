import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthHeader } from "@/components/auth/AuthHeader";

export const metadata = {
  title: "Register",
  description: "Create a new account"
};

export default function RegisterPage() {
  return (
    <>
      <AuthHeader title="Create an account" subtitle="Sign up to get started with MotoStix" />
      <RegisterForm />
    </>
  );
}
