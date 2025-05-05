import { safeParse } from "~/shared/utils/customer-schema.zod";

export default defineEventHandler(async (event) => {
	const id = event.context.params?.id as string;

	if (!id) {
		setResponseStatus(event, 400);
		return {
			message: "Identificador de cliente no proporcionado",
		};
	}

	const body = await readBody(event);
	const result = safeParse(body);

	if (!result.success) {
		setResponseStatus(event, 422);
		throw createError({
			statusCode: 422,
			statusMessage: "Datos inválidos",
			data: result.error.format(),
		});
	}

	const db = useDB();

	const { rfc, ...data } = result.data;

	const findCustomerByRfc = await db.query.customer.findFirst({
		where: eq(tables.customer.rfc, rfc ?? ""),
	});

	if (findCustomerByRfc && findCustomerByRfc.id !== id) {
		setResponseStatus(event, 400);
		throw createError({
			statusCode: 409,
			statusMessage: "El RFC ya existe",
		});
	}

	const customer = await db
		.update(tables.customer)
		.set({
			...data,
			rfc,
		})
		.where(eq(tables.customer.id, id))
		.returning();
	if (!customer) {
		setResponseStatus(event, 500);
		throw createError({
			statusCode: 500,
			statusMessage: "Error al actualizar el cliente",
		});
	}

	return "Cliente actualizado correctamente";
});
