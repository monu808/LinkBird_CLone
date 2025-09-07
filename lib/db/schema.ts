import { pgTable, serial, text, timestamp, boolean, integer, varchar } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table (Better Auth compatible)
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: boolean('emailVerified').default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// Sessions table (Better Auth)
export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// Accounts table (Better Auth - for OAuth providers)
export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// Verification table (Better Auth - for email verification)
export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

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
