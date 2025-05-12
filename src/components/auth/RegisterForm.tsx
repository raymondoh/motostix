// "use client";

// import type React from "react";
// import type { RegisterState } from "@/types/auth";
// import { useState, useEffect, startTransition, useRef } from "react";
// import { useActionState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Eye, EyeOff, AlertCircle, Info } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { registerUser, loginUser } from "@/actions/auth";
// import { useSession } from "next-auth/react";
// import { auth } from "@/firebase/client/firebase-client-init";
// import { signInWithCustomToken, sendEmailVerification } from "firebase/auth";
// import { getVerificationSettings } from "@/firebase/client/auth";
// import { signInWithNextAuth } from "@/firebase/client/next-auth";
// import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
// import { CloseButton } from "@/components";
// import { firebaseError, isFirebaseError } from "@/utils/firebase-error";
// import { SubmitButton } from "../shared/SubmitButton";

// export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
//   const router = useRouter();
//   const { update } = useSession();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoggingIn, setIsLoggingIn] = useState(false);

//   //const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
//   const emailInputRef = useRef<HTMLInputElement>(null);
//   const registrationToastShown = useRef(false);
//   const errorToastShown = useRef(false);
//   const signInAttempted = useRef(false);
//   const isRedirecting = useRef(false);
//   const verificationEmailSent = useRef(false);
//   const [state, action, isPending] = useActionState<RegisterState, FormData>(registerUser, null);
//   const [loginState, isLoginPending] = useActionState(loginUser, null);

//   useEffect(() => {
//     return () => {
//       registrationToastShown.current = false;
//       errorToastShown.current = false;
//       signInAttempted.current = false;
//       isRedirecting.current = false;
//       verificationEmailSent.current = false;
//     };
//   }, []);

//   function resetForm() {
//     setEmail("");
//     setPassword("");
//     setConfirmPassword("");

//     registrationToastShown.current = false;
//     errorToastShown.current = false;
//     signInAttempted.current = false;
//     isRedirecting.current = false;
//     verificationEmailSent.current = false;

//     // ✨ Focus back on email field
//     emailInputRef.current?.focus();
//   }

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", email.split("@")[0]);
//     formData.append("email", email);
//     formData.append("password", password);
//     formData.append("confirmPassword", confirmPassword);

//     startTransition(() => {
//       action(formData);
//     });
//   };

//   useEffect(() => {
//     if (!state || registrationToastShown.current || errorToastShown.current) return;

//     if (state.success) {
//       registrationToastShown.current = true;
//       toast.success("Registration successful! Please verify your email.");

//       const handleSignInForVerification = async () => {
//         if (signInAttempted.current) return;

//         signInAttempted.current = true;
//         setIsLoggingIn(true);

//         try {
//           await new Promise(resolve => setTimeout(resolve, 3000));

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

//               try {
//                 await sendEmailVerification(user, getVerificationSettings());
//                 toast.info("Verification email sent. Check your inbox.");
//                 setTimeout(() => router.push("/verify-email"), 1500);
//               } catch (error: unknown) {
//                 console.error("[REGISTER] Email verification failed:", error);
//                 const msg = isFirebaseError(error) ? firebaseError(error) : "Could not send verification email.";
//                 toast.error(msg);
//               }
//             }
//           } else {
//             toast.error("Could not complete registration.");
//           }
//         } catch (error: unknown) {
//           console.error("[REGISTER] Verification flow error:", error);
//           const msg = isFirebaseError(error) ? firebaseError(error) : "An unexpected error occurred.";
//           toast.error(msg);
//         } finally {
//           setIsLoggingIn(false);
//         }
//       };

//       handleSignInForVerification();
//     } else if (state.error && !errorToastShown.current) {
//       errorToastShown.current = true;
//       toast.error(state.error || "Registration failed");
//       window.location.reload();
//     }
//   }, [state, email, password, router]);

//   useEffect(() => {
//     if (verificationEmailSent.current) return;

//     if (loginState?.success && !isRedirecting.current) {
//       isRedirecting.current = true;

