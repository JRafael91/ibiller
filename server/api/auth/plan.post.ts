import { Period } from "~/types/period";
import { Plan } from "~/types/plan";

export default defineEventHandler(async (event) => {
	setResponseStatus(event, 201);

	const body = await readBody(event);

	const db = useDB();

	const findPlan = await db.query.plan.findFirst({
		where: eq(tables.plan.userId, body.userId),
	});

	if (!findPlan) {
		await db.insert(tables.plan).values({
			name: Plan.FREE,
			price: 0,
			dateStart: new Date(),
			dateEnd: null,
			period: Period.FREE,
			userId: body.userId,
		});
	}

	return {
		message: "Plan creado",
	};
});
