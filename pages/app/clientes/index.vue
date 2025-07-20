<template>
	<div>
		<div class="flex justify-end">
			<UiButton @click="openNewClientSheet">
				<Icon name="lucide:plus" class="mr-2 h-4 w-4" />
				Nuevo
			</UiButton>
		</div>
		<TableCustomer
			class="mt-5"
			:data="data"
			@edit-customer="handleEditCustomer"
			@delete-customer="handleDeleteCustomer"
		/>
		<UiAlertDialog v-model:open="isDeleteDialogOpen">
			<UiAlertDialogContent>
				<UiAlertDialogHeader>
					<UiAlertDialogTitle>Eliminar cliente</UiAlertDialogTitle>
					<UiAlertDialogDescription>
						¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.
					</UiAlertDialogDescription>
				</UiAlertDialogHeader>
				<UiAlertDialogFooter>
					<UiAlertDialogCancel @click="closeDeleteDialog">Cancelar</UiAlertDialogCancel>
					<UiAlertDialogAction @click="confirmDeleteCustomer">Eliminar</UiAlertDialogAction>
				</UiAlertDialogFooter>
			</UiAlertDialogContent>
		</UiAlertDialog>
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

	const customerToDelete = ref<Customer | null>(null);
	const isDeleteDialogOpen = ref(false);

	const handleDeleteCustomer = (customer: Customer) => {
		customerToDelete.value = customer;
		isDeleteDialogOpen.value = true;
	};

	const closeDeleteDialog = () => {
		isDeleteDialogOpen.value = false;
		customerToDelete.value = null;
	};

	const confirmDeleteCustomer = async () => {
		if (!customerToDelete.value) return;
		try {
			await useCustomFetch(`/api/customer/${customerToDelete.value.id}`, {
				method: "DELETE",
			});
			useSonner.success("Cliente eliminado correctamente", {
				position: "top-center",
			});
			closeDeleteDialog();
			await execute();
		} catch (error) {
			console.log("Error deleting customer:", error);
			useSonner.error("Error al eliminar el cliente", {
				description: "No se pudo eliminar el cliente. Inténtalo de nuevo más tarde.",
				position: "top-center",
			});
		}
	};

	const { data, execute } = useCustomFetch<Customer[]>("/api/customer", {
		method: "GET",
	});
</script>

<style></style>
