<template>
	<div>
		<UiSheet :open="isSheetOpen">
			<UiSheetTrigger class="flex w-full gap-2">
				<slot name="trigger" />
			</UiSheetTrigger>
			<UiSheetContent
				class="overflow-auto sm:max-w-none md:w-[650px]"
				side="right"
				:title="title"
				:description="description"
			>
				<template #content>
					<slot />
				</template>
			</UiSheetContent>
		</UiSheet>
	</div>
</template>

<script lang="ts" setup>
	defineProps({
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: "",
		},
		isSheetOpen: {
			type: Boolean,
			default: false,
		},
	});
</script>

<style></style>
