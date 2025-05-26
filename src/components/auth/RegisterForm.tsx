// "use client";

// import type React from "react";
// import { useState, useEffect, useRef, startTransition, useActionState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Eye, EyeOff, AlertCircle, Info } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
// import { SubmitButton } from "@/components/shared/SubmitButton";
// import { GoogleAuthButton } from "@/components";
// import { toast } from "sonner";
// import { useSession } from "next-auth/react";
// import { auth } from "@/firebase/client/firebase-client-init";
// import { sendEmailVerification, signInWithCustomToken } from "firebase/auth";
// import { getVerificationSettings } from "@/firebase/client/auth";
// import { signInWithNextAuth } from "@/firebase/client/next-auth";
// import { firebaseError, isFirebaseError } from "@/utils/firebase-error";
// import { registerUser, loginUser } from "@/actions/auth";
// import type { RegisterState } from "@/types/auth/register";
// import type { LoginState } from "@/types/auth/login";

// export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
//   const router = useRouter();
//   const { update } = useSession();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoggingIn, setIsLoggingIn] = useState(false);
//   const [formKey, setFormKey] = useState(0);

//   const emailInputRef = useRef<HTMLInputElement>(null);
//   const registrationToastShown = useRef(false);
//   const errorToastShown = useRef(false);
//   const isRedirecting = useRef(false);
//   const verificationEmailSent = useRef(false);
//   const signInAttempted = useRef(false);

//   const [state, action, isPending] = useActionState<RegisterState, FormData>(registerUser, null, formKey.toString());
//   const [loginState, isLoginPending] = useActionState<LoginState, FormData>(loginUser, null);

//   function handleInputChange(setter: React.Dispatch<React.SetStateAction<string>>) {
//     return (e: React.ChangeEvent<HTMLInputElement>) => {
//       setter(e.target.value);
//       // Reset error state when user types
//       if ((state?.message && !state.success) || state?.error) {
//         setFormKey(prev => prev + 1);
//         errorToastShown.current = false;
//       }
//     };
//   }

//   useEffect(() => {
//     return () => {
//       registrationToastShown.current = false;
//       errorToastShown.current = false;
//       signInAttempted.current = false;
//       isRedirecting.current = false;
//       verificationEmailSent.current = false;
//     };
//   }, []);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", email.split("@")[0]);
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("confirmPassword", confirmPassword);
//     startTransition(() => action(formData));
//   };

//   useEffect(() => {
//     if (!state || registrationToastShown.current || errorToastShown.current) return;

//     console.log("Registration state:", state); // For debugging

//     if (state.success) {
//       registrationToastShown.current = true;
//       toast.success(state.message || "Registration successful! Please verify your email.");

//       const verifyFlow = async () => {
//         if (signInAttempted.current) return;
//         signInAttempted.current = true;
//         setIsLoggingIn(true);

//         try {
//           const loginFormData = new FormData();
//           loginFormData.append("email", email);
//           loginFormData.append("password", password);
//           loginFormData.append("isRegistration", "true");
//           loginFormData.append("skipSession", "true");

//           if (state.data?.role) loginFormData.append("role", state.data.role);
//           if (state.data?.userId) loginFormData.append("id", state.data.userId);

//           const loginResult = await loginUser(null, loginFormData);

//           if (loginResult?.success && loginResult.data?.customToken) {
//             const userCredential = await signInWithCustomToken(auth, loginResult.data.customToken);
//             const user = userCredential.user;

//             if (user && !verificationEmailSent.current) {
//               verificationEmailSent.current = true;
//               await sendEmailVerification(user, getVerificationSettings());
//               toast.info("Verification email sent.");
//               router.push("/verify-email");
//             }
//           } else {
//             toast.error("Could not complete registration.");
//           }
//         } catch (err) {
//           toast.error(isFirebaseError(err) ? firebaseError(err) : "Verification failed");
//         } finally {
//           setIsLoggingIn(false);
//         }
//       };

//       verifyFlow();
//     } else if ((state.message && !state.success) || state.error) {
//       errorToastShown.current = true;
//       toast.error(state.message || state.error || "Registration failed");
//     }
//   }, [state, email, password, router]);

//   useEffect(() => {
//     if (verificationEmailSent.current) return;

//     if (loginState?.success && !isRedirecting.current) {
//       isRedirecting.current = true;

//       const handleRedirect = async () => {
//         try {
//           if (loginState.data?.customToken) {
//             const userCredential = await signInWithCustomToken(auth, loginState.data.customToken);
//             const idToken = await userCredential.user.getIdToken();
//             const signInResult = await signInWithNextAuth({ idToken });

//             if (!signInResult.success) throw new Error("NextAuth sign-in failed");

//             toast.success("You're now logged in!");
//             await update();
//             router.push("/");
//           } else {
//             await update();
//             router.push("/");
//           }
//         } catch (error: unknown) {
//           console.error("[REGISTER] Token exchange failed:", error);
//           const msg = isFirebaseError(error) ? firebaseError(error) : "Login failed. Please try again.";
//           toast.error(msg);
//           isRedirecting.current = false;
//           router.push("/login");
//         }
//       };

//       handleRedirect();
//     } else if (loginState?.message && !loginState.success && !errorToastShown.current) {
//       errorToastShown.current = true;
//       toast.error(`Login failed: ${loginState.message}`);
//       router.push("/login");
//     }
//   }, [loginState, update, router]);

//   return (
//     <div className={`w-full ${className}`} {...props}>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {((state?.message && !state.success) || state?.error) && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-6 w-6" />
//             <AlertDescription className="text-base">{state.message || state.error}</AlertDescription>
//           </Alert>
//         )}

