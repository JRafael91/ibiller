export default defineEventHandler(async (event) => {
	setResponseStatus(event, 200);
	const businessId = getHeader(event, "x-business-id");

	if (!businessId) {
		setResponseStatus(event, 400);
		return {
			message: "Identificador de negocio no proporcionado",
		};
	}

	const db = useDB();

	const customers = await db.query.customer.findMany({
		where: and(eq(tables.customer.businessId, businessId), eq(tables.customer.active, true)),
		orderBy: [asc(tables.customer.businessName)],
	});

	return customers;
});
