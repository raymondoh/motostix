// "use client";

// import type React from "react";
// import { useState, useEffect, useRef, startTransition, useActionState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Eye, EyeOff, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { toast } from "sonner";
// import { useSession } from "next-auth/react";
// import { signInWithCustomToken } from "firebase/auth";
// import { auth } from "@/firebase/client/firebase-client-init";
// import { loginUser } from "@/actions/auth";
// import { signInWithNextAuth } from "@/firebase/client/next-auth";
// import type { LoginResponse } from "@/types/auth/login";
// import { GoogleAuthButton } from "@/components";
// import { CloseButton } from "@/components";
// import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
// import { SubmitButton } from "../shared/SubmitButton";

// // Create a valid initial state for LoginResponse
// const initialLoginState: LoginResponse = {
//   success: false,
//   message: "",
//   data: undefined
// };

// type LoginState = LoginResponse | null;

// export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
//   const router = useRouter();
//   const { update } = useSession();

//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [formKey, setFormKey] = useState(0);

//   const [state, action, isPending] = useActionState<LoginState, FormData>(loginUser, null, formKey.toString());

//   const loginErrorToastShown = useRef(false);
//   const isRedirecting = useRef(false);
//   const emailInputRef = useRef<HTMLInputElement>(null);

//   function resetForm() {
//     setEmail("");
//     setPassword("");
//     loginErrorToastShown.current = false;
//     isRedirecting.current = false;
//     emailInputRef.current?.focus();
//   }

//   const handleInputChange =
//     (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
//       setter(e.target.value);
//       // Reset error state when user types
//       if (state?.message && !state.success) {
//         setFormKey(prev => prev + 1);
//         loginErrorToastShown.current = false;
//       }
//     };

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("isRegistration", "false");
//     startTransition(() => {
//       action(formData);
//     });
//   };

//   useEffect(() => {
//     if (!state || loginErrorToastShown.current) return;

//     console.log("Login state:", state); // For debugging

//     if (state.success) {
//       toast.success(state.message || "Login successful!");
//       loginErrorToastShown.current = true;
//       isRedirecting.current = true;

//       const handleRedirect = async () => {
//         try {
//           if (!navigator.onLine) throw new Error("You are offline");
//           if (!auth || !state.data?.customToken) throw new Error("Missing auth or customToken");

//           const userCredential = await signInWithCustomToken(auth, state.data.customToken);
//           const idToken = await userCredential.user.getIdToken();
//           const signInResult = await signInWithNextAuth({ idToken });

//           if (!signInResult.success) throw new Error("NextAuth sign-in failed");

//           await update();
//           router.push("/");
//         } catch (error) {
//           console.error("[LOGIN] Error during redirect:", error);
//           toast.error(isFirebaseError(error) ? firebaseError(error) : "An error occurred during login");
//           loginErrorToastShown.current = false;
//           isRedirecting.current = false;
//         }
//       };

//       handleRedirect();
//     } else if (state.message && !state.success && !loginErrorToastShown.current) {
//       loginErrorToastShown.current = true;
//       toast.error(state.message || "Login failed.");
//     }
//   }, [state, router, update]);

//   return (
//     <div className={`w-full ${className}`} {...props}>
//       <div className="relative py-8 sm:py-10">
//         <div className="absolute right-0 top-4 z-10">
//           <CloseButton />
//         </div>

//         {state?.message && !state.success && (
//           <Alert variant="destructive" className="mb-8">
//             <AlertCircle className="h-6 w-6" />
//             <AlertDescription className="text-lg">{state.message}</AlertDescription>
//           </Alert>
//         )}

