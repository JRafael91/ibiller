<template>
  <div class="overflow-y-auto">
    <div class="mt-10 [&>div]:max-h-[500px]">
      <UiTable class="">
        <UiTableHeader class="sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
          <UiTableRow class="hover:bg-trasparent">
            <UiTableHead class="pl-0 font-semibold text-foreground backdrop-blur">Producto</UiTableHead>
            <UiTableHead class="hidden bg-background/90 pl-0 font-semibold text-foreground backdrop-blur lg:table-cell">Cantidad</UiTableHead>
            <UiTableHead class="hidden bg-background/90 pl-0 font-semibold text-foreground backdrop-blur md:table-cell">Precio</UiTableHead>
            <UiTableHead class="pl-0 font-semibold text-foreground backdrop-blur">Total</UiTableHead>
            <UiTableHead class="pl-0 font-semibold text-foreground backdrop-blur">Eliminar</UiTableHead>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <template v-for="(product, index) in products" :key="product.id">
            <UiTableRow class="border-none hover:bg-transparent">
              <UiTableCell class="pl-0">
                <UiInput v-model="product.name" placeholder="Nombre del producto"></UiInput>
              </UiTableCell>
              <UiTableCell class="hidden pl-0 text-muted-foreground lg:table-cell">
                <UiInput v-model="product.quantity" placeholder="Cantidad" />
              </UiTableCell>
               <UiTableCell class="hidden pl-0 text-muted-foreground lg:table-cell">
                <UiCurrencyInput placeholder="Precio" :id="product.id" v-model="product.price" />
              </UiTableCell>
              <UiTableCell class="hidden pl-0 text-muted-foreground lg:table-cell">
                {{ numberFormat('en-US', 'USD', Number(product.quantity) * Number(product.price)) }}
              </UiTableCell>
              <UiTableCell class="hidden pl-0 text-muted-foreground lg:table-cell">
                <UiButton size="sm" variant="destructive" @click="removeProduct(index)">
                  <Icon name="heroicons-solid:trash" class="size-4" />
                </UiButton>
              </UiTableCell>
            </UiTableRow>
            <UiTableRow class="hover:bg-transparent">
              <UiTableCell class="pl-0" colspan="5">
                <UiTextarea v-model="product.description" placeholder="Descripción del producto" class="min-h-16 max-w-[500px]" style="field-sizing: content; resize: none" />
              </UiTableCell>
            </UiTableRow>
          </template>
        </UiTableBody>
      </UiTable>
      <div class="mx-auto text-center mt-4">
        <UiButton class="w-full" @click="addProduct()">
          <Icon class="size-4" name="lucide:plus" />
          Agregar
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const products = ref([
  {
    id: generateUniqueId(),
    name: "",
    quantity: null,
    price: 0,
    priceFormat: 0,
    description: "",
  },
]);

const addProduct = () => {
  products.value.push({
    id: generateUniqueId(),
    name: "",
    quantity: null,
    price: 0,
    priceFormat: 0,
    description: "",
  });
};

const removeProduct = (index: number) => {
  products.value.splice(index, 1);
  if(products.value.length === 0) {
    products.value.push({
      id: generateUniqueId(),
      name: "",
      quantity: null,
      price: 0,
      priceFormat: 0,
      description: "",
    });
  }
};
  
</script>
