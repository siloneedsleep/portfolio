interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const DEFAULT_MAX_BUCKETS = 1000;

export class InMemoryRateLimiter {
  private readonly buckets = new Map<string, RateLimitBucket>();

  check(
    key: string,
    maxRequests = 5,
    windowMs = 15 * 60 * 1000,
    now = Date.now(),
  ): RateLimitResult {
    if (this.buckets.size > DEFAULT_MAX_BUCKETS) {
      for (const [bucketKey, bucket] of this.buckets.entries()) {
        if (bucket.resetAt <= now) {
          this.buckets.delete(bucketKey);
        }
      }
    }

    const existing = this.buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + windowMs });
      return {
        allowed: true,
        remaining: Math.max(0, maxRequests - 1),
        retryAfterSeconds: Math.ceil(windowMs / 1000),
      };
    }

    if (existing.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - existing.count),
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  reset(): void {
    this.buckets.clear();
  }
}

export const contactRateLimiter = new InMemoryRateLimiter();
