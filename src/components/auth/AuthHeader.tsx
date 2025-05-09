import { Logo } from "@/components/header/Logo";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <>
      <div className="flex justify-center">
        <Link href="/" className="flex items-center gap-2 font-medium text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Logo className="h-5 w-5" />
          </div>
          <span>MotoStix</span>
        </Link>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>}
      </div>
    </>
  );
}
