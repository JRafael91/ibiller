import { z } from "zod";

export const businessSchemaZod = () => {
	return z.object({
		name: z.string({ required_error: "El nombre de la empresa es requerido" }),
		rfc: z
			.string({ required_error: "El RFC es requerido" })
			.min(12, { message: "El RFC debe tener 12 o 13 caracteres" })
			.max(13, { message: "El RFC debe tener 12 o 13 caracteres" }),
		address: z.string().min(3, { message: "La dirección es requerida" }).nullable().optional(),
		zip: z.string().min(3, { message: "El código postal es requerido" }).nullable().optional(),
		city: z.string().min(3, { message: "La ciudad es requerida" }).nullable().optional(),
		state: z.string().min(3, { message: "El estado es requerido" }).nullable().optional(),
		country: z.string().min(3, { message: "El país es requerido" }).nullable().optional(),
		email: z.string().email({ message: "El correo no es válido" }).nullable().optional(),
		phone: z
			.string()
			.min(16, { message: "Teléfono de 10 números" })
			.max(16, { message: "Teléfono de 10 números" })
			.nullable()
			.optional(),
	});
};

export const safeParse = (values: any) => {
	return businessSchemaZod().safeParse(values);
};
