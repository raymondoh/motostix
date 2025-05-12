export default function AuthLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-12 md:py-16 w-full">
        <div className="container mx-auto px-4">
          <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-border/40 p-8 md:p-10">
            {/* Logo placeholder */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 bg-muted rounded-full animate-pulse"></div>
                <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
              </div>
            </div>

            {/* Header placeholder */}
            <div className="flex flex-col items-center space-y-4 mb-8">
              <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
              <div className="w-12 h-0.5 bg-muted animate-pulse"></div>
              <div className="h-4 w-72 bg-muted rounded animate-pulse"></div>
            </div>

            {/* Form fields placeholder */}
            <div className="space-y-6 mt-8">
              <div className="space-y-2">
                <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
              </div>

              {/* Button placeholder */}
              <div className="h-10 w-full bg-black/20 dark:bg-white/20 rounded-full animate-pulse mt-8"></div>

              {/* Links placeholder */}
              <div className="flex justify-center mt-4">
                <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
