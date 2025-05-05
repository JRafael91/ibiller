export default defineEventHandler(async (event) => {
	const id = event.context.params?.id as string;

	if (!id) {
		setResponseStatus(event, 400);
		return {
			message: "Identificador de cliente no proporcionado",
		};
	}

	const db = useDB();

	const customer = await db.delete(tables.customer).where(eq(tables.customer.id, id)).returning();

	if (!customer) {
		setResponseStatus(event, 500);
		throw createError({
			statusCode: 500,
			statusMessage: "Error al eliminar el cliente",
		});
	}

	return "Cliente eliminado correctamente";
});
