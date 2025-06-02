// "use client";

// import type React from "react";
// import { useState, useRef } from "react";
// import Link from "next/link";
// import { Mail } from "lucide-react";
// import { toast } from "sonner";
// import { auth } from "@/firebase/client/firebase-client-init";
// import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
// import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
// import { SubmitButton } from "@/components/shared/SubmitButton";
// import { logActivity } from "@/firebase/actions";
// import { UniversalInput } from "@/components/forms/UniversalInput";
// import { UniversalPasswordInput } from "@/components/forms/UniversalPasswordInput";

// export function ResendVerificationForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const emailInputRef = useRef<HTMLInputElement>(null);

//   function resetForm() {
//     setEmail("");
//     setPassword("");
//     emailInputRef.current?.focus();
//   }

//   const handleResendVerification = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Please enter your email and password");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       if (user.emailVerified) {
//         toast.success("Your email is already verified. You can log in now.");
//         resetForm();
//         return;
//       }

//       await sendEmailVerification(user);
//       await logActivity({
//         userId: user.uid,
//         type: "email_verification_resent",
//         description: "User requested new verification email",
//         status: "success",
//         metadata: { email }
//       });

//       toast.success("Verification email sent! Please check your inbox and spam folder.");
//       resetForm();
//     } catch (error: unknown) {
//       console.error("[RESEND_VERIFICATION] Error:", error);

//       if (isFirebaseError(error)) {
//         switch (error.code) {
//           case "auth/wrong-password":
//           case "auth/user-not-found":
//             toast.error("Invalid email or password");
//             break;
//           case "auth/too-many-requests":
//             toast.error("Too many attempts. Please try again later.");
//             break;
//           default:
//             toast.error(firebaseError(error));
//             break;
//         }
//       } else {
//         toast.error("Unexpected error. Please try again later.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full">
//       <div className="relative py-8 sm:py-10">
//         <div className="flex justify-center mb-6">
//           <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
//             <Mail className="h-10 w-10 text-primary" />
//           </div>
//         </div>

//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-semibold mb-2">Resend Verification Email</h1>
//           <p className="text-muted-foreground">Enter your credentials to resend the verification email</p>
//         </div>

//         <form onSubmit={handleResendVerification} className="space-y-6">
//           <UniversalInput
//             id="email"
//             label="Email"
//             value={email}
//             onChange={setEmail}
//             type="email"
//             placeholder="Enter your email"
//             required
//             ref={emailInputRef}
//           />

//           <UniversalPasswordInput
//             id="password"
//             label="Password"
//             value={password}
//             onChange={setPassword}
//             placeholder="Enter your password"
//             required
//           />

//           <SubmitButton isLoading={isLoading} loadingText="Sending..." className="w-full h-14 text-lg font-bold">
//             Resend Verification Email
//           </SubmitButton>
//         </form>

//         <div className="pt-6 text-center">
//           <p className="text-base text-muted-foreground">
//             Already verified?{" "}
//             <Link href="/login" className="font-semibold text-primary hover:underline">
//               Log in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { resendEmailVerification } from "@/actions/auth/resend-verification";
import { toast } from "sonner";

export function ResendVerificationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("email", email);

    try {
      const result = await resendEmailVerification(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Verification email sent successfully"
        });
        toast.success("Verification email sent!");
        setEmail(""); // Clear the form
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to send verification email"
        });
        toast.error(result.error || "Failed to send verification email");
      }
    } catch (error) {
      const errorMessage = "An unexpected error occurred";
      setMessage({
        type: "error",
        text: errorMessage
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Resend Verification Email</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a new verification link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="h-12"
            />
          </div>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full h-12" disabled={isLoading || !email.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Sending..." : "Send Verification Email"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
