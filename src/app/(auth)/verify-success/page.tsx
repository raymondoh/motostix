import type { Metadata } from "next";
import { VerificationSuccessForm } from "@/components";

export const metadata: Metadata = {
  title: "Verify Success",
  description: "Account Verified"
};

export default function VerifySuccessPage() {
  return <VerificationSuccessForm />;
}
