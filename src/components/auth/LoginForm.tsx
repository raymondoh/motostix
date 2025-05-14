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
// import type { LoginState } from "@/types/auth";
// import { GoogleAuthButton } from "@/components";
// import { CloseButton } from "@/components";
// import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
// import { SubmitButton } from "../shared/SubmitButton";

// export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
//   const router = useRouter();
//   const { update } = useSession();

//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [formKey, setFormKey] = useState("0");

//   const [state, action, isPending] = useActionState<LoginState, FormData>(loginUser, null, formKey);

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

//     if (state.success) {
//       toast.success("Login successful!");
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
//     } else if (state.error && !loginErrorToastShown.current) {
//       loginErrorToastShown.current = true;
//       toast.error(state.error || "Login failed.");
//       resetForm(); // Reset inputs on error
//     }
//   }, [state, router, update]);

//   return (
//     <div className={`w-full ${className}`} {...props}>
//       <div className="relative py-8 sm:py-10">
//         <div className="absolute right-0 top-4 z-10">
//           <CloseButton />
//         </div>

//         {state?.error && (
//           <Alert variant="destructive" className="mb-8">
//             <AlertCircle className="h-6 w-6" />
//             <AlertDescription className="text-lg">{state.error}</AlertDescription>
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
"use client";

import type React from "react";
import { useState, useEffect, useRef, startTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase/client/firebase-client-init";
import { loginUser } from "@/actions/auth";
import { signInWithNextAuth } from "@/firebase/client/next-auth";
import type { LoginResponse } from "@/types/auth/login";
import { GoogleAuthButton } from "@/components";
import { CloseButton } from "@/components";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
import { SubmitButton } from "../shared/SubmitButton";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { update } = useSession();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formKey, setFormKey] = useState(0);

  const [state, action, isPending] = useActionState<LoginResponse, FormData>(loginUser, null, formKey.toString());

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

    console.log("Login state:", state); // For debugging

    if (state.success) {
      toast.success(state.message || "Login successful!");
      loginErrorToastShown.current = true;
      isRedirecting.current = true;

      const handleRedirect = async () => {
        try {
          if (!navigator.onLine) throw new Error("You are offline");
          if (!auth || !state.data?.customToken) throw new Error("Missing auth or customToken");

          const userCredential = await signInWithCustomToken(auth, state.data.customToken);
          const idToken = await userCredential.user.getIdToken();
          const signInResult = await signInWithNextAuth({ idToken });

          if (!signInResult.success) throw new Error("NextAuth sign-in failed");

          await update();
          router.push("/");
        } catch (error) {
          console.error("[LOGIN] Error during redirect:", error);
          toast.error(isFirebaseError(error) ? firebaseError(error) : "An error occurred during login");
          loginErrorToastShown.current = false;
          isRedirecting.current = false;
        }
      };

      handleRedirect();
    } else if (state.message && !state.success && !loginErrorToastShown.current) {
      loginErrorToastShown.current = true;
      toast.error(state.message || "Login failed.");
    }
  }, [state, router, update]);

  return (
    <div className={`w-full ${className}`} {...props}>
      <div className="relative py-8 sm:py-10">
        <div className="absolute right-0 top-4 z-10">
          <CloseButton />
        </div>

        {state?.message && !state.success && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-6 w-6" />
            <AlertDescription className="text-lg">{state.message}</AlertDescription>
          </Alert>
        )}

        <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-base font-semibold uppercase tracking-wide">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-base text-muted-foreground hover:text-primary hover:underline">
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

          <SubmitButton
            isLoading={isPending || isRedirecting.current}
            loadingText={isRedirecting.current ? "Redirecting..." : "Logging in..."}
            className="w-full h-14 text-lg font-bold">
            Login
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
            <GoogleAuthButton mode="signin" className="mt-4 h-12 text-base font-medium" />
          </div>
        </form>
      </div>

      <div className="py-8 flex justify-center border-t">
        <p className="text-base text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
