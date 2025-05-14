"use client"

import { useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearch } from "@/contexts/SearchContext"

interface SearchTriggerProps {
  className?: string
  shortcut?: boolean
}

export function SearchTrigger({ className, shortcut = true }: SearchTriggerProps) {
  const { openSearch } = useSearch()

  // Add keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    if (!shortcut) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        openSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [openSearch, shortcut])

  return (
    <Button variant="outline" size="sm" className={className} onClick={openSearch}>
      <Search className="h-4 w-4 mr-2" />
      <span>Search</span>
      {shortcut && (
        <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">{navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}</span>K
        </kbd>
      )}
    </Button>
  )
}
