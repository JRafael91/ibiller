<template>
	<div>
		<form class="w-full space-y-4" @submit.prevent="submit">
			<Field v-slot="{ componentField }" name="name">
				<UiFormItem label="Razón social">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="rfc">
				<UiFormItem label="RFC">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="address">
				<UiFormItem label="Dirección">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="zip">
				<UiFormItem label="Código postal">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="city">
				<UiFormItem label="Ciudad">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="state">
				<UiFormItem label="Estado">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="country">
				<UiFormItem label="País">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="email">
				<UiFormItem hint="Opcional" label="Correo electrónico">
					<UiInput v-bind="componentField" />
				</UiFormItem>
			</Field>
			<Field v-slot="{ componentField }" name="phone">
				<UiFormItem hint="Opcional" label="Teléfono">
					<UiInput v-bind="componentField" v-maska="'(##) #-###-##-##'" />
				</UiFormItem>
			</Field>
			<div class="mt-4 flex justify-end gap-2">
				<UiButton variant="outline" type="button" class="mt-2 sm:mt-0" @click="emits('close')">
					Cerrar
				</UiButton>
				<UiButton type="submit">Guardar</UiButton>
			</div>
		</form>
	</div>
</template>

<script lang="ts" setup>
	import { businessSchemaZod } from "#shared/utils/business-schema.zod";
	import { vMaska } from "maska/vue";

	const emits = defineEmits(["close", "submit"]);

	const businessSchema = businessSchemaZod();

	const { handleSubmit, values } = useForm({
		validationSchema: toTypedSchema(businessSchema),
	});

	const { data, status, error, execute } = useFetch("/api/business", {
		immediate: false,
		watch: false,
		method: "POST",
		body: values,
	});

	const submit = handleSubmit(async () => {
		await execute();
		if (status.value === "success") {
			useSonner.success("Negocio creado!", {
				description: "Se ha creado correctamente negocio.",
			});
			emits("submit");
		} else if (status.value === "error") {
			useSonner.error("Ocurrió un error", {
				description: error.value?.statusMessage,
			});
		}
	});
</script>

<style></style>
