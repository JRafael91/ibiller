<template>
	<div class="">
		<NuxtLink :to="{ name: 'app-cotizaciones-nuevo' }" as-child>
			<UiButton>
				<Icon name="lucide:plus" class="mr-2 h-4 w-4" />
				Nueva cotización
			</UiButton>
		</NuxtLink>
		<TableQuotation class="mt-5"></TableQuotation>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		layout: "dashboard",
		breadcrumb: [{ label: "Cotizaciones", link: "/app/cotizaciones" }],
	});
	useSeoMeta({
		title: "Cotizaciones",
		description: "Lista de cotizaciones",
	});
</script>

<style></style>
