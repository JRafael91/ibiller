import { safeParse } from "#shared/utils/business-schema.zod";
import { Role } from "~/types/role";

export default defineEventHandler(async (event) => {
	const session = event.context.session;
	setResponseStatus(event, 201);

	const body = await readBody(event);

	const result = safeParse(body);

	if (!result.success) {
		setResponseStatus(event, 422);
		throw createError({
			statusCode: 422,
			statusMessage: "Datos inválidados",
			data: result.error.format(),
		});
	}

	const db = useDB();

	const { rfc, ...data } = result.data;

	const findBusiness = await db.query.business.findFirst({
		where: eq(tables.business.rfc, rfc),
	});

	if (findBusiness) {
		setResponseStatus(event, 409);
		throw createError({
			statusCode: 409,
			statusMessage: "El RFC ya existe",
		});
	}

	const business = await db
		.insert(tables.business)
		.values({
			rfc,
			...data,
		})
		.returning();

	if (!business) {
		setResponseStatus(event, 500);
		throw createError({
			statusCode: 500,
			statusMessage: "Error al crear la empresa",
		});
	}

	const businessUser = await db.insert(tables.business_user).values({
		userId: session.user.id,
		businessId: business[0].id,
		role: Role.OWNER,
	});

	if (!businessUser) {
		setResponseStatus(event, 500);
		throw createError({
			statusCode: 500,
			statusMessage: "Error al crear el usuario de la empresa",
		});
	}

	return {
		message: "Empresa creada",
	};
});
