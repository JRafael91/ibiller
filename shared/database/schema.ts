import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";

const timestampsColumns = {
	createdAt: t
		.timestamp("created_at")
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: t.timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
	deletedAt: t.timestamp("deleted_at"),
};

export const user = t.pgTable("user", {
	id: t.text("id").primaryKey(),
	name: t.text("name").notNull(),
	email: t.text("email").notNull().unique(),
	emailVerified: t.boolean("email_verified").notNull(),
	image: t.text("image"),
	...timestampsColumns,
});

export const usersRelations = relations(user, ({ many }) => ({
	business_user: many(business_user),
}));

export const session = t.pgTable("session", {
	id: t.text("id").primaryKey(),
	token: t.text("token").notNull().unique(),
	expiresAt: t.timestamp("expires_at").notNull(),
	ipAddress: t.text("ip_address"),
	userAgent: t.text("user_agent"),
	userId: t
		.text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	...timestampsColumns,
});

export const account = t.pgTable("account", {
	id: t.text("id").primaryKey(),
	accountId: t.text("account_id").notNull(),
	providerId: t.text("provider_id").notNull(),
	userId: t
		.text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: t.text("access_token"),
	refreshToken: t.text("refresh_token"),
	idToken: t.text("id_token"),
	accessTokenExpiresAt: t.timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: t.timestamp("refresh_token_expires_at"),
	scope: t.text("scope"),
	password: t.text("password"),
	...timestampsColumns,
});

export const verification = t.pgTable("verification", {
	id: t.text("id").primaryKey(),
	identifier: t.text("identifier").notNull(),
	value: t.text("value").notNull(),
	expiresAt: t.timestamp("expires_at").notNull(),
	...timestampsColumns,
});

export const business = t.pgTable("business", {
	id: t.uuid("id").primaryKey().defaultRandom(),
	name: t.text("name").notNull(),
	rfc: t.text("rfc").notNull().unique(),
	address: t.text("address"),
	zip: t.text("zip"),
	city: t.text("city"),
	state: t.text("state"),
	country: t.text("country"),
	email: t.text("email"),
	phone: t.text("phone"),
	logo: t.text("logo"),
	...timestampsColumns,
});

export const businessRelations = relations(business, ({ many }) => ({
	business_user: many(business_user),
}));

export const business_user = t.pgTable("business_user", {
	id: t.serial("id").primaryKey(),
	userId: t
		.text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	businessId: t
		.uuid("business_id")
		.notNull()
		.references(() => business.id, { onDelete: "cascade" }),
	role: t.text("role").notNull(),
	...timestampsColumns,
});

export const businessUserRelations = relations(business_user, ({ one }) => ({
	business: one(business, {
		fields: [business_user.businessId],
		references: [business.id],
	}),
	user: one(user, {
		fields: [business_user.userId],
		references: [user.id],
	}),
}));
