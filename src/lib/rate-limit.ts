/**
 * Production-ready rate limiting using Upstash Redis
 * Works across all Vercel serverless function instances
 * Tracks user requests per hour to prevent abuse
 */

import { Redis } from "@upstash/redis";

// Initialize Redis client (uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env)
// Fail gracefully if credentials are not configured
let redis: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.warn("Upstash Redis not configured. Rate limiting will fail open.");
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number; // timestamp when the limit resets
  requestsUsed: number;
}

/**
 * Checks if a user has exceeded the rate limit
 * @param userId - The user ID to check
 * @param maxRequests - Maximum number of requests allowed in the time window
 * @param windowHours - Time window in hours (default: 1)
 * @returns RateLimitResult with allowed status and remaining requests
 */
export async function checkRateLimit(
  userId: string,
  maxRequests: number = 10,
  windowHours: number = 1
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowHours * 60 * 60 * 1000;
  const windowStart = now - windowMs;
  const key = `rate_limit:${userId}`;

  // If Redis is not configured, fail open (allow the request)
  if (!redis) {
    console.warn("Redis not configured. Allowing request (fail open).");
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: now + windowMs,
      requestsUsed: 0,
    };
  }

  try {
    // Use ZCOUNT for better performance - just count requests, don't fetch all timestamps
    const requestsUsed = await redis.zcount(key, windowStart, now);
    const allowed = requestsUsed < maxRequests;

    // Calculate reset time (when oldest request expires)
    // Only fetch oldest timestamp if we need to calculate reset time
    let resetTime = now;
    if (requestsUsed > 0 && !allowed) {
      // Get the oldest timestamp to calculate when limit resets
      const oldestTimestamps = await redis.zrange<number[]>(
        key,
        windowStart,
        now,
        { byScore: true, offset: 0, count: 1 }
      );
      
      if (oldestTimestamps.length > 0) {
        // Handle type conversion (Redis may return strings)
        const oldestRequest = typeof oldestTimestamps[0] === 'string' 
          ? parseInt(oldestTimestamps[0], 10) 
          : oldestTimestamps[0];
        if (!isNaN(oldestRequest)) {
          resetTime = oldestRequest + windowMs;
        }
      }
    }

    return {
      allowed,
      remaining: Math.max(0, maxRequests - requestsUsed),
      resetTime,
      requestsUsed,
    };
  } catch (error) {
    // If Redis fails, allow the request (fail open)
    // Log error for monitoring
    console.error("Rate limit check failed:", error);
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: now + windowMs,
      requestsUsed: 0,
    };
  }
}

/**
 * Records a new request for a user
 * @param userId - The user ID making the request
 * @param windowHours - Time window in hours (default: 1)
 */
export async function recordRequest(
  userId: string,
  windowHours: number = 1
): Promise<void> {
  const now = Date.now();
  const windowMs = windowHours * 60 * 60 * 1000;
  const key = `rate_limit:${userId}`;
  const expireSeconds = Math.ceil(windowMs / 1000);

  // If Redis is not configured, silently return
  if (!redis) {
    return;
  }

  try {
    // Use pipeline for atomic operations - ensures both operations succeed or fail together
    const pipeline = redis.pipeline();
    pipeline.zadd(key, { score: now, member: now.toString() });
    pipeline.expire(key, expireSeconds);
    await pipeline.exec();
  } catch (error) {
    // Log error but don't throw - rate limiting shouldn't break the app
    console.error("Rate limit record failed:", error);
  }
}

/**
 * Formats the remaining time until rate limit resets into a human-readable string
 * @param resetTime - Timestamp when the limit resets
 * @returns Human-readable time string (e.g., "23 minutes")
 */
export function formatTimeUntilReset(resetTime: number): string {
  const now = Date.now();
  const msUntilReset = resetTime - now;

  if (msUntilReset <= 0) {
    return "now";
  }

  const minutes = Math.ceil(msUntilReset / (60 * 1000));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    return remainingMinutes > 0
      ? `${hours} hour${hours > 1 ? "s" : ""} and ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`
      : `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
}
