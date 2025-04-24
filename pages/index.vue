<template>
	<div class="flex gap-4">
		<section class="flex-1">
			<UiCard title="Cotización" description="Datos de cotización">
				<template #content>
					<UiCardContent>
						<UiQuotation />
					</UiCardContent>
				</template>
			</UiCard>
		</section>
		<section class="flex-1 border-2">Preview</section>
	</div>
</template>
<script lang="ts" setup></script>
