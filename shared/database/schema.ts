import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';

const timestampsColumns = {
  created_at: t
    .text()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: t.text().default(sql`CURRENT_TIMESTAMP`),
  deleted_at: t.text().default('NULL'),
};

export const users = t.pgTable('users', {
  id: t.uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: t.text('name').notNull(),
  email: t.text('email').notNull().unique(),
  password: t.text('password').notNull(),
  ...timestampsColumns,
});

export const business = t.pgTable('business', {
  id: t.uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: t.text('name').notNull(),
  rfc: t.text('rfc').notNull().unique(),
  address: t.text('address'),
  zip: t.text('zip'),
  city: t.text('city'),
  state: t.text('state'),
	country: t.text('country'),
	email: t.text('email'),
	phone: t.text('phone'),
	logo: t.text('logo'),
	...timestampsColumns
});

export const business_user = t.pgTable('business_user', {
	id: t.serial('id').primaryKey(),
	user_id: t.uuid('user_id').notNull()
  .references(() => users.id),
	business_id: t.uuid('business_id').notNull()
  .references(() => business.id),
	role: t.text('role').notNull(),
	...timestampsColumns,
});