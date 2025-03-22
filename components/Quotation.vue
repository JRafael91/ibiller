<template>
  <div class="flex w-full">
    <UiTabs default-value="business">
      <UiTabsList :pill="false" class="relative grid w-full grid-cols-4">
        <UiTabsTrigger :pill="false" value="business">Datos de empresa</UiTabsTrigger>
        <UiTabsTrigger :pill="false" value="customer">Datos de cliente</UiTabsTrigger>
        <UiTabsTrigger :pill="false" value="products">Productos</UiTabsTrigger>
        <UiTabsTrigger :pill="false" value="account">Cuenta</UiTabsTrigger>
        <UiTabsIndicator />
      </UiTabsList>
      <UiTabsContent value="business">
        <h2>Datos de cotiz</h2>
      </UiTabsContent>
      <UiTabsContent value="customer">
        <h2>Datos de cliente</h2>
      </UiTabsContent>
      <UiTabsContent value="products">
        <h2>Lista de productos</h2>
      </UiTabsContent>
      <UiTabsContent value="account">
        <h2>Cuenta</h2>
      </UiTabsContent>
    </UiTabs>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>

</style>