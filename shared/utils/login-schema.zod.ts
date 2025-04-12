import { z } from "zod";

export const loginSchemaZod = () => {
	return z.object({
		email: z
			.string({ required_error: "Correo es requerido" })
			.email({ message: "Correo es inválido" }),
		password: z.string({ required_error: "Contraseña es requerida" }),
	});
};

export const safeParse = (values: any) => {
	return loginSchemaZod().safeParse(values);
};
