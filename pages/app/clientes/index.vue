<template>
	<div>
		<div class="flex justify-end">
			<UiButton @click="isSheetOpen = !isSheetOpen">
				<Icon name="lucide:plus" class="mr-2 h-4 w-4" />
				Nuevo
			</UiButton>
		</div>
		<TableCustomer class="mt-5" :data="data"></TableCustomer>
	</div>
	<FormsParentSheet
		title="Agregar cliente"
		description="Aquí puedes agregar un nuevo cliente."
		:isSheetOpen="isSheetOpen"
	>
		<FormsCustomer @submit="handleSave" @close="handleClose" />
	</FormsParentSheet>
</template>

<script lang="ts" setup>
	import type { Customer } from "~/types/customer";

	definePageMeta({
		layout: "dashboard",
		breadcrumb: [{ label: "Clientes", link: "/app/clientes" }],
	});
	useSeoMeta({
		title: "Clientes",
		description: "Listado de clientes",
	});

	const isSheetOpen = ref(false);

	const handleClose = () => {
		isSheetOpen.value = false;
	};
	const handleSave = async () => {
		isSheetOpen.value = false;
		await execute();
	};

	const { data, status, error, execute } = useCustomFetch<Customer[]>("/api/customer", {
		method: "GET",
	});
</script>

<style></style>
