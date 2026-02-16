import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_PRIVATE_KEY: z.string().optional(),
  JWT_PUBLIC_KEY: z.string().optional(),
  JWT_ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRY: z.string().default('30d'),

  // Apple Sign In
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),

  // Google Sign In
  GOOGLE_CLIENT_ID: z.string().optional(),

  // WebAuthn
  WEBAUTHN_RP_NAME: z.string().default('Afterparty'),
  WEBAUTHN_RP_ID: z.string().default('localhost'),
  WEBAUTHN_ORIGIN: z.string().default('http://localhost:3000'),

  // AWS S3
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  S3_BUCKET_NAME: z.string().default('afterparty-staging-images'),

  // APNs
  APNS_KEY_ID: z.string().optional(),
  APNS_TEAM_ID: z.string().optional(),
  APNS_PRIVATE_KEY: z.string().optional(),
  APNS_BUNDLE_ID: z.string().optional(),
  APNS_ENVIRONMENT: z.enum(['development', 'production']).default('development'),

  // FCM
  FCM_PROJECT_ID: z.string().optional(),
  FCM_SERVICE_ACCOUNT_KEY: z.string().optional(),

  // Vercel Cron
  CRON_SECRET: z.string().optional(),

  // Rate Limits
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  POKE_RATE_LIMIT_MAX: z.coerce.number().default(3),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
