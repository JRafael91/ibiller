<template>
	<div>
		<h2>Soy los productos</h2>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		layout: "dashboard",
		breadcrumb: [{ label: "Productos", link: "/app/productos" }],
	});
	useSeoMeta({
		title: "Productos",
		description: "Lista de productos",
	});
</script>

<style></style>
