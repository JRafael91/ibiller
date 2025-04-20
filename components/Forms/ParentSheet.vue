<template>
	<div>
		<UiSheet :open="isSheetOpen">
			<UiSheetTrigger class="w-full">
				<slot name="trigger"></slot>
			</UiSheetTrigger>
			<UiSheetContent
				class="sm:max-w-none md:w-[450px]"
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
		title: String,
		description: String,
		isSheetOpen: {
			type: Boolean,
			default: false,
		},
	});
</script>

<style></style>
