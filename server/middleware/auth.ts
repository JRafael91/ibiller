import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
	if (!event.path.startsWith("/api")) {
		// console.log("No es una ruta de API");
		return;
	}

	if (event.path.startsWith("/api/auth")) {
		// console.log("Es una ruta de autenticación");
		return;
	}

	const session = await auth.api.getSession({
		headers: event.headers,
	});

	if (!session) {
		return sendError(event, createError({ statusCode: 401, statusMessage: "No autorizado" }));
	}
	event.context.session = session;
});
