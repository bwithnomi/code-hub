"use server";

import { ServerResponse } from "@/app/dto/response.dto";
import { db, ensureConnection } from "@/db";
import {
  snippets,
  NewSnippet as NewSnippetDb,
  files,
  Snippet,
  snippetViews,
} from "@/db/schema";
import {
  NewSnippet,
  snippetSchema,
  snippetUpdateSchema,
  UpdateSnippet,
} from "@/lib/zodSchema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq, or, and, inArray, sql } from "drizzle-orm";
import {
  createSafeErrorResponse,
  createSuccessResponse,
  ErrorCategory,
} from "@/lib/error-handler";

/**
 * Helper function to get the current authenticated user from the database
 * @returns User object with id and tier, or null if not authenticated or user not found
 */
async function getCurrentUser(): Promise<{ id: number; tier: 'free' | 'pro' | 'enterprise' | null, clerkId: string } | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  try {
    const user = await ensureConnection(async () => {
      return await db.query.users.findFirst({
        columns: { id: true, tier: true, clerkId: true },
        where: (users, { eq }) => eq(users.clerkId, userId),
      });
    });

    return user ?? null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export const getAllSnippets = async () => {
  const snippetWithFiles = await db.query.snippets.findMany({
    where: (snippets, { eq }) => {
      return eq(snippets.visibility, "public");
    },
    orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
    with: {
      files: true,
    },
    limit: 9,
  });

  return snippetWithFiles;
};

export const getMySnippets = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }
  const snippetWithFiles = await db.query.snippets.findMany({
    orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
    with: {
      files: true,
    },
    where: (snippets, { eq }) => {
      return eq(snippets.userId, user.id);
    },
    limit: 10,
  });
  return {
    error: false,
    status: 200,
    message: "Success",
    data: snippetWithFiles,
  };
};

export const saveSnippet = async (
  data: NewSnippet
): Promise<ServerResponse<NewSnippetDb | null>> => {
  const validateData = snippetSchema.safeParse(data);

  if (!validateData.success) {
    let errorMessage = "";
    validateData.error.issues.forEach((i) => {
      errorMessage = errorMessage + i.message + ". \b";
    });

    return {
      error: true,
      status: 422,
      message: errorMessage,
      data: null,
    };
  }
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }

  // Check file count limit for free tier (max 3 files/editors)
  if (user.tier === 'free' && data.files.length > 3) {
    return {
      error: true,
      status: 403,
      message: "Free tier users can have a maximum of 3 editors per snippet. Please upgrade to add more editors.",
      data: null,
    };
  }

  // Check snippet count limit for free tier (max 5 snippets)
  if (user.tier === 'free') {
    const snippetCount = await db.$count(snippets, eq(snippets.userId, user.id));
    if (snippetCount >= 5) {
      return {
        error: true,
        status: 403,
        message: "Free tier users can have a maximum of 5 snippets. Please upgrade to create more snippets.",
        data: null,
      };
    }
  }

  const id = crypto.randomUUID();
  const newSnippet = await db
    .insert(snippets)
    .values({
      title: data.title,
      visibility: data.visibility,
      userId: user?.id,
      shareId: id,
    })
    .returning();

  for (let index = 0; index < data.files.length; index++) {
    const file = data.files[index];
    await db.insert(files).values({
      name: `${data.title}-${id}`,
      language: file.language,
      code: file.content,
      snippetId: newSnippet[0].id,
    });
  }

  return createSuccessResponse(newSnippet[0], "Snippet saved successfully");
};

