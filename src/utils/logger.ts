// src/utils/logger.ts

import { Timestamp } from "firebase-admin/firestore";
// Assuming adminDb is correctly exported as a function from your init file
import { adminDb as getAdminDbInstance } from "@/firebase/admin/firebase-admin-init";

export type LogLevel =
  | "info"
  | "warn"
  | "error"
  | "debug"
  | `auth:${string}`
  | `admin:${string}`
  | `deletion:${string}`
  | `data-privacy:${string}`
  | `order:${string}`
  | `stripe:${string}`;

export interface LogEntry<T extends Record<string, unknown> = Record<string, unknown>> {
  type: LogLevel;
  message: string;
  userId?: string;
  metadata?: T;
  context?: string; // e.g., "auth", "products"
}

// Base logger: always logs to console
export function logger({ type, message, metadata, context = "general" }: Omit<LogEntry, "userId">): void {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${type.toUpperCase()}] [${context}] ${message}`;
  const hasMetadata = metadata && Object.keys(metadata).length > 0;

  switch (type) {
    case "error":
      if (hasMetadata) {
        console.error(formattedMessage, metadata);
      } else {
        console.error(formattedMessage);
      }
      break;
    case "warn":
      if (hasMetadata) {
        console.warn(formattedMessage, metadata);
      } else {
        console.warn(formattedMessage);
      }
      break;
    // All other LogLevel types (info, debug, auth:..., admin:..., etc.) will use console.log
    case "info":
    case "debug":
    default: // Includes your template literal types
      if (hasMetadata) {
        console.log(formattedMessage, metadata);
      } else {
        console.log(formattedMessage);
      }
      break;
  }
}

// Firestore logger: logs to Firestore + console
export async function logServerEvent({
  type,
  message,
  userId,
  metadata = {},
  context = "general"
}: LogEntry): Promise<void> {
  try {
    const db = getAdminDbInstance(); // Call the getter function
    const log = {
      type,
      message,
      context,
      userId: userId || null,
      metadata,
      timestamp: Timestamp.now() // Use Firestore Timestamp for server logs
    };

    // Ensure db is valid before using it
    if (db && typeof db.collection === "function") {
      await db.collection("serverLogs").add(log);
    } else {
      // Fallback to console error if db is not available
      console.error("[LOGGER_ERROR] Firestore instance (adminDb) is not available. Log not saved to Firestore.", log);
    }

    // Also log to console (especially in development or if specified)
    // You might want to always log to console regardless of Firestore success for server events
    // Or make it conditional based on environment or log type
    logger({ type, message, metadata, context }); // This will use the updated logger above
  } catch (error) {
    // Log the original error to console first if Firestore logging itself fails
    logger({
      type: "error",
      message: "[LOGGER_ERROR] Failed to write log to Firestore.",
      metadata: {
        originalLogType: type,
        originalMessage: message,
        originalContext: context,
        errorDetails: error instanceof Error ? error.message : String(error)
      },
      context: "logger-firestore"
    });
    // Also attempt to log the original event to console as a fallback
    logger({ type, message, metadata, context });
  }
}
