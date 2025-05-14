"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Fuse from "fuse.js"
import { useDebounce } from "@/hooks/use-debounce"

// Define the shape of a search result
export interface SearchResult {
  id: string
  [key: string]: any
}

// Define the context type
interface SearchContextType {
  // Search state
  query: string
  results: SearchResult[]
  isSearching: boolean
  isOpen: boolean
  selectedIndex: number

  // Search actions
  setQuery: (query: string) => void
  clearSearch: () => void
  openSearch: () => void
  closeSearch: () => void

  // Navigation
  selectNextResult: () => void
  selectPrevResult: () => void
  selectResult: (index: number) => void
  navigateToSelected: () => void
  navigateToResult: (result: SearchResult) => void

  // Data management
  setSearchableData: (data: any[], options?: Fuse.IFuseOptions<any>) => void
}

// Create the context with default values
const SearchContext = createContext<SearchContextType>({
  query: "",
  results: [],
  isSearching: false,
  isOpen: false,
  selectedIndex: -1,

  setQuery: () => {},
  clearSearch: () => {},
  openSearch: () => {},
  closeSearch: () => {},

  selectNextResult: () => {},
  selectPrevResult: () => {},
  selectResult: () => {},
  navigateToSelected: () => {},
  navigateToResult: () => {},

  setSearchableData: () => {},
})

interface SearchProviderProps {
  children: React.ReactNode
  syncWithUrl?: boolean
  searchParam?: string
}

export function SearchProvider({ children, syncWithUrl = false, searchParam = "q" }: SearchProviderProps) {
  // State
  const [query, setQueryState] = useState("")
  const [searchableData, setSearchableData] = useState<any[]>([])
  const [fuseInstance, setFuseInstance] = useState<Fuse<any> | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Hooks
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const debouncedQuery = useDebounce(query, 300)

  // Initialize Fuse instance when searchable data changes
  const initializeFuse = useCallback((data: any[], options?: Fuse.IFuseOptions<any>) => {
    const defaultOptions: Fuse.IFuseOptions<any> = {
      keys: ["name", "title", "description", "email"],
      threshold: 0.3,
      includeMatches: true,
      ignoreLocation: true,
    }

    const fuseOptions = { ...defaultOptions, ...options }
    setFuseInstance(new Fuse(data, fuseOptions))
  }, [])

  // Set searchable data and initialize Fuse
  const handleSetSearchableData = useCallback(
    (data: any[], options?: Fuse.IFuseOptions<any>) => {
      setSearchableData(data)
      initializeFuse(data, options)
    },
    [initializeFuse],
  )

  // Perform search when query changes
  useEffect(() => {
    if (!debouncedQuery || !fuseInstance) {
      setResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Small timeout to show loading state
    const timer = setTimeout(() => {
      const searchResults = fuseInstance.search(debouncedQuery)
      setResults(searchResults.map((result) => result.item))
      setIsSearching(false)
      setSelectedIndex(searchResults.length > 0 ? 0 : -1)
    }, 100)

    return () => clearTimeout(timer)
  }, [debouncedQuery, fuseInstance])

  // Sync URL with search query if enabled
  useEffect(() => {
    if (!syncWithUrl) return

    const currentParams = new URLSearchParams(searchParams.toString())

    if (debouncedQuery) {
      currentParams.set(searchParam, debouncedQuery)
    } else {
      currentParams.delete(searchParam)
    }

    const newQuery = currentParams.toString()
    const queryString = newQuery ? `?${newQuery}` : ""

    // Update URL without full navigation
    router.replace(`${pathname}${queryString}`, { scroll: false })
  }, [debouncedQuery, pathname, router, searchParam, searchParams, syncWithUrl])

  // Set query from URL on initial load if syncWithUrl is enabled
  useEffect(() => {
    if (syncWithUrl && searchParams.has(searchParam)) {
      setQueryState(searchParams.get(searchParam) || "")
    }
  }, [searchParam, searchParams, syncWithUrl])

  // Actions
  const setQuery = useCallback(
    (newQuery: string) => {
      setQueryState(newQuery)
      if (newQuery && !isOpen) {
        setIsOpen(true)
      }
    },
    [isOpen],
  )

  const clearSearch = useCallback(() => {
    setQueryState("")
    setResults([])
    setSelectedIndex(-1)
  }, [])

  const openSearch = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
    // Don't clear the query immediately to avoid UI flicker
    setTimeout(() => {
      if (!syncWithUrl) {
        clearSearch()
      }
    }, 300)
  }, [clearSearch, syncWithUrl])

  // Navigation helpers
  const selectNextResult = useCallback(() => {
    if (results.length === 0) return
    setSelectedIndex((prev) => (prev + 1) % results.length)
  }, [results.length])

  const selectPrevResult = useCallback(() => {
    if (results.length === 0) return
    setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
  }, [results.length])

  const selectResult = useCallback(
    (index: number) => {
      if (index >= 0 && index < results.length) {
        setSelectedIndex(index)
      }
    },
    [results.length],
  )

  const navigateToSelected = useCallback(() => {
    if (selectedIndex >= 0 && selectedIndex < results.length) {
      navigateToResult(results[selectedIndex])
    }
  }, [results, selectedIndex])

  const navigateToResult = useCallback(
    (result: SearchResult) => {
      if (!result) return

      setIsOpen(false)

      // Determine the URL based on the result type
      let url = "/"

      if (result._collection === "users") {
        url = `/user/${result.id}`
      } else if (result._collection === "products") {
        url = `/products/${result.id}`
      } else if (result._collection === "posts") {
        url = `/posts/${result.id}`
      } else if (result.url) {
        url = result.url
      }

      // Navigate to the URL
      router.push(url)
    },
    [router],
  )

  // Context value
  const contextValue = useMemo(
    () => ({
      query,
      results,
      isSearching,
      isOpen,
      selectedIndex,

      setQuery,
      clearSearch,
      openSearch,
      closeSearch,

      selectNextResult,
      selectPrevResult,
      selectResult,
      navigateToSelected,
      navigateToResult,

      setSearchableData: handleSetSearchableData,
    }),
    [
      query,
      results,
      isSearching,
      isOpen,
      selectedIndex,
      setQuery,
      clearSearch,
      openSearch,
      closeSearch,
      selectNextResult,
      selectPrevResult,
      selectResult,
      navigateToSelected,
      navigateToResult,
      handleSetSearchableData,
    ],
  )

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}

// Custom hook to use the search context
export function useSearch() {
  const context = useContext(SearchContext)

  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider")
  }

  return context
}