//         <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <Label htmlFor="email" className="text-base font-semibold uppercase tracking-wide">
//               Email
//             </Label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               required
//               ref={emailInputRef}
//               value={email}
//               onChange={handleInputChange(setEmail)}
//               placeholder="name@example.com"
//               className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//             />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="password" className="text-base font-semibold uppercase tracking-wide">
//                 Password
//               </Label>
//               <Link
//                 href="/forgot-password"
//                 className="text-base text-muted-foreground hover:text-primary hover:underline">
//                 Forgot password?
//               </Link>
//             </div>
//             <div className="relative">
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 required
//                 value={password}
//                 onChange={handleInputChange(setPassword)}
//                 placeholder="••••••••"
//                 className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent"
//                 onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
//               </Button>
//             </div>
//           </div>

//           <SubmitButton
//             isLoading={isPending || isRedirecting.current}
//             loadingText={isRedirecting.current ? "Redirecting..." : "Logging in..."}
//             className="w-full h-14 text-lg font-bold">
//             Login
//           </SubmitButton>

//           <div className="my-10">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t border-muted" />
//               </div>
//               <div className="relative flex justify-center">
//                 <span className="bg-background px-4 text-sm text-muted-foreground">Or continue with</span>
//               </div>
//             </div>
//             <GoogleAuthButton mode="signin" className="mt-4 h-12 text-base font-medium" />
//           </div>
//         </form>
//       </div>

//       <div className="py-8 flex justify-center border-t">
//         <p className="text-base text-muted-foreground">
//           Don&apos;t have an account?{" "}
//           <Link href="/register" className="font-semibold text-primary hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

////////////////////////////////

"use client";

import type React from "react";
import { useState, useEffect, useRef, startTransition, useActionState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  signInWithCustomToken,
  getMultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator
} from "firebase/auth";
import { auth, getRecaptchaVerifier, resetRecaptchaVerifier } from "@/firebase/client/firebase-client-init";
import { loginUser } from "@/actions/auth";
import { signInWithNextAuth } from "@/firebase/client/next-auth";
import type { LoginResponse } from "@/types/auth/login";
import { GoogleAuthButton } from "@/components";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { SubmitButton } from "../shared/SubmitButton";

// Create a valid initial state for LoginResponse
// const initialLoginState: LoginResponse = {
//   success: false,
//   message: "",
//   data: undefined
// };

