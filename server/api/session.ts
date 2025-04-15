export default defineEventHandler(async (event) => {
	const session = event.context.session;
	const db = useDB();
	const user = await db.query.user.findFirst({
		where: eq(tables.user.id, session.user.id),
		with: {
			business_user: true,
		},
	});
	return user;
});
