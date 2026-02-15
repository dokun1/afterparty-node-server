export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN_DAYS: 30,
} as const;

export const RATE_LIMITS = {
  GLOBAL_WINDOW_MS: 60_000,
  GLOBAL_MAX_REQUESTS: 100,
  AUTH_WINDOW_MS: 60_000,
  AUTH_MAX_REQUESTS: 10,
  UPLOAD_WINDOW_MS: 3_600_000,
  UPLOAD_MAX_REQUESTS: 30,
  POKE_MAX_PER_TARGET_24H: 3,
} as const;

export const EVENT_LIFECYCLE = {
  DESTROY_OFFSET_HOURS: 24,
} as const;

export const MEDIA_TYPES = ['photo', 'video', 'audio'] as const;

export const EVENT_ROLES = ['creator', 'admin', 'member'] as const;

export const SEARCH_DEFAULTS = {
  RADIUS_METERS: 5000,
  LIMIT: 50,
} as const;
