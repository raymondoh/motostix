"use client"

import { useEffect, useRef } from "react"
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore"
import { db } from "@/firebase/client/firebase-client-init"
import { useSearch } from "@/contexts/SearchContext"

interface SearchDataLoaderProps {
  collections: string[]
  maxItems?: number
  searchFields?: string[]
}

export function SearchDataLoader({
  collections,
  maxItems = 500,
  searchFields = ["name", "title", "description", "email"],
}: SearchDataLoaderProps) {
  const { setSearchableData } = useSearch()
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Only fetch data once
    if (hasLoadedRef.current) return
    
    async function fetchData() {
      try {
        const allData: any[] = []

        // Fetch data from each collection
        for (const collectionName of collections) {
          const dataQuery = query(collection(db, collectionName), orderBy("createdAt", "desc"), limit(maxItems))

          const snapshot = await getDocs(dataQuery)
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            _collection: collectionName, // Add collection name for routing
            type: collectionName.slice(0, -1), // Remove 's' from end for type (e.g., "users" -> "user")
            ...doc.data(),
          }))

          allData.push(...items)
        }

        console.log(`Loaded ${allData.length} items for search`)

        // Update search context with fetched data
        setSearchableData(allData, {
          keys: searchFields,
          threshold: 0.3,
          includeMatches: true,
          ignoreLocation: true,
        })
        
        // Mark as loaded
        hasLoadedRef.current = true
      } catch (err) {
        console.error("Error fetching search data:", err)
      }
    }

    fetchData()
  }, []) // Empty dependency array to run only once on mount

  // This component doesn't render anything
  return null
}