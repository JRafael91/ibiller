<template>
	<pre>{{ formData }}</pre>
	<div class="flex w-full">
		<UiTabs v-model="currentTab" :default-value="0">
			<UiTabsList :pill="true" class="relative grid w-full grid-cols-4">
				<UiTabsTrigger :pill="false" :value="0">Datos de empresa</UiTabsTrigger>
				<UiTabsTrigger :pill="false" :value="1" :disabled="!disabledCustomer"
					>Datos de cliente</UiTabsTrigger
				>
				<UiTabsTrigger :pill="false" :value="2">Productos</UiTabsTrigger>
				<UiTabsTrigger :pill="false" :value="3" :disabled="!disabledPayment">Cuenta</UiTabsTrigger>
				<UiTabsIndicator />
			</UiTabsList>
			<UiTabsContent :value="0">
				<UiQuotationBusiness
					v-model:business="formData.business"
					v-model:disabled="disabledCustomer"
					@goToPage="goToPage"
				/>
			</UiTabsContent>
			<UiTabsContent :value="1">
				<UiQuotationCustomer
					v-model:customer="formData.customer"
					v-model:disabled="disabledProducts"
					@goToPage="goToPage"
				/>
			</UiTabsContent>
			<UiTabsContent :value="2">
				<UiQuotationProducts
					v-model:products="formData.products"
					v-model:disabled="disabledPayment"
					@goToPage="goToPage"
				/>
			</UiTabsContent>
			<UiTabsContent :value="3"> </UiTabsContent>
		</UiTabs>
	</div>
	<div class="mt-4 flex justify-end gap-4">
		<UiButton v-if="currentTab > 0" type="button" @click="goToPage(-1)">
			<Icon class="size-4" name="lucide:arrow-left" />
			Anterior
		</UiButton>
		<UiButton v-if="currentTab < 3" type="submit" form="form">
			Siguiente
			<Icon class="size-4" name="lucide:arrow-right" />
		</UiButton>
		<UiButton v-if="currentTab == 3" type="submit" form="form">
			<Icon class="size-4" name="lucide:file-text" />
			Generar PDF
		</UiButton>
	</div>
</template>

<script lang="ts" setup>
	import { z } from "zod";

	const currentTab = ref(0);
	const disabledCustomer = ref(false);
	const disabledProducts = ref(false);
	const disabledPayment = ref(false);

	const businessSchema = z.object({
		folio: z.string().min(1, { message: "El folio es requerido" }),
		date_quotation: z.date({ required_error: "La fecha de cotización es requerida" }),
		date_expiration: z.date({ required_error: "La fecha de expiración es requerida" }),
		businessName: z.string().min(1, { message: "El nombre de la empresa es requerido" }),
		businessRfc: z
			.string()
			.min(12, { message: "El RFC debe tener 12 o 13 caracteres" })
			.max(13, { message: "El RFC debe tener 12 o 13 caracteres" }),
		businessAddress: z.string().min(3, { message: "La dirección es requerida" }),
		businessZip: z.string().min(3, { message: "El código postal es requerido" }),
		businessCity: z.string().min(3, { message: "La ciudad es requerida" }),
		businessState: z.string().min(3, { message: "El estado es requerido" }),
		businessCountry: z.string().min(3, { message: "El país es requerido" }),
		businessEmail: z.string().email({ message: "El correo no es válido" }).nullable().optional(),
		businessPhone: z
			.string()
			.min(16, { message: "Teléfono de 10 números" })
			.max(16, { message: "Teléfono de 10 números" })
			.nullable()
			.optional(),
	});

	const clientSchema = z.object({
		clientName: z.string().min(1, { message: "El nombre de la empresa es requerido" }),
		clientRfc: z
			.string()
			.min(12, { message: "El RFC debe tener 12 o 13 caracteres" })
			.max(13, { message: "El RFC debe tener 12 o 13 caracteres" }),
		clientAddress: z.string().min(3, { message: "La dirección es requerida" }),
		clientZip: z.string().min(3, { message: "El código postal es requerido" }),
		clientCity: z.string().min(3, { message: "La ciudad es requerida" }),
		clientState: z.string().min(3, { message: "El estado es requerido" }),
		clientCountry: z.string().min(3, { message: "El país es requerido" }),
		clientEmail: z.string().email({ message: "El correo no es válido" }).nullable().optional(),
		clientPhone: z
			.string()
			.min(16, { message: "Teléfono de 10 números" })
			.max(16, { message: "Teléfono de 10 números" })
			.nullable()
			.optional(),
	});

	const productSchema = z.object({
		id: z.string().min(1, { message: "El ID del producto es requerido" }),
		name: z.string().min(1, { message: "El nombre del producto es requerido" }),
		quantity: z.number().min(1, { message: "La cantidad es requerida" }),
		price: z.number().min(0, { message: "El precio es requerido" }),
		description: z.string().optional(),
	});

	const formSchema = z.object({
		...businessSchema.shape,
		...clientSchema.shape,
		products: z.array(productSchema).nonempty({ message: "Se requiere al menos un producto" }),
	});

	export type FormValues = z.infer<typeof formSchema>;

	const form = useForm<FormValues>({
		initialValues: {
			folio: "",
			date_quotation: new Date(),
			date_expiration: new Date(),
			businessName: "",
			businessRfc: "",
			businessAddress: "",
			businessZip: "",
			businessCity: "",
			businessState: "",
			businessCountry: "",
			businessEmail: null,
			businessPhone: null,
			clientName: "",
			clientRfc: "",
			clientAddress: "",
			clientZip: "",
			clientCity: "",
			clientState: "",
			clientCountry: "",
			clientEmail: null,
			clientPhone: null,
			products: [
				{
					id: generateUniqueId(),
					name: "",
					quantity: 1,
					price: 0,
					description: "",
				},
			],
		},
		validationSchema: toTypedSchema(formSchema),
	});

	const { fields, push, remove } = useFieldArray("products");

	const formData: any = reactive({
		business: {
			folio: "",
			date_quotation: new Date(),
			date_expiration: new Date(),
			name: "",
			rfc: "",
			address: "",
			zip: "",
			city: "",
			state: "",
			country: "",
			email: null,
			phone: null,
		},
		customer: {
			name: "",
			rfc: "",
			address: "",
			zip: "",
			city: "",
			state: "",
			country: "",
			email: null,
			phone: null,
		},
		products: [
			{
				id: generateUniqueId(),
				name: "",
				quantity: 1,
				price: 0,
				description: "",
			},
		],
	});

	const goToPage = (value: number) => {
		currentTab.value += value;
	};

	const submit = () => {
		console.log("submit");
	};
</script>
