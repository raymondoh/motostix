// app/search/page.tsx
"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSearch } from "@/contexts/SearchContext"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Loader2 } from 'lucide-react'

export default function SearchPage() {
  const { query, setQuery, results, isSearching } = useSearch()
  const searchParams = useSearchParams()

  // Initialize search from URL query parameter
  useEffect(() => {
    const q = searchParams.get("q")
    if (q) {
      setQuery(q)
    }
  }, [searchParams, setQuery])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <div className="relative max-w-2xl mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for users, products, posts..."
          className="pl-10 pr-10 h-12 text-lg"
        />
        {query && (
          <Button variant="ghost" size="sm" onClick={() => setQuery("")} className="absolute right-0 top-0 h-full px-3">
            <X className="h-5 w-5" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {/* Search results rendering */}
      {isSearching ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((result) => (
            <Card key={`${result._collection}-${result.id}`} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                {/* Result content */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {result.name?.charAt(0) || result.title?.charAt(0) || "#"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{result.name || result.title}</h3>
                    {result.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{result.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}