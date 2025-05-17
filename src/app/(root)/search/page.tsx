import { Suspense } from "react";
import { SearchProvider } from "@/contexts/SearchContext";
import { SearchDataLoader } from "@/components/search/search-data-loader";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import { Loader2 } from "lucide-react";

function SearchFallback() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-lg">Loading search results...</p>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <SearchProvider>
      <SearchDataLoader
        collections={["users", "products", "posts"]}
        searchFields={["name", "title", "description", "email", "tags"]}
      />
      <Suspense fallback={<SearchFallback />}>
        <SearchPageClient />
      </Suspense>
    </SearchProvider>
  );
}
