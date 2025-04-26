<template>
	<UiSidebarProvider v-slot="{ isMobile, state }">
		<!-- App Sidebar -->
		<UiSidebar collapsible="icon">
			<!-- Team switcher -->
			<UiSidebarHeader>
				<UiSidebarMenu>
					<UiSidebarMenuItem>
						<UiDropdownMenu>
							<UiDropdownMenuTrigger as-child>
								<UiSidebarMenuButton
									size="lg"
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-0"
								>
									<div
										class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
									>
										<Icon mode="svg" name="lucide:building-2" class="size-4" />
									</div>
									<div class="grid flex-1 text-left text-sm leading-tight">
										<span class="truncate font-semibold">
											{{ businessActive?.business.name ?? "Negocio no seleccionado" }}
										</span>
										<span class="truncate text-xs">{{ businessActive?.business.rfc }}</span>
									</div>
									<Icon mode="svg" name="lucide:chevrons-up-down" class="ml-auto" />
								</UiSidebarMenuButton>
							</UiDropdownMenuTrigger>
							<UiDropdownMenuContent
								class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								align="start"
								:side="isMobile ? 'bottom' : 'right'"
								:side-offset="4"
							>
								<UiDropdownMenuLabel class="text-xs text-muted-foreground">
									Negocios
								</UiDropdownMenuLabel>
								<template v-for="(business, index) in user.business_user" :key="index">
									<UiDropdownMenuItem
										class="cursor-pointer gap-2 p-2"
										:class="[business.business.name == businessActive.business.name && 'bg-muted']"
									>
										<!-- @click="activeTeam = team" -->
										<div class="flex size-6 items-center justify-center rounded-sm border">
											<Icon mode="svg" name="lucide:gallery-vertical-end" class="size-4 shrink-0" />
										</div>
										{{ business.business.name }}
										<UiDropdownMenuShortcut>⌘{{ index + 1 }}</UiDropdownMenuShortcut>
									</UiDropdownMenuItem>
								</template>
								<UiDropdownMenuSeparator />
								<UiDropdownMenuItem
									v-if="planActive.name !== Plan.FREE"
									class="gap-2 p-2"
									@click="isSheetOpen = !isSheetOpen"
								>
									<div
										class="flex size-6 items-center justify-center rounded-md border bg-background"
									>
										<Icon name="lucide:plus" class="size-4" />
									</div>
									<div class="font-medium text-muted-foreground">Agregar negocio</div>
								</UiDropdownMenuItem>
							</UiDropdownMenuContent>
						</UiDropdownMenu>
					</UiSidebarMenuItem>
				</UiSidebarMenu>
			</UiSidebarHeader>
			<UiSidebarContent>
				<UiSidebarGroup>
					<UiSidebarMenu>
						<UiSidebarMenuItem v-for="item in data.projects" :key="item.name">
							<UiSidebarMenuButton
								as-child
								:tooltip="item.name"
								:class="{ 'font-semibold text-primary': isActive(item) }"
							>
								<NuxtLink :href="item.url">
									<Icon mode="svg" :name="item.icon" />
									<span>
										{{ item.name }}

										<UiBadge v-if="item.plan === Plan.PRO" size="xs">{{ item.plan }}</UiBadge>
									</span>
								</NuxtLink>
							</UiSidebarMenuButton>
						</UiSidebarMenuItem>
					</UiSidebarMenu>
				</UiSidebarGroup>
			</UiSidebarContent>
			<UiSidebarRail />
			<!-- Footer-->
			<UiSidebarFooter>
				<UiSidebarMenu>
					<UiSidebarMenuItem>
						<UiDropdownMenu>
							<UiDropdownMenuTrigger as-child>
								<UiSidebarMenuButton
									size="lg"
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<UiAvatar class="size-8 rounded-lg">
										<UiAvatarImage :src="user.image ?? ''" :alt="user.name" />
										<UiAvatarFallback class="rounded-lg">{{ fallBackAvatar }}</UiAvatarFallback>
									</UiAvatar>
									<div class="grid flex-1 text-left text-sm leading-tight">
										<span class="truncate font-semibold">{{ user.name }}</span>
										<span class="truncate text-xs">{{ user.email }}</span>
									</div>
									<Icon name="lucide:chevrons-up-down" class="ml-auto size-4" />
								</UiSidebarMenuButton>
							</UiDropdownMenuTrigger>
							<UiDropdownMenuContent
								class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								:side="isMobile ? 'bottom' : 'right'"
								:side-offset="4"
								align="end"
							>
								<UiDropdownMenuLabel class="p-0 font-normal">
									<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<UiAvatar class="size-8 rounded-lg">
											<UiAvatarImage :src="user.image ?? ''" :alt="user.name" />
											<UiAvatarFallback class="rounded-lg">{{ fallBackAvatar }}</UiAvatarFallback>
										</UiAvatar>
										<div class="grid flex-1 text-left text-sm leading-tight">
											<span class="truncate font-semibold">{{ user.name }}</span>
											<span class="truncate text-xs">{{ user.email }}</span>
										</div>
									</div>
								</UiDropdownMenuLabel>
								<UiDropdownMenuSeparator />
								<UiDropdownMenuGroup>
									<UiDropdownMenuItem icon="lucide:sparkles" title="Upgrade to Pro" />
								</UiDropdownMenuGroup>
								<UiDropdownMenuSeparator />
								<UiDropdownMenuGroup>
									<UiDropdownMenuItem icon="lucide:badge-check" title="Account" />
									<UiDropdownMenuItem icon="lucide:credit-card" title="Billing" />
									<UiDropdownMenuItem icon="lucide:settings-2" title="Settings" />
									<UiDropdownMenuItem icon="lucide:bell" title="Notifications" />
								</UiDropdownMenuGroup>
								<UiDropdownMenuSeparator />
								<UiDropdownMenuItem
									class="cursor-pointer"
									icon="lucide:log-out"
									title="Cerrar sesión"
									@click="logOut()"
								/>
							</UiDropdownMenuContent>
						</UiDropdownMenu>
					</UiSidebarMenuItem>
				</UiSidebarMenu>
			</UiSidebarFooter>
		</UiSidebar>
		<!-- Sidebar main content -->
		<UiSidebarInset>
			<!-- Navbar -->
			<UiNavbar sticky class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<UiSidebarTrigger class="-ml-1" />
				<UiSeparator orientation="vertical" class="mr-2 h-4" />
				<UiBreadcrumbs :items="breadcrumbs" />
			</UiNavbar>
			<div class="flex flex-1 flex-col gap-4 p-4">
				<slot />
				<!-- <UiPlaceholder v-for="n in 30" :key="n" class="aspect-video rounded-lg" /> -->
			</div>
		</UiSidebarInset>
	</UiSidebarProvider>
	<FormsParentSheet
		title="Agregar negocio"
		description="Aquí puedes agregar un nuevo negocio."
		:isSheetOpen="isSheetOpen"
	>
		<FormsBusiness @close="handleClose" @submit="handleSave" />
	</FormsParentSheet>
