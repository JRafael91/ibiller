<template>
	<div>
		<form id="customerForm" class="form-grid" @submit.prevent="submit">
			<Field v-slot="{ componentField }" name="businessName">
				<UiFormItem label="Razón social" class="form-item-6">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="commercialName">
				<UiFormItem label="Nombre comercial" class="form-item-4">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="rfc">
				<UiFormItem label="RFC" class="form-item-2">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="address">
				<UiFormItem label="Dirección" class="form-item-4">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="zip">
				<UiFormItem label="Código postal" class="form-item-2">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="city">
				<UiFormItem label="Ciudad" class="form-item-2">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="state">
				<UiFormItem label="Estado" class="form-item-2">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="country">
				<UiFormItem label="País" class="form-item-2">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="email">
				<UiFormItem label="Correo electrónico" class="form-item-3">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="phone">
				<UiFormItem label="Teléfono" class="form-item-3">
					<UiInput v-bind="componentField" v-maska="'(##) #-###-##-##'" />
				</UiFormItem>
			</Field>
		</form>
		<div class="mt-4 flex justify-end gap-2">
			<UiButton variant="outline" type="button" class="mt-2 sm:mt-0" @click="emits('close')">
				Cerrar
			</UiButton>
			<UiButton
				type="submit"
				form="customerForm"
				:text="status == 'pending' ? 'Guardando' : 'Guardar'"
				:loading="status == 'pending'"
				:disabled="status == 'pending'"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { customerSchemaZod } from "#shared/utils/customer-schema.zod";
	import { vMaska } from "maska/vue";

	const emits = defineEmits(["close", "submit"]);

	const customerSchema = customerSchemaZod();

	const { handleSubmit, values } = useForm({
		validationSchema: toTypedSchema(customerSchema),
	});

	const { data, status, error, execute } = useCustomFetch("/api/customer", {
		immediate: false,
		method: "POST",
		watch: false,
		body: values,
	});

	const submit = handleSubmit(async () => {
		await execute();
		if (status.value === "success") {
			useSonner.success("Cliente guardado", {
				description: "El cliente ha sido guardado correctamente",
				position: "top-center",
			});
			emits("submit");
		} else if (status.value === "error") {
			useSonner.error("Error al guardar el cliente", {
				description: error.value?.message,
				position: "top-center",
			});
		}
	});
</script>

<style lang="css" scoped></style>