type LoginState = LoginResponse | null;

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { update } = useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formKey, setFormKey] = useState(0);

  // 2FA related states
  const [mfaInProgress, setMfaInProgress] = useState(false);
  const [mfaResolver, setMfaResolver] = useState<any>(null);
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [state, action, isPending] = useActionState<LoginState, FormData>(loginUser, null, formKey.toString());

  const loginErrorToastShown = useRef(false);
  const isRedirecting = useRef(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setEmail("");
    setPassword("");
    setMfaInProgress(false);
    setVerificationCode("");
    loginErrorToastShown.current = false;
    isRedirecting.current = false;
    emailInputRef.current?.focus();
    resetRecaptchaVerifier(); // Reset the recaptcha verifier
  }

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      // Reset error state when user types
      if (state?.message && !state.success) {
        setFormKey(prev => prev + 1);
        loginErrorToastShown.current = false;
      }
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // If we're in MFA verification mode, handle that instead
    if (mfaInProgress) {
      handleMfaVerification();
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("isRegistration", "false");
    startTransition(() => {
      action(formData);
    });
  };

  // Handle MFA verification
  const handleMfaVerification = async () => {
    if (!verificationCode) {
      toast.error("Please enter the verification code");
      return;
    }

    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

      // Complete sign-in with MFA
      const userCredential = await mfaResolver.resolveSignIn(multiFactorAssertion);

      // Get the token and continue with NextAuth
      const idToken = await userCredential.user.getIdToken();
      const signInResult = await signInWithNextAuth({ idToken });

      if (!signInResult.success) throw new Error("NextAuth sign-in failed");

      await update();
      toast.success("Login successful!");
      router.push("/");
    } catch (error) {
      console.error("[MFA] Error during verification:", error);
      toast.error(isFirebaseError(error) ? firebaseError(error) : "Failed to verify code");
      setVerificationCode("");
      resetRecaptchaVerifier(); // Reset on error
    }
  };

  useEffect(() => {
    if (!state || loginErrorToastShown.current) return;

    if (state.success) {
      toast.success(state.message || "Login successful!");
      loginErrorToastShown.current = true;
      isRedirecting.current = true;

      const handleRedirect = async () => {
        try {
          if (!navigator.onLine) throw new Error("You are offline");
          if (!auth || !state.data?.customToken) throw new Error("Missing auth or customToken");

          try {
            const userCredential = await signInWithCustomToken(auth, state.data.customToken);
            const idToken = await userCredential.user.getIdToken();
            const signInResult = await signInWithNextAuth({ idToken });

            if (!signInResult.success) throw new Error("NextAuth sign-in failed");

            await update();
            router.push("/");
          } catch (error) {
            // Check if this is a MFA required error
            if (isFirebaseError(error) && error.code === "auth/multi-factor-auth-required") {
              // Handle MFA challenge
              const resolver = getMultiFactorResolver(auth, error as import("firebase/auth").MultiFactorError);
              setMfaResolver(resolver);
              setMfaInProgress(true);

              // Get the recaptchaVerifier instance
              const recaptchaVerifier = getRecaptchaVerifier();
              // Make sure we have a valid recaptchaVerifier before proceeding
              if (!recaptchaVerifier) {
                throw new Error("RecaptchaVerifier not initialized");
              }

              // Send verification code to the user's phone
              const phoneInfoOptions = {
                multiFactorHint: resolver.hints[0],
                session: resolver.session
              };

              const phoneAuthProvider = new PhoneAuthProvider(auth);
              const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);

              setVerificationId(verificationId);
              isRedirecting.current = false;
              loginErrorToastShown.current = false;
              toast.info("Please enter the verification code sent to your phone");
            } else {
              throw error; // Re-throw for the catch block below
            }
          }
        } catch (error) {
          console.error("[LOGIN] Error during redirect:", error);
          toast.error(isFirebaseError(error) ? firebaseError(error) : "An error occurred during login");
          loginErrorToastShown.current = false;
          isRedirecting.current = false;
          resetRecaptchaVerifier(); // Reset on error
        }
      };

      handleRedirect();
    } else if (state.message && !state.success && !loginErrorToastShown.current) {
      // Handle initial login action failure (e.g., wrong password before custom token generation)
      loginErrorToastShown.current = true;
      toast.error(state.message || "Login failed.");
    }
  }, [state, router, update, auth]);

  return (
    <div className={`w-full ${className}`} {...props}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {state?.message && !state.success && !mfaInProgress && (
          <Alert variant="destructive">
            <AlertCircle className="h-6 w-6" />
            <AlertDescription className="text-base">{state.message}</AlertDescription>
          </Alert>
        )}

        {mfaInProgress ? (
          // 2FA Verification UI
          <div className="space-y-6">
            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
              <ShieldCheck className="h-5 w-5" />
              <AlertDescription className="text-base">
                Two-factor authentication is enabled for your account. Please enter the verification code sent to your
                phone.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="verificationCode" className="text-base font-semibold uppercase tracking-wide">
                Verification Code
              </Label>
              <Input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
                autoComplete="one-time-code"
              />
            </div>

            <SubmitButton isLoading={isPending} loadingText="Verifying..." className="w-full h-14 text-lg font-bold">
              Verify & Sign In
            </SubmitButton>

            <Button
              type="button"
              variant="outline"
              className="w-full h-14 text-lg"
              onClick={() => {
                setMfaInProgress(false);
                setVerificationCode("");
                resetForm();
              }}>
              Cancel
            </Button>
          </div>
        ) : (
          // Regular Login UI
          <>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold uppercase tracking-wide">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                ref={emailInputRef}
                value={email}
                onChange={handleInputChange(setEmail)}
                placeholder="Enter your email"
                className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base font-semibold uppercase tracking-wide">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm text-primary font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  placeholder="Enter your password"
                  className="h-14 text-lg px-4 pr-12 border-input focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center justify-center text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
        )}

        <div id="recaptcha-container" className="mt-4"></div>

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