</template>

<script lang="ts" setup>
	import { authClient } from "~/lib/auth-client";
	import { Plan } from "~/types/plan";

	const route = useRoute();

	const { data: session } = await authClient.useSession(useFetch);

	const user = ref(session.value?.user) as any;

	const businessActive = ref(user.value?.business_user[0]);
	const planActive = ref(user.value?.plan[0]);

	const fallBackAvatar = computed(() => {
		const firstLetterName = user.value?.name?.charAt(0).toUpperCase();
		const firstLetterLastName = user.value?.name.split(" ")[1]?.charAt(0).toUpperCase();
		return `${firstLetterName}${firstLetterLastName ?? ""}`;
	});

	const isSheetOpen = ref(false);

	const handleClose = () => {
		isSheetOpen.value = false;
	};
	const handleSave = () => {
		isSheetOpen.value = false;
	};

	// Breadcrumb items
	const breadcrumbs = computed(() => {
		let paths: any[] = [];
		route.matched.forEach((route) => {
			if (!route.meta.breadcrumb) return;
			paths = route.meta.breadcrumb as any[];
		});
		return paths;
	});

	function isActive(item: any) {
		const name = (route?.name as string) || "";
		const itemName = (item?.url?.name as string) || "";

		return name === itemName;
	}
	// This is sample data.
	const data = {
		teams: [
			{
				name: "Acme Inc",
				logo: "lucide:gallery-vertical-end",
				plan: "Enterprise",
			},
			{
				name: "Acme Corp.",
				logo: "lucide:audio-waveform",
				plan: "Startup",
			},
			{
				name: "Evil Corp.",
				logo: "lucide:command",
				plan: "Free",
			},
		],
		projects: [
			{
				name: "Dashboard",
				url: { name: "app" },
				icon: "lucide:frame",
				plan: Plan.PRO,
			},
			{
				name: "Cotizaciones",
				url: { name: "app-cotizaciones" },
				icon: "lucide:map",
				plan: Plan.PRO,
			},
			{
				name: "Productos",
				url: { name: "app-productos" },
				icon: "lucide:pie-chart",
				plan: Plan.PRO,
			},
			// {
			//   name: "Clientes",
			//   url: {name: 'app-clientes'},
			//   icon: "lucide:user",
			// },
			{
				name: "Configuracion",
				url: { name: "app-configuracion" },
				icon: "lucide:settings-2",
				plan: Plan.FREE,
			},
		],
	};
	const activeTeam = ref(data.teams[1]);

	const logOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigateTo("/", {
						replace: true,
						external: true,
					});
				},
			},
		});
	};
</script>