//         <div className="space-y-2">
//           <Label htmlFor="email" className="text-base font-semibold uppercase tracking-wide">
//             Email
//           </Label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             required
//             ref={emailInputRef}
//             value={email}
//             onChange={handleInputChange(setEmail)}
//             placeholder="Enter your email"
//             className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//           />
//         </div>

//         <div className="space-y-2">
//           <div className="flex items-center gap-1">
//             <Label htmlFor="password" className="text-base font-semibold uppercase tracking-wide">
//               Password
//             </Label>
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground">
//                     <Info className="h-4 w-4" />
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent className="max-w-xs p-4 text-sm">
//                   Must be 8–72 characters, include uppercase, lowercase, number, and a symbol.
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//           <div className="relative">
//             <Input
//               id="password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               required
//               value={password}
//               onChange={handleInputChange(setPassword)}
//               placeholder="Enter your password"
//               className="h-14 text-lg px-4 pr-12 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 px-4 flex items-center justify-center text-muted-foreground"
//               aria-label={showPassword ? "Hide password" : "Show password"}>
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="confirmPassword" className="text-base font-semibold uppercase tracking-wide">
//             Confirm Password
//           </Label>
//           <div className="relative">
//             <Input
//               id="confirmPassword"
//               name="confirmPassword"
//               type={showConfirmPassword ? "text" : "password"}
//               required
//               value={confirmPassword}
//               onChange={handleInputChange(setConfirmPassword)}
//               placeholder="Enter your password again"
//               className="h-14 text-lg px-4 pr-12 border-input focus:ring-2 focus:ring-primary focus:border-primary"
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute inset-y-0 right-0 px-4 flex items-center justify-center text-muted-foreground"
//               aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
//               {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>

//         <SubmitButton
//           isLoading={isPending || isLoggingIn}
//           loadingText="Creating account..."
//           className="w-full h-14 text-lg font-bold">
//           Sign up
//         </SubmitButton>

//         <div className="my-10">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t border-muted" />
//             </div>
//             <div className="relative flex justify-center">
//               <span className="bg-background px-4 text-sm text-muted-foreground">Or continue with</span>
//             </div>
//           </div>
//           <GoogleAuthButton
//             mode="signup"
//             className="mt-4 h-14 text-base font-medium bg-secondary hover:bg-secondary/80 text-white dark:text-white transition-colors"
//           />
//         </div>

//         <div className="pt-6 text-center">
//           <p className="text-base text-muted-foreground">
//             Already have an account?{" "}
//             <Link href="/login" className="font-semibold text-primary hover:underline">
//               Sign in
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { UniversalInput } from "@/components/forms/UniversalInput";
import { UniversalPasswordInput } from "@/components/forms/UniversalPasswordInput";
import type { RegisterResponse } from "@/types/auth/register";

type RegisterState = RegisterResponse | null;

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formKey, setFormKey] = useState(0);

  // Validation states
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const [state, action, isPending] = useActionState<RegisterState, FormData>(registerUser, null, formKey.toString());

  const registerErrorToastShown = useRef(false);
  const isRedirecting = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setConfirmPasswordError(null);
    registerErrorToastShown.current = false;
    isRedirecting.current = false;
    nameInputRef.current?.focus();
  }

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value);
    // Reset error state when user types
    if (state?.message && !state.success) {
      setFormKey(prev => prev + 1);
      registerErrorToastShown.current = false;
    }
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const error = validatePassword(value);
    setPasswordError(error);

    // Also check confirm password if it's filled
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password && value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate passwords before submission
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      toast.error("Please fix password requirements");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("isRegistration", "true");

    startTransition(() => {
      action(formData);
    });
  };

  useEffect(() => {
    if (!state || registerErrorToastShown.current) return;

    if (state.success) {
      toast.success(state.message || "Account created successfully!");
      registerErrorToastShown.current = true;
      isRedirecting.current = true;

      // Pattern 1: Redirect to login page after successful registration
      setTimeout(() => {
        const successMessage = encodeURIComponent("Account created successfully! Please sign in to continue.");
        router.push(`/login?message=${successMessage}&email=${encodeURIComponent(email)}`);
      }, 2000);
    } else if (state.message && !state.success && !registerErrorToastShown.current) {
      registerErrorToastShown.current = true;
      toast.error(state.message || "Registration failed.");
    }
  }, [state, router, email]);

  return (
    <div className={`w-full ${className}`} {...props}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {state?.message && !state.success && (
          <Alert variant="destructive">
            <AlertCircle className="h-6 w-6" />
            <AlertDescription className="text-base">{state.message}</AlertDescription>
          </Alert>
        )}

        <UniversalInput
          id="name"
          label="Full Name"
          value={name}
          onChange={handleInputChange(setName)}
          placeholder="Enter your full name"
          required
          ref={nameInputRef}
        />

        <UniversalInput
          id="email"
          label="Email"
          value={email}
          onChange={handleInputChange(setEmail)}
          type="email"
          placeholder="Enter your email"
          required
        />

        <UniversalPasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Create a strong password"
          required
          error={passwordError}
          helpText="Must be at least 8 characters with uppercase, lowercase, and number"
        />

        <UniversalPasswordInput
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm your password"
          required
          error={confirmPasswordError}
        />

        <SubmitButton
          isLoading={isPending || isRedirecting.current}
          loadingText={isRedirecting.current ? "Redirecting to login..." : "Creating account..."}
          className="w-full h-14 text-lg font-bold"
          disabled={!!passwordError || !!confirmPasswordError}>
          Create Account
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
            mode="signup"
            className="mt-4 h-14 text-base font-medium bg-secondary hover:bg-secondary/80 text-white dark:text-white transition-colors"
          />
        </div>

        <div className="pt-6 text-center">
          <p className="text-base text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
