import { z}  from 'zod';
export const signupSchemaZod = () => {
  return z.object({
		name: z
			.string({ required_error: "Nombre es requerido" })
			.min(3, { message: "Mínimo 3 caracteres" }),
		email: z
			.string({ required_error: "Email es requerido" })
			.email({ message: "Email es inválido" }),
		password: z
			.string({ required_error: "Contraseña es requerida" })
			.min(8, { message: "" })
			.refine((value) => /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value), {
				message: "",
			}),
	});
}

export const safeParse = (values: any) => {
  return signupSchemaZod().safeParse(values);
}