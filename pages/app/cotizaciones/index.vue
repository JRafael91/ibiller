<template>
	<div>
		<h2>Soy el index de cotizaciones</h2>
		<NuxtLink :to="{ name: 'app-cotizaciones-nuevo' }" as-child>
			<UiButton> Nueva cotización </UiButton>
		</NuxtLink>
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
