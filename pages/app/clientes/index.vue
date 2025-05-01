<template>
	<div>
		<NuxtLink :to="{ name: 'app-cotizaciones-nuevo' }" as-child>
			<UiButton>
				<Icon name="lucide:plus" class="mr-2 h-4 w-4" />
				Nuevo cliente
			</UiButton>
		</NuxtLink>
		<TableCustomer class="mt-5"></TableCustomer>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		layout: "dashboard",
		breadcrumb: [{ label: "Clientes", link: "/app/clientes" }],
	});
	useSeoMeta({
		title: "Clientes",
		description: "Listado de clientes",
	});
</script>

<style></style>
