// "use client";

// import type React from "react";

// import { useState, useEffect, useRef, startTransition, useActionState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { AlertCircle, ShieldCheck } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth } from "@/firebase/client/firebase-client-init";
// import { loginUser } from "@/actions/auth";
// import { signInWithNextAuth } from "@/firebase/client/next-auth";
// import type { LoginResponse } from "@/types/auth/login";
// import { GoogleAuthButton } from "@/components";
// import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
// import { SubmitButton } from "../shared/SubmitButton";
// import { UniversalInput } from "@/components/forms/UniversalInput";
// import { UniversalPasswordInput } from "@/components/forms/UniversalPasswordInput";

// type LoginState = LoginResponse | null;

// export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
//   const router = useRouter();
//   const { update } = useSession();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [formKey, setFormKey] = useState(0);

//   // 2FA related states
//   //const [mfaInProgress, setMfaInProgress] = useState(false);
//   //const [mfaResolver, setMfaResolver] = useState<any>(null);
//   //const [verificationId, setVerificationId] = useState("");
//   //const [verificationCode, setVerificationCode] = useState("");

//   const [state, action, isPending] = useActionState<LoginState, FormData>(loginUser, null, formKey.toString());

//   const loginErrorToastShown = useRef(false);
//   const isRedirecting = useRef(false);
//   const emailInputRef = useRef<HTMLInputElement>(null);

//   function resetForm() {
//     setEmail("");
//     setPassword("");
//     //setMfaInProgress(false);
//     //setVerificationCode("");
//     loginErrorToastShown.current = false;
//     isRedirecting.current = false;
//     emailInputRef.current?.focus();
//     //resetRecaptchaVerifier();
//   }

//   const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
//     setter(value);
//     // Reset error state when user types
//     if (state?.message && !state.success) {
//       setFormKey(prev => prev + 1);
//       loginErrorToastShown.current = false;
//     }
//   };

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     // If we're in MFA verification mode, handle that instead
//     // if (mfaInProgress) {
//     //   handleMfaVerification();
//     //   return;
//     // }

//     const formData = new FormData();
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("isRegistration", "false");
//     startTransition(() => {
//       action(formData);
//     });
//   };

//   // Handle MFA verification
//   // const handleMfaVerification = async () => {
//   //   if (!verificationCode) {
//   //     toast.error("Please enter the verification code");
//   //     return;
//   //   }

//   //   try {
//   //     const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
//   //     const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

//   //     // Complete sign-in with MFA
//   //     const userCredential = await mfaResolver.resolveSignIn(multiFactorAssertion);

//   //     // Get the token and continue with NextAuth
//   //     const idToken = await userCredential.user.getIdToken();
//   //     const signInResult = await signInWithNextAuth({ idToken });

//   //     if (!signInResult.success) throw new Error("NextAuth sign-in failed");

//   //     await update();
//   //     toast.success("Login successful!");
//   //     router.push("/");
//   //   } catch (error) {
//   //     console.error("[MFA] Error during verification:", error);
//   //     toast.error(isFirebaseError(error) ? firebaseError(error) : "Failed to verify code");
//   //     setVerificationCode("");
//   //     resetRecaptchaVerifier();
//   //   }
//   // };

//   useEffect(() => {
//     if (!state || loginErrorToastShown.current) return;

//     if (state.success) {
//       toast.success(state.message || "Login successful!");
//       loginErrorToastShown.current = true;
//       isRedirecting.current = true;

//       const handleRedirect = async () => {
//         try {
//           //if (!navigator.onLine) throw new Error("You are offline");
//           if (!auth || !state.data?.customToken) throw new Error("Missing auth or customToken");

//           try {
//             const userCredential = await signInWithCustomToken(auth, state.data.customToken);
//             const idToken = await userCredential.user.getIdToken();
//             const signInResult = await signInWithNextAuth({ idToken });

//             if (!signInResult.success) throw new Error("NextAuth sign-in failed");

//             await update();
//             router.push("/");
//           } catch (error) {
//             // Check if this is a MFA required error
//             if (isFirebaseError(error) && error.code === "auth/multi-factor-auth-required") {
//               // Handle MFA challenge
//               //const resolver = getMultiFactorResolver(auth, error as import("firebase/auth").MultiFactorError);
//               //setMfaResolver(resolver);
//               //setMfaInProgress(true);

//               // Get the recaptchaVerifier instance
//               //const recaptchaVerifier = getRecaptchaVerifier();
//               // if (!recaptchaVerifier) {
//               //   throw new Error("RecaptchaVerifier not initialized");
//               // }

