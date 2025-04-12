import { safeParse } from "#shared/utils/signup-schema.zod";

export default defineEventHandler(async (event) => {
	setResponseStatus(event, 201);
	const responseMessage = {
		message: "Usuario ha sido registrado",
	};
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

	const { email, name, password } = result.data;
	const hashedPassword = await hashPassword(password);
	const findUser = await db.query.users.findFirst({
		where: eq(tables.users.email, email),
	});
	if (findUser) {
		return responseMessage;
	}
	const newUser = await db.insert(tables.users).values({
		email,
		name,
		password: hashedPassword,
	});
	if (!newUser) {
		throw createError({
			statusCode: 500,
			statusMessage: "Fallo al registrar el usuario",
		});
	}
	return responseMessage;
});