export const deleteSnippet = async (id: number) => {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }

  // Get snippet and verify ownership
  const snippet = await db.query.snippets.findFirst({
    where: (snippets, { eq }) => eq(snippets.id, id),
  });

  if (!snippet) {
    return {
      error: true,
      status: 404,
      message: "Snippet not found",
      data: null,
    };
  }

  if (snippet.userId !== user.id) {
    return {
      error: true,
      status: 403,
      message: "You don't have permission to delete this snippet",
      data: null,
    };
  }

  await db.delete(snippets).where(eq(snippets.id, id));
  
  return {
    error: false,
    status: 200,
    message: "Snippet deleted successfully",
    data: true,
  };
};
export const getSnippetByShareId = async (shareId: string) => {
  const snippet = await db.query.snippets.findFirst({
    with: {
      files: true,
    },
    where: (snippets, { eq }) => {
      return eq(snippets.shareId, shareId);
    },
  });

  return snippet;
};
export const viewSnippetByShareId = async (shareId: string) => {
  const [snippet, user] = await Promise.all([
    db.query.snippets.findFirst({
      with: {
        files: true,
      },
      where: (snippets, { eq, and }) => {
        return and(
          eq(snippets.shareId, shareId),
          eq(snippets.visibility, "public")
        );
      },
    }),
    getCurrentUser(), // Optional user lookup - returns null if not authenticated
  ]);

  if (!snippet) return undefined;

  if (user) {
    const view = await db.query.snippetViews.findFirst({
      where: (snippetViews, { eq, and }) => {
        return and(
          eq(snippetViews.viewerId, user.id),
          eq(snippetViews.snippetId, snippet.id)
        );
      },
    });

    if (!view) {
      await db.insert(snippetViews).values({
        snippetId: snippet.id,
        viewerId: user.id,
        ownerId: snippet.userId,
      });
    }
  }

  const views = await db.$count(snippetViews, eq(snippetViews.snippetId, snippet.id));

  return { snippet, views };
};

export const getRecentSnippets = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }
  const snippetWithFiles = await db.query.snippets.findMany({
    columns: {
      visibility: true,
      title: true,
      updatedAt: true,
      id: true,
      shareId: true,
    },
    where: (snippets, { eq }) => {
      return eq(snippets.userId, user.id);
    },
    orderBy: (snippets, { desc }) => [desc(snippets.updatedAt)],
    limit: 5,
  });
  return {
    error: false,
    status: 200,
    message: "success",
    data: snippetWithFiles,
  };
};

export const getMySnippetCount = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthorized",
      data: null,
    };
  }
  const count = await db.$count(snippets, eq(snippets.userId, user.id));
  return {
    error: false,
    status: 200,
    message: "",
    data: {
      count,
      tier: user.tier,
      maxSnippets: user.tier === 'free' ? 5 : Infinity,
    },
  };
};

export const getSearchableSnippetCount = async () => {
  const count = await db.$count(snippets, eq(snippets.visibility, "public"));
  return {
    error: false,
    status: 200,
    message: "",
    data: {
      count,
    },
  };
};

export const getViewsCount = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthorized",
      data: null,
    };
  }
  const count = await db.$count(snippetViews, eq(snippetViews.ownerId, user.id));
  return {
    error: false,
    status: 200,
    message: "",
    data: {
      count,
    },
  };
};

export const updateSnippet = async (data: UpdateSnippet) => {
  const validateData = snippetUpdateSchema.safeParse(data);

  if (!validateData.success) {
    let errorMessage = "";
    validateData.error.issues.forEach((i) => {
      errorMessage = errorMessage + i.message + ". \b";
    });

    return {
      error: true,
      status: 422,
      message: errorMessage,
      data: null,
    };
  }
  const snippet = await getSnippetByShareId(data.shareId);

  if (!snippet) {
    return {
      error: true,
      status: 404,
      message: "Snippet not found",
      data: null,
    };
  }

  // Get user and verify ownership
  const user = await getCurrentUser();
  if (!user) {
    return {
      error: true,
      status: 403,
      message: "Unauthenticated user",
      data: null,
    };
  }

  // Verify ownership
  if (snippet.userId !== user.id) {
    return {
      error: true,
      status: 403,
      message: "You don't have permission to update this snippet",
      data: null,
    };
  }

  // Check file count limit for free tier (max 3 files/editors)
  if (user.tier === 'free' && data.files.length > 3) {
    return {
      error: true,
      status: 403,
      message: "Free tier users can have a maximum of 3 editors per snippet. Please upgrade to add more editors.",
      data: null,
    };
  }

  await Promise.all([
    db
      .update(snippets)
      .set({
        title: data.title,
        visibility: data.visibility,
        updatedAt: new Date(),
      })
      .where(eq(snippets.shareId, snippet.shareId)),
    db.delete(files).where(eq(files.snippetId, snippet.id)),
  ]);

  for (let index = 0; index < data.files.length; index++) {
    const file = data.files[index];
    await db.insert(files).values({
      name: `${data.title}-${snippet.shareId}`,
      language: file.language,
      code: file.content,
      snippetId: snippet.id,
    });
  }

  return createSuccessResponse(snippet, "Snippet updated successfully");
};