//       if (loginState.data?.customToken) {
//         signInWithCustomToken(auth, loginState.data.customToken)
//           .then(async userCredential => {
//             const idToken = await userCredential.user.getIdToken();
//             const signInResult = await signInWithNextAuth({ idToken });

//             if (!signInResult.success) throw new Error("NextAuth sign-in failed");
//             toast.success("You're now logged in!");
//             await update();
//             router.push("/");
//           })
//           .catch((error: unknown) => {
//             console.error("[REGISTER] Token exchange failed:", error);
//             const msg = isFirebaseError(error) ? firebaseError(error) : "Login failed. Please try again.";
//             toast.error(msg);
//             isRedirecting.current = false;
//             router.push("/login");
//           });
//       } else {
//         update().then(() => router.push("/"));
//       }
//     } else if (loginState?.message && !loginState.success && !errorToastShown.current) {
//       errorToastShown.current = true;
//       toast.error(`Login failed: ${loginState.message}`);
//       router.push("/login");
//     }
//   }, [loginState, update, router]);

//   return (
//     <Card className={className} {...props}>
//       <div className="relative">
//         <CardHeader>
//           <div className="absolute right-2 top-2 z-10">
//             <CloseButton />
//           </div>
//           <CardTitle>Register</CardTitle>
//           <CardDescription>Create a new account</CardDescription>
//         </CardHeader>
//       </div>
//       <CardContent>
//         {state?.error && (
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{state.error}</AlertDescription>
//           </Alert>
//         )}

//         <form id="register-form" onSubmit={handleSubmit} className="space-y-8">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               required
//               ref={emailInputRef}
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-1">
//               <Label htmlFor="password">Password</Label>
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground">
//                       <Info className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent className="max-w-xs p-4">
//                     <p className="text-sm">Must be 8–72 chars, 1 uppercase, 1 lowercase, 1 number, and 1 symbol.</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </div>
//             <div className="relative">
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 required
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-3 py-2"
//                 onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </Button>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="confirmPassword">Confirm Password</Label>
//             <div className="relative">
//               <Input
//                 id="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 required
//                 value={confirmPassword}
//                 onChange={e => setConfirmPassword(e.target.value)}
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-3 py-2"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//               </Button>
//             </div>
//             <p className="text-sm text-muted-foreground">Re-enter your password to confirm.</p>
//           </div>

//           <SubmitButton
//             isLoading={isPending}
//             disabled={isRedirecting.current}
//             loadingText="Creating account..."
//             className="w-full">
//             Sign up
//           </SubmitButton>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//               </div>
//             </div>
//             <GoogleAuthButton mode="signup" className="mt-4" />
//           </div>
//         </form>
//       </CardContent>
//       <CardFooter className="flex flex-col items-center gap-4">
//         <p className="text-sm text-muted-foreground">
//           Already have an account?{" "}
//           <Button variant="link" className="p-0 h-auto" asChild>
//             <Link href="/login">Sign in</Link>
//           </Button>
//         </p>
//       </CardFooter>
//     </Card>
//   );
// }
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
// import { CloseButton } from "@/components";
// import { GoogleAuthButton } from "@/components";
// import { toast } from "sonner";
// import { useSession } from "next-auth/react";
// import { auth } from "@/firebase/client/firebase-client-init";
// import { sendEmailVerification, signInWithCustomToken } from "firebase/auth";
// import { getVerificationSettings } from "@/firebase/client/auth";
// import { signInWithNextAuth } from "@/firebase/client/next-auth";
// import { firebaseError, isFirebaseError } from "@/utils/firebase-error";
// import { registerUser, loginUser } from "@/actions/auth";
// import type { RegisterState } from "@/types/auth";

// export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
//   const router = useRouter();
//   const { update } = useSession();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoggingIn, setIsLoggingIn] = useState(false);

//   const emailInputRef = useRef<HTMLInputElement>(null);
//   const registrationToastShown = useRef(false);
//   const errorToastShown = useRef(false);
//   const isRedirecting = useRef(false);
//   const verificationEmailSent = useRef(false);
//   const signInAttempted = useRef(false);

