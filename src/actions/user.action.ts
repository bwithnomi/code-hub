"use server";

import { ServerResponse } from "@/app/dto/response.dto";
import { db, ensureConnection } from "@/db";
import { NewUser, users } from "@/db/schema";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {
  createSafeErrorResponse,
  createSuccessResponse,
  ErrorCategory,
} from "@/lib/error-handler";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!user || !userId) {
      return;
    }

    // Use a more efficient query - only select id to check existence
    const existingUser = await ensureConnection(async () => {
      return await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkId, userId))
        .limit(1);
    });

    // If user exists, return early without fetching full record
    if (existingUser.length > 0) {
      return { synced: true, existing: true };
    }

    // Only create new user if they don't exist
    const newUser: NewUser = {
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User",
      tier: "free",
      email: user.emailAddresses[0]?.emailAddress || "",
      password: "",
      clerkId: userId,
    };
    
    const dbUser = await ensureConnection(async () => {
      return await db.insert(users).values(newUser).returning({ id: users.id });
    });

    return { synced: true, existing: false, id: dbUser[0]?.id };
  } catch (error) {
    // Log error but don't throw - user sync shouldn't break the app
    console.error("Error syncing user:", error);
    // Return undefined to indicate failure without throwing
    return undefined;
  }
}

export async function deleteUserAccount(): Promise<ServerResponse<boolean>> {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!user || !userId) {
      return {
        error: true,
        status: 403,
        message: "Unauthenticated user",
        data: false,
      };
    }

    const dbUser = await ensureConnection(async () => {
      return await db.query.users.findFirst({
        columns: {
          id: true,
        },
        where: (users, { eq }) => {
          return eq(users.clerkId, userId);
        },
      });
    });

    if (!dbUser) {
      return {
        error: true,
        status: 404,
        message: "User not found in database",
        data: false,
      };
    }

    // Delete from Clerk first
    try {
      const client = await clerkClient();
      await client.users.deleteUser(userId);
    } catch (clerkError) {
      console.error("Error deleting user from Clerk:", clerkError);
      return {
        error: true,
        status: 500,
        message: "Failed to delete user from authentication service",
        data: false,
      };
    }

    // Delete from local database (cascades to snippets, preferences, views via foreign keys)
    await ensureConnection(async () => {
      await db.delete(users).where(eq(users.id, dbUser.id));
    });

    return createSuccessResponse(true, "Account deleted successfully");
  } catch (error) {
    return createSafeErrorResponse<boolean>(
      error,
      500,
      ErrorCategory.DATABASE,
      "An unexpected error occurred while deleting your account. Please try again later."
    );
  }
}
