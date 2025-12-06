/**
 * Centralized error handling utility
 * Prevents information leakage by sanitizing error messages
 */

import { ServerResponse } from "@/app/dto/response.dto";

/**
 * Error categories for different types of errors
 */
export enum ErrorCategory {
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  VALIDATION = "VALIDATION",
  NOT_FOUND = "NOT_FOUND",
  DATABASE = "DATABASE",
  EXTERNAL_API = "EXTERNAL_API",
  RATE_LIMIT = "RATE_LIMIT",
  UNKNOWN = "UNKNOWN",
}

/**
 * Safe error messages that don't leak sensitive information
 */
const SAFE_ERROR_MESSAGES: Record<ErrorCategory, string> = {
  [ErrorCategory.AUTHENTICATION]: "Authentication required. Please log in and try again.",
  [ErrorCategory.AUTHORIZATION]: "You don't have permission to perform this action.",
  [ErrorCategory.VALIDATION]: "Invalid input. Please check your data and try again.",
  [ErrorCategory.NOT_FOUND]: "The requested resource was not found.",
  [ErrorCategory.DATABASE]: "A database error occurred. Please try again later.",
  [ErrorCategory.EXTERNAL_API]: "An external service error occurred. Please try again later.",
  [ErrorCategory.RATE_LIMIT]: "Too many requests. Please try again later.",
  [ErrorCategory.UNKNOWN]: "An unexpected error occurred. Please try again later.",
};

/**
 * Determines the error category from an error object or status code
 */
function categorizeError(error: unknown, statusCode?: number): ErrorCategory {
  // Check status code first
  if (statusCode === 401 || statusCode === 403) {
    return statusCode === 401
      ? ErrorCategory.AUTHENTICATION
      : ErrorCategory.AUTHORIZATION;
  }
  if (statusCode === 404) {
    return ErrorCategory.NOT_FOUND;
  }
  if (statusCode === 422) {
    return ErrorCategory.VALIDATION;
  }
  if (statusCode === 429) {
    return ErrorCategory.RATE_LIMIT;
  }
  if (statusCode === 503 || statusCode === 502 || statusCode === 504) {
    return ErrorCategory.EXTERNAL_API;
  }

  // Check error message for patterns (but don't expose the message)
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes("auth") ||
      message.includes("unauthorized") ||
      message.includes("unauthenticated")
    ) {
      return ErrorCategory.AUTHENTICATION;
    }
    if (
      message.includes("permission") ||
      message.includes("forbidden") ||
      message.includes("access denied")
    ) {
      return ErrorCategory.AUTHORIZATION;
    }
    if (
      message.includes("not found") ||
      message.includes("does not exist")
    ) {
      return ErrorCategory.NOT_FOUND;
    }
    if (
      message.includes("database") ||
      message.includes("sql") ||
      message.includes("connection") ||
      message.includes("query")
    ) {
      return ErrorCategory.DATABASE;
    }
    if (
      message.includes("api") ||
      message.includes("fetch") ||
      message.includes("network") ||
      message.includes("timeout")
    ) {
      return ErrorCategory.EXTERNAL_API;
    }
    if (
      message.includes("rate limit") ||
      message.includes("too many requests")
    ) {
      return ErrorCategory.RATE_LIMIT;
    }
  }

  return ErrorCategory.UNKNOWN;
}

/**
 * Safely extracts error information for logging (server-side only)
 */
function extractErrorDetails(error: unknown): {
  message: string;
  stack?: string;
  name?: string;
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  }
  if (typeof error === "string") {
    return { message: error };
  }
  if (error && typeof error === "object") {
    try {
      return {
        message: JSON.stringify(error),
      };
    } catch {
      return { message: "Unknown error object" };
    }
  }
  return { message: "Unknown error" };
}

/**
 * Creates a safe error response that doesn't leak sensitive information
 * @param error - The error object
 * @param statusCode - HTTP status code
 * @param category - Optional error category override
 * @param customSafeMessage - Optional custom safe message (must not leak info)
 * @returns ServerResponse with sanitized error message
 */
export function createSafeErrorResponse<T>(
  error: unknown,
  statusCode: number = 500,
  category?: ErrorCategory,
  customSafeMessage?: string
): ServerResponse<T> {
  // Determine error category
  const errorCategory = category || categorizeError(error, statusCode);

  // Get safe message
  const safeMessage =
    customSafeMessage || SAFE_ERROR_MESSAGES[errorCategory];

  // Log detailed error information server-side (for debugging)
  const errorDetails = extractErrorDetails(error);
  console.error(`[${errorCategory}] Error occurred:`, {
    message: errorDetails.message,
    statusCode,
    ...(errorDetails.stack && { stack: errorDetails.stack }),
    ...(errorDetails.name && { name: errorDetails.name }),
  });

  return {
    error: true,
    status: statusCode,
    message: safeMessage,
    data: null as T,
  };
}

/**
 * Creates a success response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = "Success",
  statusCode: number = 200
): ServerResponse<T> {
  return {
    error: false,
    status: statusCode,
    message,
    data,
  };
}

/**
 * Wraps an async function with error handling
 * Automatically catches errors and returns safe error responses
 */
export function withErrorHandling<T>(
  fn: () => Promise<ServerResponse<T>>,
  defaultStatus: number = 500
): Promise<ServerResponse<T>> {
  return fn().catch((error) => {
    return createSafeErrorResponse<T>(error, defaultStatus);
  });
}

/**
 * Sanitizes external API error messages
 * Removes sensitive information like API keys, tokens, etc.
 */
export function sanitizeApiErrorMessage(
  errorMessage: string,
  apiName: string = "External API"
): string {
  // Remove potential API keys, tokens, etc.
  let sanitized = errorMessage
    .replace(/Bearer\s+[\w-]+/gi, "[REDACTED]")
    .replace(/api[_-]?key["\s:=]+[\w-]+/gi, "[REDACTED]")
    .replace(/token["\s:=]+[\w-]+/gi, "[REDACTED]")
    .replace(/authorization["\s:=]+[\w-]+/gi, "[REDACTED]");

  // Remove file paths that might leak system information
  sanitized = sanitized.replace(/\/[^\s]+\/[^\s]+/g, "[PATH]");

  // Remove email addresses
  sanitized = sanitized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    "[EMAIL]"
  );

  // Remove IP addresses
  sanitized = sanitized.replace(
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    "[IP]"
  );

  return sanitized;
}