//   const [state, action, isPending] = useActionState<RegisterState, FormData>(registerUser, null);
//   const [loginState, isLoginPending] = useActionState(loginUser, null);

//   function handleInputChange(setter: React.Dispatch<React.SetStateAction<string>>) {
//     return (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value);
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

//     if (state.success) {
//       registrationToastShown.current = true;
//       toast.success("Registration successful! Please verify your email.");

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
//     } else if (state.error && !errorToastShown.current) {
//       errorToastShown.current = true;
//       toast.error(state.error || "Registration failed");
//     }
//   }, [state]);

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
//     <div className={`w-full max-w-xl px-6 sm:px-10 mx-auto ${className}`} {...props}>
//       <div className="relative py-8 sm:py-10">
//         <div className="absolute right-0 top-4 z-10">
//           <CloseButton />
//         </div>

//         {state?.error && (
//           <Alert variant="destructive" className="mb-8 flex items-start gap-3">
//             <AlertCircle className="h-6 w-6 mt-1" />
//             <AlertDescription className="text-base font-medium text-destructive">{state.error}</AlertDescription>
//           </Alert>
//         )}

//         <form id="register-form" onSubmit={handleSubmit} className="space-y-6">
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
//               className="h-14 text-lg px-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary"
//             />
//           </div>

//           <div className="space-y-2">
//             <div className="flex items-center gap-1">
//               <Label htmlFor="password" className="text-base font-semibold uppercase tracking-wide">
//                 Password
//               </Label>
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground">
//                       <Info className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent className="max-w-xs p-4 text-sm">
//                     Must be 8–72 characters, include uppercase, lowercase, number, and a symbol.
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
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
//                 className="h-14 text-lg px-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary"
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-4"
//                 onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
//               </Button>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="confirmPassword" className="text-base font-semibold uppercase tracking-wide">
//               Confirm Password
//             </Label>
//             <div className="relative">
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 required
//                 value={confirmPassword}
//                 onChange={handleInputChange(setConfirmPassword)}
//                 placeholder="••••••••"
//                 className="h-14 text-lg px-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary"
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-4"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
//               </Button>
//             </div>
//           </div>

//           <SubmitButton
//             isLoading={isPending || isLoggingIn}
//             loadingText="Creating account..."
//             className="w-full h-14 text-lg font-bold tracking-wide uppercase">
//             Sign up
//           </SubmitButton>

//           <div className="my-10">
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t border-muted-foreground" />
//               </div>
//               <div className="relative flex justify-center">
//                 <span className="bg-background px-4 text-sm text-muted-foreground">Or continue with</span>
//               </div>
//             </div>
//             <GoogleAuthButton mode="signup" className="mt-4 h-12 text-base font-medium" />
//           </div>
//         </form>
//       </div>

//       <div className="py-8 flex justify-center border-t">
//         <p className="text-base text-muted-foreground">
//           Already have an account?{" "}
//           <Link href="/login" className="font-semibold text-primary hover:underline">
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
"use client";

