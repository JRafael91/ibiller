import {
	account,
	business_user,
	businessRelations,
	businessUserRelations,
	session,
	user,
	usersRelations,
	verification,
} from "#shared/database/schema";
import * as schema from "#shared/database/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/postgres-js";

const db = drizzle(process.env.DATABASE_URL!, {
	schema,
});

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	plugins: [
		customSession(async ({ session }) => {
			const user = await db.query.user.findFirst({
				where: eq(schema.user.id, session.userId),
				with: {
					plan: {
						columns: {
							id: true,
							name: true,
							dateStart: true,
							dateEnd: true,
							period: true,
						},
					},
					business_user: {
						columns: {
							id: true,
							role: true,
						},
						with: {
							business: true,
						},
					},
				},
			});
			return {
				user,
				session,
			};
		}),
	],
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
		window: 60, // time window in seconds
		max: 100, // max requests in the window
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 3600, // Cache duration in seconds
		},
	},
});
