import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export { users } from './users';
export { passkeyCredentials } from './passkeys';
export { events } from './events';
export { eventMembers } from './eventMembers';
export { media } from './media';
export { adminInvites } from './adminInvites';
export { devices } from './devices';
export { pokeLog } from './pokeLog';
export { refreshTokens } from './refreshTokens';

// Re-import tables for type inference
import { users } from './users';
import { passkeyCredentials } from './passkeys';
import { events } from './events';
import { eventMembers } from './eventMembers';
import { media } from './media';
import { adminInvites } from './adminInvites';
import { devices } from './devices';
import { pokeLog } from './pokeLog';
import { refreshTokens } from './refreshTokens';

// Select types (what you get back from queries)
export type User = InferSelectModel<typeof users>;
export type PasskeyCredential = InferSelectModel<typeof passkeyCredentials>;
export type Event = InferSelectModel<typeof events>;
export type EventMember = InferSelectModel<typeof eventMembers>;
export type Media = InferSelectModel<typeof media>;
export type AdminInvite = InferSelectModel<typeof adminInvites>;
export type Device = InferSelectModel<typeof devices>;
export type PokeLogEntry = InferSelectModel<typeof pokeLog>;
export type RefreshToken = InferSelectModel<typeof refreshTokens>;

// Insert types (what you pass to insert operations)
export type NewUser = InferInsertModel<typeof users>;
export type NewPasskeyCredential = InferInsertModel<typeof passkeyCredentials>;
export type NewEvent = InferInsertModel<typeof events>;
export type NewEventMember = InferInsertModel<typeof eventMembers>;
export type NewMedia = InferInsertModel<typeof media>;
export type NewAdminInvite = InferInsertModel<typeof adminInvites>;
export type NewDevice = InferInsertModel<typeof devices>;
export type NewPokeLogEntry = InferInsertModel<typeof pokeLog>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;
