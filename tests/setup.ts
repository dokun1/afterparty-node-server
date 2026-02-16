// Global test setup — runs before all test files

// Provide required env vars so env.ts validation doesn't call process.exit
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
}
