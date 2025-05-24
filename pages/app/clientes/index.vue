<template>
	<div>
		<div class="flex justify-end">
			<UiButton @click="openNewClientSheet">
				<Icon name="lucide:plus" class="mr-2 h-4 w-4" />
				Nuevo
			</UiButton>
		</div>
		<TableCustomer class="mt-5" :data="data" @edit-customer="handleEditCustomer" />
		<FormsParentSheet
			:title="isEditMode ? 'Editar Cliente' : 'Agregar cliente'"
			:description="
				isEditMode ? 'Actualiza los datos del cliente.' : 'Aquí puedes agregar un nuevo cliente.'
			"
			:is-sheet-open="isSheetOpen"
		>
			<FormsCustomer
				:initial-data="isEditMode ? editingCustomer : null"
				@submit="handleSave"
				@close="handleClose"
			/>
		</FormsParentSheet>
	</div>
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
	const isEditMode = ref(false);
	const editingCustomer = ref<Customer | null>(null);

	const openNewClientSheet = () => {
		isEditMode.value = false;
		editingCustomer.value = null;
		isSheetOpen.value = true;
	};

	const handleEditCustomer = (customer: Customer) => {
		editingCustomer.value = customer;
		isEditMode.value = true;
		isSheetOpen.value = true;
	};

	const handleClose = () => {
		isSheetOpen.value = false;
		isEditMode.value = false;
		editingCustomer.value = null;
	};
	const handleSave = async () => {
		isSheetOpen.value = false;
		isEditMode.value = false;
		editingCustomer.value = null;
		await execute();
	};

	const { data, execute } = useCustomFetch<Customer[]>("/api/customer", {
		method: "GET",
	});
</script>

<style></style>