//               // Send verification code to the user's phone
//               // const phoneInfoOptions = {
//               //   multiFactorHint: resolver.hints[0],
//               //   session: resolver.session
//               // };

//               //const phoneAuthProvider = new PhoneAuthProvider(auth);
//               //const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);

//               //setVerificationId(verificationId);
//               isRedirecting.current = false;
//               loginErrorToastShown.current = false;
//               toast.info("Please enter the verification code sent to your phone");
//             } else {
//               throw error;
//             }
//           }
//         } catch (error) {
//           console.error("[LOGIN] Error during redirect:", error);
//           toast.error(isFirebaseError(error) ? firebaseError(error) : "An error occurred during login");
//           loginErrorToastShown.current = false;
//           isRedirecting.current = false;
//           //resetRecaptchaVerifier();
//         }
//       };

//       handleRedirect();
//     } else if (state.message && !state.success && !loginErrorToastShown.current) {
//       loginErrorToastShown.current = true;
//       toast.error(state.message || "Login failed.");
//     }
//   }, [state, router, update, auth]);

//   return (
//     <div className={`w-full ${className}`} {...props}>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {state?.message && !state.success && !mfaInProgress && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-6 w-6" />
//             <AlertDescription className="text-base">{state.message}</AlertDescription>
//           </Alert>
//         )}

//         {mfaInProgress ? (
//           // 2FA Verification UI
//           <div className="space-y-6">
//             <Alert className="bg-amber-50 border-amber-200 text-amber-800">
//               <ShieldCheck className="h-5 w-5" />
//               <AlertDescription className="text-base">
//                 Two-factor authentication is enabled for your account. Please enter the verification code sent to your
//                 phone.
//               </AlertDescription>
//             </Alert>

//             <UniversalInput
//               id="verificationCode"
//               label="Verification Code"
//               value={verificationCode}
//               onChange={setVerificationCode}
//               placeholder="Enter 6-digit code"
//             />

//             <SubmitButton isLoading={isPending} loadingText="Verifying..." className="w-full h-14 text-lg font-bold">
//               Verify & Sign In
//             </SubmitButton>

//             <Button
//               type="button"
//               variant="outline"
//               className="w-full h-14 text-lg"
//               onClick={() => {
//                 setMfaInProgress(false);
//                 setVerificationCode("");
//                 resetForm();
//               }}>
//               Cancel
//             </Button>
//           </div>
//         ) : (
//           // Regular Login UI
//           <>
//             <UniversalInput
//               id="email"
//               label="Email"
//               value={email}
//               onChange={handleInputChange(setEmail)}
//               type="email"
//               placeholder="Enter your email"
//               required
//             />

//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-base font-semibold uppercase tracking-wide">Password</span>
//                 <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">
//                   Forgot password?
//                 </Link>
//               </div>
//               <UniversalPasswordInput
//                 id="password"
//                 label=""
//                 value={password}
//                 onChange={handleInputChange(setPassword)}
//                 placeholder="Enter your password"
//                 showLabel={false}
//               />
//             </div>

//             <SubmitButton
//               isLoading={isPending || isRedirecting.current}
//               loadingText={isRedirecting.current ? "Redirecting..." : "Signing in..."}
//               className="w-full h-14 text-lg font-bold">
//               Sign in
//             </SubmitButton>

//             <div className="my-10">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-muted" />
//                 </div>
//                 <div className="relative flex justify-center">
//                   <span className="bg-background px-4 text-sm text-muted-foreground">Or continue with</span>
//                 </div>
//               </div>
//               <GoogleAuthButton
//                 mode="signin"
//                 className="mt-4 h-14 text-base font-medium bg-secondary hover:bg-secondary/80 text-white dark:text-white transition-colors"
//               />
//             </div>
//           </>
//         )}

//         <div id="recaptcha-container" className="mt-4"></div>

//         <div className="pt-6 text-center">
//           <p className="text-base text-muted-foreground">
//             Don't have an account?{" "}
//             <Link href="/register" className="font-semibold text-primary hover:underline">
//               Sign up
//             </Link>
//           </p>
//         </div>
//       </form>
//     </div>
//   );
// }
"use client";

import type React from "react";

