import { z } from "zod";

export const customerSchemaZod = () => {
	return z.object({
		businessName: z.string({ required_error: "Razón social es requerida" }),
		commercialName: z.string().nullable().optional(),
		rfc: z
			.string()
			.min(12, { message: "RFC debe tener 12 o 13 caracteres" })
			.max(13, { message: "RFC debe tener 12 o 13 caracteres" })
			.nullable()
			.optional(),
		address: z.string().min(3, { message: "Dirección es requerida" }).nullable().optional(),
		zip: z.string().min(3, { message: "Código postal es requerido" }).nullable().optional(),
		city: z.string().min(3, { message: "Ciudad es requerida" }).nullable().optional(),
		state: z.string().min(3, { message: "Estado es requerido" }).nullable().optional(),
		country: z.string().min(3, { message: "País es requerido" }).nullable().optional(),
		email: z.string().email({ message: "Correo no válido" }).nullable().optional(),
		phone: z
			.string()
			.min(16, { message: "Teléfono de 10 números" })
			.max(16, { message: "Teléfono de 10 números" })
			.nullable()
			.optional(),
	});
};

export const safeParse = (values: any) => {
	return customerSchemaZod().safeParse(values);
};
