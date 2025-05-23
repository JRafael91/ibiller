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
		setResponseStatus(event, 409); // Align status code for conflict
		throw createError({
			statusCode: 409,
			statusMessage: "El RFC ya está en uso por otro cliente", // More specific message
		});
	}

	const updatedCustomerResult = await db
		.update(tables.customer)
		.set({
			...data,
			rfc, // rfc will be undefined if not in body and optional, leading to NULL if DB column allows
		})
		.where(eq(tables.customer.id, id))
		.returning();

	// Check if the update was successful and if any row was actually updated.
	if (!updatedCustomerResult || updatedCustomerResult.length === 0) {
		setResponseStatus(event, 404); // Not found
		throw createError({
			statusCode: 404,
			statusMessage: "Cliente no encontrado para actualizar",
		});
	}

	return { message: "Cliente actualizado correctamente" }; // Standardized JSON response
});
