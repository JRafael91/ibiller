<script lang="ts" setup>
	import { authClient } from "~/lib/auth-client";

	definePageMeta({
		layout: "dashboard",
		breadcrumb: [{ label: "Bienvenido", link: "/app/onboarding" }],
	});

	const isSheetOpen = ref(false);
	const session = authClient.useSession();
	const handleClose = () => {
		isSheetOpen.value = false;
	};

	const handleSave = () => {
		isSheetOpen.value = false;

		setTimeout(() => {
			navigateTo("/app", {
				replace: true,
				external: true,
			});
		}, 500);
	};
</script>
<template>
	<UiContainer class="relative flex h-full items-center justify-center">
		<div
			class="absolute inset-0 bg-[radial-gradient(theme(colors.border/90%)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_50%,transparent_100%)]"
		/>
		<div class="relative z-10 flex flex-col items-center justify-center py-16 text-center lg:py-24">
			<UiFancyIcon icon="lucide:building-2" />
			<p class="mb-2 mt-6 text-balance text-xl font-bold tracking-tight">
				Bienvenido, <span class="text-primary">{{ session.data?.user.name }}</span>
			</p>
			<p class="text-muted-foreground">Configura tu negocio para empezar.</p>
			<div class="mt-5 grid w-full grid-cols-1 justify-center gap-3 sm:flex sm:items-center">
				<FormsParentSheet
					title="Configuración de negocio"
					description="Aquí puedes configurar la información de tu negocio."
					:isSheetOpen="isSheetOpen"
				>
					<template v-slot:trigger>
						<UiButton variant="outline" class="w-full" @click="isSheetOpen = !isSheetOpen">
							Configuración
						</UiButton>
					</template>
					<FormsBusiness @close="handleClose" @submit="handleSave" />
				</FormsParentSheet>
			</div>
		</div>
	</UiContainer>
</template>