export const searchSnippets = async (
  searchQuery: string = "",
  language: string = "any",
  scope: "my" | "public" | "all" = "public"
) => {
  try {
    const { userId } = await auth();
    let user: { id: number } | null = null;

    // Get user if needed for "my" or "all" scope, or for ownership indicators in public scope
    if (scope === "my" || scope === "all") {
      // For "my" or "all" scope, require authentication
      const foundUser = await getCurrentUser();
      if (!foundUser) {
        return {
          error: true,
          status: 403,
          message: "Unauthenticated user",
          data: null,
        };
      }
      user = foundUser;
    } else if (scope === "public") {
      // For public scope, only fetch user if logged in (for ownership indicators)
      user = await getCurrentUser();
    }

    // Handle language filtering first
    let languageFilteredSnippetIds: number[] | undefined;
    if (language !== "any") {
      const filesWithLanguage = await db
        .select({ snippetId: files.snippetId })
        .from(files)
        .where(eq(files.language, language));
      
      languageFilteredSnippetIds = filesWithLanguage
        .map((f) => f.snippetId)
        .filter((id): id is number => id !== null);
      
      if (languageFilteredSnippetIds.length === 0) {
        // No snippets found with this language
        return {
          error: false,
          status: 200,
          message: "success",
          data: [],
        };
      }
    }

    // Build where conditions based on scope
    const conditions = [];

    if (scope === "my") {
      // Only user's snippets (all visibility levels)
      if (user) {
        conditions.push(eq(snippets.userId, user.id));
      }
    } else if (scope === "public") {
      // Only public snippets
      conditions.push(eq(snippets.visibility, "public"));
    } else if (scope === "all") {
      // User's snippets (all visibility) OR public snippets
      if (user) {
        conditions.push(
          or(
            eq(snippets.userId, user.id),
            eq(snippets.visibility, "public")
          )!
        );
      } else {
        // Fallback to public only if no user
        conditions.push(eq(snippets.visibility, "public"));
      }
    }

    // Add text search condition if query exists
    if (searchQuery.trim()) {
      const searchPattern = `%${searchQuery.trim()}%`;
      conditions.push(
        sql`(${snippets.title} ILIKE ${searchPattern} OR ${snippets.shareId} ILIKE ${searchPattern})`
      );
    }

    // Add language filter if specified
    if (languageFilteredSnippetIds) {
      conditions.push(inArray(snippets.id, languageFilteredSnippetIds));
    }

    // Query snippets using SQL builder
    const foundSnippets = await db
      .select()
      .from(snippets)
      .where(and(...conditions))
      .orderBy(desc(snippets.createdAt))
      .limit(50);

    // Fetch all files for all snippets in a single query (fixes N+1 problem)
    const foundSnippetIds = foundSnippets.map((s) => s.id);
    let allFiles: Array<{ snippetId: number | null; [key: string]: any }> = [];
    
    if (foundSnippetIds.length > 0) {
      allFiles = await db
        .select()
        .from(files)
        .where(inArray(files.snippetId, foundSnippetIds));
    }

    // Group files by snippetId for efficient lookup
    const filesBySnippetId = new Map<number, typeof allFiles>();
    for (const file of allFiles) {
      if (file.snippetId !== null) {
        if (!filesBySnippetId.has(file.snippetId)) {
          filesBySnippetId.set(file.snippetId, []);
        }
        filesBySnippetId.get(file.snippetId)!.push(file);
      }
    }

    // Map snippets with their files
    const snippetWithFiles = foundSnippets.map((snippet) => ({
      ...snippet,
      files: filesBySnippetId.get(snippet.id) || [],
      // Include current user's database ID for client-side ownership check
      currentUserId: user?.id,
    }));

    return {
      error: false,
      status: 200,
      message: "success",
      data: snippetWithFiles,
    };
  } catch (error) {
    return createSafeErrorResponse(
      error,
      500,
      ErrorCategory.DATABASE,
      "An unexpected error occurred while searching snippets. Please try again later."
    );
  }
};
