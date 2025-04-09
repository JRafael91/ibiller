<template>
  <div>
    <h2>Nueva cotización</h2>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  breadcrumb: [
    { label: 'Cotizaciones', link: '/app/cotizaciones' },
    { label: 'Nueva cotización', link: '/app/cotizaciones/nuevo' },
  ],
});
</script>

<style>

</style>