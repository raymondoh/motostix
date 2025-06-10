// //src/firebase/admin/user.ts
// import { getAdminAuth, getAdminFirestore } from "@/lib/firebase/admin/initialize";
// import { isFirebaseError, firebaseError } from "@/utils/firebase-error";
// import { Timestamp } from "firebase-admin/firestore";
// import type { UserRole } from "@/types/user";
// import type { User as FirestoreUser } from "@/types/user"; // Using a clearer alias for User to avoid conflict

// // Legacy compatibility - these match your current function names
// export const adminAuth = getAdminAuth;
// export const adminDb = getAdminFirestore;

// // Get user by ID
// export async function getUserById(userId: string) {
//   try {
//     const db = getAdminFirestore();
//     const userDoc = await db.collection("users").doc(userId).get();

//     if (!userDoc.exists) {
//       return { success: false, error: "User not found" };
//     }

//     const userData = userDoc.data();
//     return {
//       success: true,
//       data: {
//         id: userDoc.id,
//         ...userData,
//         createdAt: userData?.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData?.createdAt,
//         updatedAt: userData?.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData?.updatedAt,
//         lastLoginAt: userData?.lastLoginAt instanceof Timestamp ? userData.lastLoginAt.toDate() : userData?.lastLoginAt
//       }
//     };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//         ? error.message
//         : "Unknown error fetching user";
//     return { success: false, error: message };
//   }
// }

// // Get current user
// export async function getCurrentUser() {
//   try {
//     const { auth } = await import("@/auth");
//     const session = await auth();

//     if (!session?.user) {
//       return null;
//     }

//     return session.user;
//   } catch (error) {
//     console.error("Error getting current user:", error);
//     return null;
//   }
// }

// // Get user role
// export async function getUserRole(userId: string): Promise<UserRole> {
//   try {
//     const db = getAdminFirestore();
//     const userDoc = await db.collection("users").doc(userId).get();
//     const userData = userDoc.data();
//     return (userData?.role as UserRole) || "user";
//   } catch (error) {
//     console.error("Error getting user role:", error);
//     return "user";
//   }
// }

// // Set user role
// export async function setUserRole(userId: string, role: UserRole) {
//   try {
//     const db = getAdminFirestore();
//     await db.collection("users").doc(userId).update({
//       role,
//       updatedAt: new Date()
//     });
//     return { success: true };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//         ? error.message
//         : "Unknown error setting user role";
//     return { success: false, error: message };
//   }
// }

// // Update user profile
// export async function updateUserProfile(userId: string, data: any) {
//   try {
//     const db = getAdminFirestore();
//     await db
//       .collection("users")
//       .doc(userId)
//       .update({
//         ...data,
//         updatedAt: new Date()
//       });
//     return { success: true };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//         ? error.message
//         : "Unknown error updating user profile";
//     return { success: false, error: message };
//   }
// }

// // Create user document
// export async function createUserDocument(userId: string, userData: any) {
//   try {
//     const db = getAdminFirestore();
//     await db
//       .collection("users")
//       .doc(userId)
//       .set({
//         ...userData,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });
//     return { success: true };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//         ? error.message
//         : "Unknown error creating user document";
//     return { success: false, error: message };
//   }
// }

// // Get user profile
// // export async function getUserProfile(userId: string) {
// //   try {
// //     const db = getAdminFirestore();
// //     const auth = getAdminAuth();

// //     const [authUser, userDoc] = await Promise.all([auth.getUser(userId), db.collection("users").doc(userId).get()]);

// //     const userData = userDoc.data();
// //     if (!userData) {
// //       return { success: false, error: "User data not found" };
// //     }

// //     return {
// //       success: true,
// //       data: {
// //         id: authUser.uid,
// //         name: authUser.displayName || userData.name,
// //         email: authUser.email,
// //         bio: userData.bio || "",
// //         role: userData.role || "user",
// //         ...userData,
// //         createdAt: userData?.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData?.createdAt,
// //         updatedAt: userData?.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData?.updatedAt
// //       }
// //     };
// //   } catch (error) {
// //     const message = isFirebaseError(error)
// //       ? firebaseError(error)
// //       : error instanceof Error
// //         ? error.message
// //         : "Unknown error getting user profile";
// //     return { success: false, error: message };
// //   }
// // }
// // src/firebase/admin/user.ts

// export async function getUserProfile(userId: string) {
//   try {
//     const db = getAdminFirestore();
//     const auth = getAdminAuth();

//     const [authUser, userDoc] = await Promise.all([auth.getUser(userId), db.collection("users").doc(userId).get()]);

//     const userData = userDoc.data();
//     if (!userData) {
//       return { success: false, error: "User data not found" };
//     }

//     // Highlight: Explicitly include all new fields from userData
//     const userProfile: FirestoreUser = {
//       id: authUser.uid,
//       email: authUser.email || "",
//       // Keep name for backward compatibility or if it's the Firebase Auth display name
//       name: authUser.displayName || userData.name || "",

