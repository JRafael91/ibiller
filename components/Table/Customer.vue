<template>
	<div>
		<div class="flex flex-col justify-between gap-5 md:flex-row md:items-center">
			<UiInput v-model="search" type="search" placeholder="Buscador" class="w-full md:w-96" />
			<UiDropdownMenu>
				<UiDropdownMenuTrigger as-child>
					<UiButton variant="outline">
						<span>Columnas</span>
						<Icon name="lucide:chevron-down" class="h-4 w-4" />
					</UiButton>
				</UiDropdownMenuTrigger>
				<UiDropdownMenuContent :side-offset="10" align="start" class="w-[300px] md:w-[200px]">
					<UiDropdownMenuLabel> Columnas visibles </UiDropdownMenuLabel>
					<UiDropdownMenuSeparator />
					<UiDropdownMenuGroup>
						<UiDropdownMenuCheckboxItem
							v-for="column in table?.getAllColumns().filter((column) => column.getCanHide())"
							:key="column.id"
							:checked="column.getIsVisible()"
							@update:checked="tableRef?.toggleColumnVisibility(column)"
						>
							<span class="text-sm capitalize">{{ column?.columnDef.header }}</span>
						</UiDropdownMenuCheckboxItem>
					</UiDropdownMenuGroup>
				</UiDropdownMenuContent>
			</UiDropdownMenu>
		</div>
		<UiTanStackTable
			ref="tableRef"
			:search="search"
			:data="props.data"
			:columns="columns"
			class="mt-5 rounded-md border"
			@ready="table = $event"
		>
			<template #empty>
				<div class="flex w-full flex-col items-center justify-center gap-5 py-5">
					<Icon name="lucide:database" class="h-12 w-12 text-muted-foreground" />
					<span class="mt-2">No se encontraron resultados.</span>
				</div>
			</template>
		</UiTanStackTable>
	</div>
</template>

<script lang="ts" setup>
	import type { ColumnDef, Table } from "@tanstack/vue-table";
	import type { Customer } from "~/types/customer";

	const props = withDefaults(
		defineProps<{
			data: Customer[] | null;
		}>(),
		{
			data: () => [],
		}
	);

	const emit = defineEmits(["edit-customer", "customer-deleted"]);

	const tableRef = ref();
	const table = ref<Table<Customer> | null>(null);
	const search = ref("");

	const columns: ColumnDef<Customer>[] = [
		{
			accessorKey: "businessName",
			header: "Razón social",
			enableHiding: true,
		},
		{
			accessorKey: "commercialName",
			header: "Nombre comercial",
			enableHiding: true,
		},
		{ accessorKey: "rfc", header: "RFC", enableHiding: true },
		{
			accessorKey: "email",
			header: "Correo electrónico",
			enableHiding: true,
			cell: ({ row }) => {
				const date = new Date(row.original.createdAt);
				console.log("date =>", date);
				return h(
					"span",
					{},
					`${row.original.email} (${date.toLocaleDateString("es-MX", {
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
					})})`
				);
			},
		},
		{ accessorKey: "createdAt", header: "Creado", enableHiding: true },
		{
			accessorKey: "actions",
			header: "",
			enableSorting: false,
			enableHiding: false,
			cell: ({ row }) => {
				return h(
					resolveComponent("UiDropdownMenu"),
					{},
					{
						default: () => [
							h(
								resolveComponent("UiDropdownMenuTrigger"),
								{ asChild: true },
								{
									default: () =>
										h(
											resolveComponent("UiButton"),
											{ variant: "ghost", size: "icon", class: "w-9 h-9" },
											() => [
												h(resolveComponent("Icon"), {
													name: "lucide:more-horizontal",
													class: "h-4 w-4",
												}),
											]
										),
								}
							),
							h(
								resolveComponent("UiDropdownMenuContent"),
								{ align: "end", sideOffset: 5 },
								{
									default: () => [
										h(
											resolveComponent("UiDropdownMenuItem"),
											{
												onClick: () => details(row),
											},
											{
												default: () => [
													h(resolveComponent("Icon"), {
														name: "lucide:eye",
														class: "mr-2 h-4 w-4",
													}),
													"Ver detalle",
												],
											}
										),
										h(
											resolveComponent("UiDropdownMenuItem"),
											{
												onClick: () => {
													emit("edit-customer", row.original);
												},
											},
											{
												default: () => [
													h(resolveComponent("Icon"), {
														name: "lucide:edit",
														class: "mr-2 h-4 w-4",
													}),
													"Editar",
												],
											}
										),
										h(resolveComponent("UiDropdownMenuSeparator")),
										h(
											resolveComponent("UiDropdownMenuItem"),
											{
												onClick: () => remove(row),
												class: "text-destructive",
											},
											{
												default: () => [
													h(resolveComponent("Icon"), {
														name: "lucide:trash",
														class: "mr-2 h-4 w-4",
													}),
													"Eliminar",
												],
											}
										),
									],
								}
							),
						],
					}
				);
			},
		},
	];

	const details = (row: any) => {
		const customer = row.original;
	};

	const update = (row: any) => {
		const customer = row.original;
	};
	const remove = async (row: any) => {
		const customer = row.original as Customer;
		if (!customer.id) {
			alert("Error: ID de cliente no encontrado.");
			return;
		}

		if (!confirm(`¿Está seguro de que desea eliminar al cliente "${customer.businessName || customer.commercialName}"? Esta acción es irreversible.`)) {
			return;
		}

		try {
			// @ts-ignore
			const { data, error } = await useCustomFetch(`/api/customer/${customer.id}`, {
				method: "DELETE",
			});

			if (error.value) {
				console.error("Error al eliminar cliente:", error.value);
				alert(`Error al eliminar cliente: ${error.value.data?.message || error.value.message || 'Error desconocido'}`);
			} else {
				alert("Cliente eliminado correctamente.");
				emit("customer-deleted");
			}
		} catch (err) {
			console.error("Error inesperado al eliminar cliente:", err);
			alert("Se produjo un error inesperado al intentar eliminar el cliente.");
		}
	};
</script>
