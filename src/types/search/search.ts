import type { ActionResponse } from "@/types";

export interface SearchResult {
  id: string;
  [key: string]: any;
}

export interface SearchResponse extends ActionResponse {
  results: SearchResult[];
  message?: string;
}
