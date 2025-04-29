<template>
	<div class="flex flex-col">
		<form action="">
			<fieldset class="flex flex-row gap-4 p-4">
				<legend>Información de cotización</legend>
				<Field name="folio">
					<UiFormItem label="Folio">
						<UiInput />
					</UiFormItem>
				</Field>
				<Field name="folio">
					<UiFormItem label="Fecha">
						<UiInput />
					</UiFormItem>
				</Field>
			</fieldset>
			<fieldset class="flex flex-row flex-wrap gap-4 p-4">
				<legend>Información de cliente</legend>
				<Field name="name">
					<UiFormItem label="Nombre" class="w-full md:w-[calc(50%-0.5rem)]">
						<UiInput />
					</UiFormItem>
				</Field>
				<Field name="rfc">
					<UiFormItem label="RFC" class="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.5rem)]">
						<UiInput />
					</UiFormItem>
				</Field>
				<Field name="address">
					<UiFormItem label="Dirección" class="w-full md:w-[calc(30%-0.5rem)]">
						<UiInput />
					</UiFormItem>
				</Field>
				<Field name="zip">
					<UiFormItem label="Código postal">
						<UiInput />
					</UiFormItem>
				</Field>
				<Field name="city">
					<UiFormItem label="Ciudad">
						<UiInput />
					</UiFormItem>
				</Field>
				<Field name="state">
					<UiFormItem label="Estado">
						<UiInput />
					</UiFormItem>
				</Field>
				<Field name="country">
					<UiFormItem label="País">
						<UiInput />
					</UiFormItem>
				</Field>
				<Field name="email">
					<UiFormItem label="Correo electrónico">
						<UiInput />
					</UiFormItem>
				</Field>
				<Field name="phone">
					<UiFormItem label="Teléfono">
						<UiInput v-maska="'(##) #-###-##-##'" />
					</UiFormItem>
				</Field>
			</fieldset>
			<fieldset class="flex flex-row flex-wrap gap-4 p-4">
				<legend>Productos/Servicios</legend>
			</fieldset>
		</form>
	</div>
</template>

<script lang="ts" setup>
	import { vMaska } from "maska/vue";

	definePageMeta({
		layout: "dashboard",
		breadcrumb: [
			{ label: "Cotizaciones", link: "/app/cotizaciones" },
			{ label: "Nueva cotización", link: "/app/cotizaciones/nuevo" },
		],
	});
</script>

<style></style>
