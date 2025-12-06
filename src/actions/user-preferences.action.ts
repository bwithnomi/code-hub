"use server";

import { ServerResponse } from "@/app/dto/response.dto";
import { db } from "@/db";
import { userPreferences, NewUserPreferences } from "@/db/schema";
import { userPreferencesSchema, UserPreferencesInput } from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {
  createSafeErrorResponse,
  createSuccessResponse,
  ErrorCategory,
} from "@/lib/error-handler";

const DEFAULT_PREFERENCES: Omit<NewUserPreferences, "userId"> = {
  theme: "system",
  editorTheme: "vs-dark",
  editorFontSize: 14,
  defaultLanguage: "javascript",
  aiTitleGenerationEnabled: true,
};

export async function getUserPreferences(): Promise<ServerResponse<typeof userPreferences.$inferSelect | null>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        error: true,
        status: 403,
        message: "Unauthenticated user",
        data: null,
      };
    }

    const user = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: (users, { eq }) => {
        return eq(users.clerkId, userId);
      },
    });

    if (!user) {
      return {
        error: true,
        status: 403,
        message: "User not found",
        data: null,
      };
    }

    const preferences = await db.query.userPreferences.findFirst({
      where: (prefs, { eq }) => {
        return eq(prefs.userId, user.id);
      },
    });

    if (preferences) {
    return createSuccessResponse(
      preferences,
      "Preferences retrieved successfully"
    );
    }

    // Create default preferences if they don't exist
    const newPreferences = await db
      .insert(userPreferences)
      .values({
        userId: user.id,
        ...DEFAULT_PREFERENCES,
      })
      .returning();

    return createSuccessResponse(
      newPreferences[0],
      "Default preferences created"
    );
  } catch (error) {
    return createSafeErrorResponse(
      error,
      500,
      ErrorCategory.DATABASE,
      "An unexpected error occurred while retrieving preferences. Please try again later."
    );
  }
}

export async function updateUserPreferences(
  data: UserPreferencesInput
): Promise<ServerResponse<typeof userPreferences.$inferSelect | null>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        error: true,
        status: 403,
        message: "Unauthenticated user",
        data: null,
      };
    }

    const validateData = userPreferencesSchema.safeParse(data);
    if (!validateData.success) {
      let errorMessage = "";
      validateData.error.issues.forEach((i) => {
        errorMessage = errorMessage + i.message + ". ";
      });

      return {
        error: true,
        status: 422,
        message: errorMessage,
        data: null,
      };
    }

    const user = await db.query.users.findFirst({
      columns: {
        id: true,
      },
      where: (users, { eq }) => {
        return eq(users.clerkId, userId);
      },
    });

    if (!user) {
      return {
        error: true,
        status: 403,
        message: "User not found",
        data: null,
      };
    }

    // Check if preferences exist
    const existingPreferences = await db.query.userPreferences.findFirst({
      where: (prefs, { eq }) => {
        return eq(prefs.userId, user.id);
      },
    });

    let updatedPreferences;
    if (existingPreferences) {
      // Update existing preferences
      updatedPreferences = await db
        .update(userPreferences)
        .set({
          ...validateData.data,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, user.id))
        .returning();
    } else {
      // Create new preferences
      updatedPreferences = await db
        .insert(userPreferences)
        .values({
          userId: user.id,
          ...validateData.data,
        })
        .returning();
    }

    return createSuccessResponse(
      updatedPreferences[0],
      "Preferences updated successfully"
    );
  } catch (error) {
    return createSafeErrorResponse(
      error,
      500,
      ErrorCategory.DATABASE,
      "An unexpected error occurred while updating preferences. Please try again later."
    );
  }
}

