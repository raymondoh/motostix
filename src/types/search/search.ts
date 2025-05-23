// src/types/search/search.ts
import type { Common } from "@/types"; // Correctly importing the Common namespace

export interface SearchResult {
  id: string;
  [key: string]: any;
}

// You need to use Common.ActionResponse here
export interface SearchResponse extends Common.ActionResponse {
  // Changed from ActionResponse to Common.ActionResponse
  results: SearchResult[];
  message?: string;
}

// If you have other types that use ActionResponse, they also need the Common prefix:
export type AnotherSearchAction = Common.ActionResponse<{ someData: string }>;
