<template>
	<div>
		<h2>Soy el dashboard</h2>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		layout: "dashboard",
		breadcrumb: [{ label: "Dashboard", link: "/app" }],
	});
	useSeoMeta({
		title: "Dashboard",
		description: "Tablero de control",
	});
</script>

<style></style>
