import { pgTable, serial, text, timestamp, boolean, integer, varchar, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import type { AdapterAccount } from "@auth/core/adapters"

// NextAuth.js Users table
export const users = pgTable('user', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// NextAuth.js Accounts table
export const accounts = pgTable('account', {
  userId: text('userId').notNull(),
  type: text('type').$type<AdapterAccount['type']>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] })
}))

// NextAuth.js Sessions table
export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

// NextAuth.js Verification tokens table
export const verificationTokens = pgTable('verificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
}))

// Campaigns table
export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, inactive, draft
  userId: text('user_id').notNull(),
  startDate: timestamp('start_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Leads table
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  position: varchar('position', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, contacted, responded, converted, rejected
  campaignId: integer('campaign_id').notNull(),
  userId: text('user_id').notNull(),
  lastContactDate: timestamp('last_contact_date'),
  responseDate: timestamp('response_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// LinkedIn Accounts table
export const linkedinAccounts = pgTable('linkedin_accounts', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  connected: boolean('connected').default(false),
  requestsUsed: integer('requests_used').default(0),
  requestsLimit: integer('requests_limit').default(100),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaigns),
  leads: many(leads),
  linkedinAccounts: many(linkedinAccounts),
  sessions: many(sessions),
  accounts: many(accounts),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const campaignsRelations = relations(campaigns, ({ many, one }) => ({
  leads: many(leads),
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
}))

export const leadsRelations = relations(leads, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [leads.campaignId],
    references: [campaigns.id],
  }),
  user: one(users, {
    fields: [leads.userId],
    references: [users.id],
  }),
}))

export const linkedinAccountsRelations = relations(linkedinAccounts, ({ one }) => ({
  user: one(users, {
    fields: [linkedinAccounts.userId],
    references: [users.id],
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type Session = typeof sessions.$inferSelect
export type Account = typeof accounts.$inferSelect
export type Verification = typeof verifications.$inferSelect
export type Campaign = typeof campaigns.$inferSelect
export type Lead = typeof leads.$inferSelect
export type LinkedinAccount = typeof linkedinAccounts.$inferSelect

export type NewUser = typeof users.$inferInsert
export type NewSession = typeof sessions.$inferInsert
export type NewAccount = typeof accounts.$inferInsert
export type NewVerification = typeof verifications.$inferInsert
export type NewCampaign = typeof campaigns.$inferInsert
export type NewLead = typeof leads.$inferInsert
export type NewLinkedinAccount = typeof linkedinAccounts.$inferInsert
