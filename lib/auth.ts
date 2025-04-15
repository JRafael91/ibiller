import { account, session, user, verification } from "#shared/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle(process.env.DATABASE_URL!);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: { user, session, account, verification },
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		sendConfirmationEmail: false,
		requireEmailVerification: false,
	},
	advanced: {
		cookiePrefix: process.env.COOKIE_PREFIX,
	},
	rateLimit: {
		enabled: true,
		window: 60, // time window in seconds
		max: 30, // max requests in the window
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 3600, // Cache duration in seconds
		},
	},
});