import { useState, useEffect, useRef, startTransition, useActionState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react"; // Removed ShieldCheck as it was only for 2FA UI
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"; // Kept, but ensure it's used if 2FA cancel button was its only use. It is used for "Cancel" in the original, but that part of UI is gone. Assuming it might be used by other components or future states, otherwise can be removed if no other Button component is used. Re-checking the final JSX, there is no regular <Button /> left, only <SubmitButton /> and <GoogleAuthButton />. So if this 'Button' specifically refers to the generic one, it might be removable. However, 'SubmitButton' likely uses 'Button' as a base or has its own styling. For safety, let's assume `Button` from `components/ui/button` might be used by `SubmitButton` or `GoogleAuthButton` as a primitive or is generally available. If SubmitButton and GoogleAuthButton are self-contained or use a different Button primitive, then this specific import might be unneeded. *User should verify this based on their `SubmitButton` and `GoogleAuthButton` implementations.* For now, I will keep it as it's a common UI component.
import { toast } from "sonner";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase/client/firebase-client-init";
import { loginUser } from "@/actions/auth";
import { signInWithNextAuth } from "@/firebase/client/next-auth";
import type { LoginResponse } from "@/types/auth/login";
import { GoogleAuthButton } from "@/components";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { SubmitButton } from "../shared/SubmitButton";
import { UniversalInput } from "@/components/forms/UniversalInput";
import { UniversalPasswordInput } from "@/components/forms/UniversalPasswordInput";

type LoginState = LoginResponse | null;

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { update } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formKey, setFormKey] = useState(0);

  const [state, action, isPending] = useActionState<LoginState, FormData>(loginUser, null, formKey.toString());

  const loginErrorToastShown = useRef(false);
  const isRedirecting = useRef(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setEmail("");
    setPassword("");
    loginErrorToastShown.current = false;
    isRedirecting.current = false;
    emailInputRef.current?.focus();
  }

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value);
    if (state?.message && !state.success) {
      setFormKey(prev => prev + 1);
      loginErrorToastShown.current = false;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("isRegistration", "false");
    startTransition(() => {
      action(formData);
    });
  };

  useEffect(() => {
    if (!state || loginErrorToastShown.current) return;

    if (state.success) {
      toast.success(state.message || "Login successful!");
      loginErrorToastShown.current = true;
      isRedirecting.current = true;

      const handleRedirect = async () => {
        try {
          if (!auth || !state.data?.customToken) throw new Error("Missing auth or customToken");

          try {
            const userCredential = await signInWithCustomToken(auth, state.data.customToken);
            const idToken = await userCredential.user.getIdToken();
            const signInResult = await signInWithNextAuth({ idToken });

            if (!signInResult.success) throw new Error("NextAuth sign-in failed");

            await update();
            router.push("/");
          } catch (error) {
            // Any error during the Firebase custom token sign-in or NextAuth update
            // will be caught here and re-thrown to the outer catch block.
            throw error;
          }
        } catch (error) {
          console.error("[LOGIN] Error during redirect:", error);
          toast.error(isFirebaseError(error) ? firebaseError(error) : "An error occurred during login");
          isRedirecting.current = false;
          // Resetting this flag allows a new error toast from a subsequent server action to be shown if needed.
          loginErrorToastShown.current = false;
        }
      };

      handleRedirect();
    } else if (state.message && !state.success && !loginErrorToastShown.current) {
      loginErrorToastShown.current = true;
      toast.error(state.message || "Login failed.");
    }
  }, [state, router, update]); // `auth` is implicitly a dependency if used directly from module scope, or should be passed if it can change and is from context/props. Assuming `auth` from import is stable.

  return (
    <div className={`w-full ${className}`} {...props}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display error messages from the server action (e.g., invalid credentials) */}
        {state?.message && !state.success && (
          <Alert variant="destructive">
            <AlertCircle className="h-6 w-6" />
            <AlertDescription className="text-base">{state.message}</AlertDescription>
          </Alert>
        )}

        {/* Regular Login UI */}
        <>
          <UniversalInput
            id="email"
            label="Email"
            value={email}
            onChange={handleInputChange(setEmail)}
            type="email"
            placeholder="Enter your email"
            required
            ref={emailInputRef} // Assign ref here if you want to focus it
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold uppercase tracking-wide">Password</span>
              <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
            <UniversalPasswordInput
              id="password"
              label=""
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="Enter your password"
              showLabel={false}
            />
          </div>

          <SubmitButton
            isLoading={isPending || isRedirecting.current}
            loadingText={isRedirecting.current ? "Redirecting..." : "Signing in..."}
            className="w-full h-14 text-lg font-bold">
            Sign in
          </SubmitButton>

          <div className="my-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <GoogleAuthButton
              mode="signin"
              className="mt-4 h-14 text-base font-medium bg-secondary hover:bg-secondary/80 text-white dark:text-white transition-colors"
            />
          </div>
        </>

        {/* Removed id="recaptcha-container" div as it was likely for 2FA phone verification's reCAPTCHA */}

        <div className="pt-6 text-center">
          <p className="text-base text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
