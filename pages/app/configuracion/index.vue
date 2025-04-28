<template>
	<div class="grid grid-cols-2 gap-4">
		<UiCard class="p-4">
			<AccountBusiness />
		</UiCard>
		<UiCard class="col-start-1">
			<AccountBusiness />
		</UiCard>
	</div>
	<div>
		<h2>Soy las configuraciones del negocio</h2>
	</div>
</template>

<script lang="ts" setup>
	definePageMeta({
		layout: "dashboard",
		breadcrumb: [{ label: "Configuración", link: "/app/configuracion" }],
	});
</script>

<style></style>
