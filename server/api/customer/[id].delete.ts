export default defineEventHandler(async (event) => {
	const id = event.context.params?.id as string;

	if (!id) {
		setResponseStatus(event, 400);
		return {
			message: "Identificador de cliente no proporcionado",
		};
	}

	const db = useDB();

	try {
		const updatedCustomer = await db
			.update(tables.customer)
			.set({
				deletedAt: new Date(),
				active: false,
			})
			.where(eq(tables.customer.id, id))
			.returning({ id: tables.customer.id }); // Only return id, or more fields if needed

		if (!updatedCustomer || updatedCustomer.length === 0) {
			setResponseStatus(event, 404); // Changed to 404 if not found
			return {
				message: "Cliente no encontrado",
			};
		}

		return {
			message: "Cliente desactivado correctamente",
			customer: updatedCustomer[0],
		};
	} catch (error) {
		console.error("Error al desactivar el cliente:", error);
		setResponseStatus(event, 500);
		return {
			message: "Error al desactivar el cliente",
		};
	}
});
