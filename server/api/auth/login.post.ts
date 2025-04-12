import { safeParse } from "#shared/utils/login-schema.zod";

export default defineEventHandler(async (event) => {
	setResponseStatus(event, 200);

	const body = await readBody(event);
	const result = safeParse(body);
	if (!result.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Datos inválidos",
			data: result.error.format(),
		});
	}

	const db = useDB();
	const { email, password } = result.data;
	const findUser = await db.query.users.findFirst({
		where: eq(tables.users.email, email),
	});
	if (!findUser) {
		throw createError({
			statusCode: 400,
			statusMessage: "Usuario y/o contraseña incorrectos",
		});
	}
	console.log(findUser);
	const isPasswordValid = await verifyPassword(findUser.password, password);
	if (!isPasswordValid) {
		throw createError({
			statusCode: 400,
			statusMessage: "Usuario y/o contraseña incorrectos",
		});
	}
	const { password: _, ...user } = findUser;

	return {
		message: "Usuario ha iniciado sesión",
		user,
	};
});
