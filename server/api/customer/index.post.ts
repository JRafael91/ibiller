import { safeParse } from "#shared/utils/customer-schema.zod";

export default defineEventHandler(async (event) => {
	setResponseStatus(event, 201);
	const businessId = getHeader(event, "x-business-id");

	if (!businessId) {
		setResponseStatus(event, 400);
		return {
			message: "Identificador de negocio no proporcionado",
		};
	}

	const body = await readBody(event);
	const result = safeParse(body);

	const db = useDB();

	if (!result.success) {
		setResponseStatus(event, 422);
		throw createError({
			statusCode: 422,
			statusMessage: "Datos inválidos",
			data: result.error.format(),
		});
	}
	const { rfc, ...data } = result.data;

	console.log("Data", data);

	const findCustomerByRfc = await db.query.customer.findFirst({
		where: eq(tables.customer.rfc, rfc ?? ""),
	});

	if (findCustomerByRfc) {
		setResponseStatus(event, 400);
		throw createError({
			statusCode: 409,
			message: "El RFC ya existe",
		});
	}

	const customer = await db
		.insert(tables.customer)
		.values({
			rfc,
			...data,
			businessId,
		})
		.returning();

	if (!customer) {
		setResponseStatus(event, 500);
		throw createError({
			statusCode: 500,
			message: "Error al crear el cliente",
		});
	}

	return {
		message: "Cliente creado correctamente",
	};
});
