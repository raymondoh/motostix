// src/firebase/utils/firestore.ts

// Remove the unused imports and functions:
// - adminDateToTimestamp
// - adminTimestampToDate
// - clientDateToTimestamp
// - clientTimestampToDate

// Keep only the convertTimestamps function (which might be used)

/**
 * Recursively converts Firestore Timestamp objects to ISO strings
 */
export function convertTimestamps(obj: unknown): unknown {
  if (typeof obj === "object" && obj !== null && "toDate" in obj && typeof (obj as any).toDate === "function") {
    return (obj as { toDate: () => Date }).toDate().toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps);
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([key, value]) => [key, convertTimestamps(value)])
    );
  }

  return obj;
}