import type React from "react";
import { useState, useEffect, useRef, startTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { SubmitButton } from "@/components/shared/SubmitButton";
import { CloseButton } from "@/components";
import { GoogleAuthButton } from "@/components";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { auth } from "@/firebase/client/firebase-client-init";
import { sendEmailVerification, signInWithCustomToken } from "firebase/auth";
import { getVerificationSettings } from "@/firebase/client/auth";
import { signInWithNextAuth } from "@/firebase/client/next-auth";
import { firebaseError, isFirebaseError } from "@/utils/firebase-error";
import { registerUser, loginUser } from "@/actions/auth";
import type { RegisterState } from "@/types/auth";

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { update } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const registrationToastShown = useRef(false);
  const errorToastShown = useRef(false);
  const isRedirecting = useRef(false);
  const verificationEmailSent = useRef(false);
  const signInAttempted = useRef(false);

  const [state, action, isPending] = useActionState<RegisterState, FormData>(registerUser, null);
  const [loginState, isLoginPending] = useActionState(loginUser, null);

  function handleInputChange(setter: React.Dispatch<React.SetStateAction<string>>) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value);
  }

  useEffect(() => {
    return () => {
      registrationToastShown.current = false;
      errorToastShown.current = false;
      signInAttempted.current = false;
      isRedirecting.current = false;
      verificationEmailSent.current = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("name", email.split("@")[0]);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    startTransition(() => action(formData));
  };

  useEffect(() => {
    if (!state || registrationToastShown.current || errorToastShown.current) return;

    if (state.success) {
      registrationToastShown.current = true;
      toast.success("Registration successful! Please verify your email.");

      const verifyFlow = async () => {
        if (signInAttempted.current) return;
        signInAttempted.current = true;
        setIsLoggingIn(true);

        try {
          const loginFormData = new FormData();
          loginFormData.append("email", email);
          loginFormData.append("password", password);
          loginFormData.append("isRegistration", "true");
          loginFormData.append("skipSession", "true");

          if (state.data?.role) loginFormData.append("role", state.data.role);
          if (state.data?.userId) loginFormData.append("id", state.data.userId);

          const loginResult = await loginUser(null, loginFormData);

          if (loginResult?.success && loginResult.data?.customToken) {
            const userCredential = await signInWithCustomToken(auth, loginResult.data.customToken);
            const user = userCredential.user;

            if (user && !verificationEmailSent.current) {
              verificationEmailSent.current = true;
              await sendEmailVerification(user, getVerificationSettings());
              toast.info("Verification email sent.");
              router.push("/verify-email");
            }
          } else {
            toast.error("Could not complete registration.");
          }
        } catch (err) {
          toast.error(isFirebaseError(err) ? firebaseError(err) : "Verification failed");
        } finally {
          setIsLoggingIn(false);
        }
      };

      verifyFlow();
    } else if (state.error && !errorToastShown.current) {
      errorToastShown.current = true;
      toast.error(state.error || "Registration failed");
    }
  }, [state]);

  useEffect(() => {
    if (verificationEmailSent.current) return;

    if (loginState?.success && !isRedirecting.current) {
      isRedirecting.current = true;

      const handleRedirect = async () => {
        try {
          if (loginState.data?.customToken) {
            const userCredential = await signInWithCustomToken(auth, loginState.data.customToken);
            const idToken = await userCredential.user.getIdToken();
            const signInResult = await signInWithNextAuth({ idToken });

            if (!signInResult.success) throw new Error("NextAuth sign-in failed");

            toast.success("You're now logged in!");
            await update();
            router.push("/");
          } else {
            await update();
            router.push("/");
          }
        } catch (error: unknown) {
          console.error("[REGISTER] Token exchange failed:", error);
          const msg = isFirebaseError(error) ? firebaseError(error) : "Login failed. Please try again.";
          toast.error(msg);
          isRedirecting.current = false;
          router.push("/login");
        }
      };

      handleRedirect();
    } else if (loginState?.message && !loginState.success && !errorToastShown.current) {
      errorToastShown.current = true;
      toast.error(`Login failed: ${loginState.message}`);
      router.push("/login");
    }
  }, [loginState, update, router]);

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="relative py-8 sm:py-10">
        <div className="absolute right-0 top-4 z-10">
          <CloseButton />
        </div>

        {state?.error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-6 w-6" />
            <AlertDescription className="text-lg">{state.error}</AlertDescription>
          </Alert>
        )}

        <form id="register-form" onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="name@example.com"
              className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="password" className="text-base font-semibold uppercase tracking-wide">
                Password
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0 text-muted-foreground">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-4 text-sm">
                    Must be 8–72 characters, include uppercase, lowercase, number, and a symbol.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="••••••••"
                className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-base font-semibold uppercase tracking-wide">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                placeholder="••••••••"
                className="h-14 text-lg px-4 border-input focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-4 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          <SubmitButton
            isLoading={isPending || isLoggingIn}
            loadingText="Creating account..."
            className="w-full h-14 text-lg font-bold">
            Sign up
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
            <GoogleAuthButton mode="signup" className="mt-4 h-12 text-base font-medium" />
          </div>
        </form>
      </div>

      <div className="py-8 flex justify-center border-t">
        <p className="text-base text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
