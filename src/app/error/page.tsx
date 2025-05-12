import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <main className="min-h-screen">
      <section className="py-12 md:py-16 w-full bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto">
            {/* Error Icon and Circle */}
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>

            {/* Heading and Description */}
            <div className="flex flex-col items-center space-y-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">Something Went Wrong</h1>
              <div className="w-12 h-0.5 bg-primary"></div>
              <p className="text-muted-foreground max-w-md text-lg">
                An unexpected error occurred. Our team has been notified and is working to fix the issue.
              </p>
            </div>

            {/* Error Code */}
            <div className="text-8xl font-bold text-gray-100 dark:text-gray-800 mb-8">500</div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>

              <Button variant="outline" className="rounded-full" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