//       // Explicitly pull and assign new fields
//       firstName: userData.firstName || "",
//       lastName: userData.lastName || "",
//       displayName: userData.displayName || authUser.displayName || userData.name || "", // Prioritize Firestore's displayName, then Auth, then old name

//       bio: userData.bio || "",
//       location: userData.location || "",
//       website: userData.website || "",
//       phone: userData.phone || "",

//       // Ensure image is correctly retrieved
//       image: authUser.photoURL || userData.picture || userData.profileImage || userData.image || null,

//       role: userData.role || "user",
//       permissions: userData.permissions || [],
//       status: userData.status || "active",

//       // Serialize timestamps
//       createdAt: userData?.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData?.createdAt,
//       updatedAt: userData?.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData?.updatedAt,
//       lastLoginAt: userData?.lastLoginAt instanceof Timestamp ? userData.lastLoginAt.toDate() : userData?.lastLoginAt,
//       emailVerified: userData.emailVerified || false,
//       hasPassword: userData.hasPassword || false,
//       has2FA: userData.has2FA || false,
//       provider: userData.provider || authUser.providerData[0]?.providerId || ""

//       // Include any other relevant data from Firestore, ensuring no duplicates
//       // If you are storing any other fields in Firestore that are not in the User interface,
//       // you might need to explicitly add them here or consider a different approach if `...userData` is desired
//       // without overriding specific fields. For now, explicit assignment is safer.
//     };

//     return {
//       success: true,
//       data: userProfile
//     };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//         ? error.message
//         : "Unknown error getting user profile";
//     return { success: false, error: message };
//   }
// }

// // Get users
// export async function getUsers(limit = 10, offset = 0) {
//   try {
//     const db = getAdminFirestore();
//     const snapshot = await db.collection("users").orderBy("createdAt", "desc").limit(limit).offset(offset).get();

//     const users = snapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         ...data,
//         createdAt: data?.createdAt instanceof Timestamp ? data.createdAt.toDate() : data?.createdAt,
//         updatedAt: data?.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data?.updatedAt,
//         lastLoginAt: data?.lastLoginAt instanceof Timestamp ? data.lastLoginAt.toDate() : data?.lastLoginAt
//       };
//     });

//     return { success: true, users };
//   } catch (error) {
//     const message = isFirebaseError(error)
//       ? firebaseError(error)
//       : error instanceof Error
//         ? error.message
//         : "Unknown error fetching users";
//     return { success: false, error: message };
//   }
// }
// src/firebase/admin/user.ts
import { getAdminFirestore, getAdminAuth } from "@/lib/firebase/admin/initialize";
import { Timestamp } from "firebase-admin/firestore";
import type { User as FirestoreUser } from "@/types/user";
import { isFirebaseError, firebaseError } from "@/utils/firebase-error";

export async function getUserProfile(userId: string) {
  // Highlight: Log start of getUserProfile
  console.log("[Firebase Admin] getUserProfile: START for userId:", userId);
  try {
    const db = getAdminFirestore();
    const auth = getAdminAuth();

    const [authUser, userDoc] = await Promise.all([auth.getUser(userId), db.collection("users").doc(userId).get()]);

    const userData = userDoc.data();
    console.log("[Firebase Admin] getUserProfile: Raw Firestore userData:", userData); // Highlight
    console.log("[Firebase Admin] getUserProfile: Raw Firebase Auth authUser:", authUser); // Highlight

    if (!userData) {
      return { success: false, error: "User data not found" };
    }

    const userProfile: FirestoreUser = {
      id: authUser.uid,
      email: authUser.email || "",
      name: authUser.displayName || userData.name || "",

      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      displayName: userData.displayName || authUser.displayName || userData.name || "",

      bio: userData.bio || "",
      location: userData.location || "",
      website: userData.website || "",
      phone: userData.phone || "",

      image: authUser.photoURL || userData.picture || userData.profileImage || userData.image || null,

      role: userData.role || "user",
      permissions: userData.permissions || [],
      status: userData.status || "active",

      createdAt: userData?.createdAt instanceof Timestamp ? userData.createdAt.toDate() : userData?.createdAt,
      updatedAt: userData?.updatedAt instanceof Timestamp ? userData.updatedAt.toDate() : userData?.updatedAt,
      lastLoginAt: userData?.lastLoginAt instanceof Timestamp ? userData.lastLoginAt.toDate() : userData?.lastLoginAt,
      emailVerified: userData.emailVerified || false,
      hasPassword: userData.hasPassword || false,
      has2FA: userData.has2FA || false,
      provider: userData.provider || authUser.providerData[0]?.providerId || ""
    };

    console.log("[Firebase Admin] getUserProfile: Constructed userProfile object:", userProfile); // Highlight
    return {
      success: true,
      data: userProfile
    };
  } catch (error) {
    const message = isFirebaseError(error)
      ? firebaseError(error)
      : error instanceof Error
        ? error.message
        : "Unknown error getting user profile";
    console.error("[Firebase Admin] getUserProfile: Error details:", error); // Highlight
    return { success: false, error: message };
  } finally {
    console.log("[Firebase Admin] getUserProfile: END"); // Highlight
  }
}
