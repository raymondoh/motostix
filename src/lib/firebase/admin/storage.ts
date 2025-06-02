// ===============================
// 📂 src/lib/firebase/admin/storage.ts
// ===============================

import { getAdminStorage } from "@/lib/firebase/admin/initialize";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";

// Upload file to Firebase Storage
export async function uploadFile(file: Buffer, fileName: string, folder = "uploads", metadata?: Record<string, any>) {
  try {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const fullPath = `${folder}/${fileName}`;
    const fileRef = bucket.file(fullPath);

    await fileRef.save(file, {
      metadata: {
        contentType: metadata?.contentType || "application/octet-stream",
        metadata: metadata || {}
      }
    });

    // Make the file publicly accessible
    await fileRef.makePublic();

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fullPath}`;

    return { success: true, url: publicUrl, path: fullPath };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error uploading file";
    return { success: false, error: message };
  }
}

// Delete file from Firebase Storage
export async function deleteFile(filePath: string) {
  try {
    const storage = getAdminStorage();
    const bucket = storage.bucket();
    const fileRef = bucket.file(filePath);

    await fileRef.delete();

    return { success: true };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
      ? error.message
      : "Unknown error deleting file";
    return { success: false, error: message };
  }
}

// Legacy compatibility exports
export const adminStorage = getAdminStorage;
