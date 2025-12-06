"use server";

import { ServerResponse } from "@/app/dto/response.dto";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {
  createSafeErrorResponse,
  createSuccessResponse,
  ErrorCategory,
} from "@/lib/error-handler";

export async function exportSnippetsAsJson(): Promise<ServerResponse<string | null>> {
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
        name: true,
        email: true,
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

    const snippetsWithFiles = await db.query.snippets.findMany({
      where: (snippets, { eq }) => {
        return eq(snippets.userId, user.id);
      },
      with: {
        files: true,
      },
      orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
    });

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        user: {
          name: user.name,
          email: user.email,
        },
        snippetCount: snippetsWithFiles.length,
      },
      snippets: snippetsWithFiles.map((snippet) => ({
        id: snippet.id,
        title: snippet.title,
        shareId: snippet.shareId,
        visibility: snippet.visibility,
        createdAt: snippet.createdAt?.toISOString(),
        updatedAt: snippet.updatedAt?.toISOString(),
        files: snippet.files.map((file) => ({
          id: file.id,
          name: file.name,
          language: file.language,
          code: file.code,
        })),
      })),
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    return createSuccessResponse(jsonString, "Export successful");
  } catch (error) {
    return createSafeErrorResponse<string | null>(
      error,
      500,
      ErrorCategory.DATABASE,
      "An unexpected error occurred while exporting snippets. Please try again later."
    );
  }
}

export async function exportSnippetsAsZip(): Promise<ServerResponse<string | null>> {
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
        name: true,
        email: true,
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

    const snippetsWithFiles = await db.query.snippets.findMany({
      where: (snippets, { eq }) => {
        return eq(snippets.userId, user.id);
      },
      with: {
        files: true,
      },
      orderBy: (snippets, { desc }) => [desc(snippets.createdAt)],
    });

    // Dynamic import for JSZip to work with Next.js server actions
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    // Add metadata file
    const metadata = {
      exportDate: new Date().toISOString(),
      user: {
        name: user.name,
        email: user.email,
      },
      snippetCount: snippetsWithFiles.length,
    };
    zip.file("metadata.json", JSON.stringify(metadata, null, 2));

    // Add each snippet as a separate file
    snippetsWithFiles.forEach((snippet) => {
      const snippetData = {
        title: snippet.title,
        shareId: snippet.shareId,
        visibility: snippet.visibility,
        createdAt: snippet.createdAt?.toISOString(),
        updatedAt: snippet.updatedAt?.toISOString(),
        files: snippet.files.map((file) => ({
          name: file.name,
          language: file.language,
          code: file.code,
        })),
      };

      // Use shareId for filename, sanitize it
      const filename = `${snippet.shareId.replace(/[^a-zA-Z0-9-_]/g, "_")}.json`;
      zip.file(filename, JSON.stringify(snippetData, null, 2));
    });

    // Generate ZIP as base64
    const zipBuffer = await zip.generateAsync({ type: "base64" });

    return createSuccessResponse(zipBuffer, "Export successful");
  } catch (error) {
    return createSafeErrorResponse<string | null>(
      error,
      500,
      ErrorCategory.DATABASE,
      "An unexpected error occurred while exporting snippets. Please try again later."
    );
  }
}

