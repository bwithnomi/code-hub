"use server";

import { ServerResponse } from "@/app/dto/response.dto";
import { auth } from "@clerk/nextjs/server";
import {
  checkRateLimit,
  recordRequest,
  formatTimeUntilReset,
} from "@/lib/rate-limit";
import {
  createSafeErrorResponse,
  createSuccessResponse,
  ErrorCategory,
  sanitizeApiErrorMessage,
} from "@/lib/error-handler";

interface SnippetFile {
  language: string;
  content: string;
}

/**
 * Generates a snippet title using Hugging Face Router API
 * Uses the OpenAI-compatible chat completions endpoint
 * @param files Array of snippet files containing language and content
 * @returns ServerResponse with generated title
 */
export const generateSnippetTitle = async (
  files: SnippetFile[]
): Promise<ServerResponse<string | null>> => {
  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    return createSafeErrorResponse<string | null>(
      new Error("Unauthenticated user"),
      403,
      ErrorCategory.AUTHENTICATION,
      "You must be logged in to generate titles."
    );
  }

  // Check rate limit
  const maxRequests = parseInt(
    process.env.AI_RATE_LIMIT_REQUESTS || "10",
    10
  );
  const rateLimitResult = await checkRateLimit(userId, maxRequests, 1);

  if (!rateLimitResult.allowed) {
    const timeUntilReset = formatTimeUntilReset(rateLimitResult.resetTime);
    return {
      error: true,
      status: 429,
      message: `Rate limit exceeded. You've used ${rateLimitResult.requestsUsed}/${maxRequests} requests this hour. Try again in ${timeUntilReset}.`,
      data: null,
    };
  }

  // Record the request before making the API call to prevent abuse
  // This ensures failed API calls still count against the rate limit
  await recordRequest(userId);

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  // Use a commonly available free model, or allow override via env variable
  const model = process.env.HUGGINGFACE_MODEL || "meta-llama/Llama-3.2-1B-Instruct";

  if (!apiKey) {
    return createSafeErrorResponse<string | null>(
      new Error("HUGGINGFACE_API_KEY not configured"),
      500,
      ErrorCategory.EXTERNAL_API,
      "AI service is not configured. Please contact support."
    );
  }

  // Filter out empty files and check if there's any code content
  const nonEmptyFiles = files.filter((file) => file.content.trim().length > 0);

  if (nonEmptyFiles.length === 0) {
    return {
      error: true,
      status: 400,
      message: "No code content found. Please add some code before generating a title.",
      data: null,
    };
  }

  // Build the prompt with code content
  let codeContext = "";
  const languages = new Set<string>();
  
  nonEmptyFiles.forEach((file, index) => {
    if (file.content.trim()) {
      languages.add(file.language);
      codeContext += `--- File ${index + 1} (${file.language}) ---\n${file.content}\n\n`;
    }
  });

  const languageList = Array.from(languages).join(", ");
  const fileCount = nonEmptyFiles.length;
  const isMultiFile = fileCount > 1;
  const isMultiLanguage = languages.size > 1;

  // Create a comprehensive prompt that analyzes the whole snippet
  let snippetDescription = "code snippet";
  if (isMultiFile) {
    snippetDescription = `code snippet with ${fileCount} file${fileCount > 1 ? "s" : ""}`;
  }
  if (isMultiLanguage) {
    snippetDescription += ` using ${languages.size} language${languages.size > 1 ? "s" : ""} (${languageList})`;
  } else {
    snippetDescription += ` in ${languageList}`;
  }

  const prompt = `Analyze the following ${snippetDescription}.

${isMultiFile ? "Consider all files together as a complete unit. " : ""}Analyze what the code does overall${isMultiFile ? ", how the files relate to each other" : ""}, and identify the main purpose or functionality.

Generate a concise, descriptive title (maximum 60 characters) that captures the essence of the ENTIRE snippet. The title should describe the overall functionality, not just individual parts.

${codeContext}

Generate only the title, nothing else:`;

  try {
    // Use the new Hugging Face router endpoint with OpenAI-compatible format
    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 30,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      // Handle rate limiting or model loading
      if (response.status === 503) {
        return createSafeErrorResponse<string | null>(
          new Error("AI service temporarily unavailable"),
          503,
          ErrorCategory.EXTERNAL_API,
          "AI service is currently loading. Please try again in a few seconds."
        );
      }

      // Read error response as text first (can only read response body once)
      const errorText = await response.text();
      let rawErrorMessage = errorText || response.statusText;
      
      // Try to parse as JSON to extract structured error message
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          rawErrorMessage = errorData.error.message;
        } else if (errorData.message) {
          rawErrorMessage = errorData.message;
        } else if (errorData.error && typeof errorData.error === "string") {
          rawErrorMessage = errorData.error;
        }
      } catch {
        // If JSON parsing fails, use the text as is
      }

      // Sanitize the error message to remove sensitive information
      const sanitizedError = sanitizeApiErrorMessage(rawErrorMessage, "Hugging Face API");
      
      // Log the original error for debugging (server-side only)
      console.error("Hugging Face API error:", {
        status: response.status,
        originalError: rawErrorMessage,
        sanitizedError,
        model,
      });

      // Return safe error message
      return createSafeErrorResponse<string | null>(
        new Error(sanitizedError),
        response.status,
        ErrorCategory.EXTERNAL_API,
        "Failed to generate title. Please try again later."
      );
    }

    const data = await response.json();

    // Handle OpenAI-compatible chat completions response format
    let generatedText = "";
    if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
      generatedText = data.choices[0].message.content;
    } else if (data.content) {
      generatedText = data.content;
    } else if (typeof data === "string") {
      generatedText = data;
    }

    // Clean up the generated text - remove extra whitespace, quotes, etc.
    let title = generatedText.trim();

    // Remove surrounding quotes if present
    title = title.replace(/^["']|["']$/g, "");

    // Take only the first line if multiple lines
    title = title.split("\n")[0].trim();

    // Limit to 60 characters
    if (title.length > 60) {
      title = title.substring(0, 57) + "...";
    }

    if (!title) {
      return createSafeErrorResponse<string | null>(
        new Error("Generated title is empty"),
        500,
        ErrorCategory.EXTERNAL_API,
        "Failed to generate a valid title. Please try again."
      );
    }

    return createSuccessResponse(title, "Title generated successfully");
  } catch (error) {
    return createSafeErrorResponse<string | null>(
      error,
      500,
      ErrorCategory.EXTERNAL_API,
      "An unexpected error occurred while generating the title. Please try again later."
    );
  }
};

