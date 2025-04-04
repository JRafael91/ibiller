<template>
  <div class="overflow-y-auto">
    {{  errors }}
    <form id="form" @submit.prevent="onSubmit">
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
            <template v-for="(product, index) in productsLocal" :key="product.id">
              <UiTableRow class="border-none hover:bg-transparent">
                <UiTableCell class="pl-0 flex flex-col">
                  <UiInput 
                    v-model="product.name" 
                    placeholder="Nombre del producto" 
                    :class="{'border-red-500' : errors && `errors.products.${index}.name` }"/>
                    <span v-if="errors && `errors.products.${index}.name`" class="text-red-500 text-sm">
                      {{ errors["products[0].name"] }}
                    </span>
                </UiTableCell>
                <UiTableCell class="pl-0 text-muted-foreground">
                  <UiInput v-model="product.quantity" placeholder="Cantidad" />
                </UiTableCell>
                 <UiTableCell class="pl-0 text-muted-foreground">
                  <UiCurrencyInput placeholder="Precio" :id="product.id" v-model="product.price" />
                </UiTableCell>
                <UiTableCell class="pl-0 text-muted-foreground">
                  {{ numberFormat('en-US', 'USD', Number(product.quantity) * Number(product.price)) }}
                </UiTableCell>
                <UiTableCell class=" pl-0 text-muted-foreground ">
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
          <UiButton type="button" class="w-full" @click="addProduct()">
            <Icon class="size-4" name="lucide:plus" />
            Agregar
          </UiButton>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { z } from "zod";
import type { Product } from "~/types/product";

const products = defineModel("products", {
  type: Array<Product>,
  required: true,
  default: []
});
const disabled = defineModel("disabled", {required: true});


const productsLocal = ref(products.value || []);

const productSchema = z.object({
  products: z.array(
    z.object({
      id: z.string().min(1, { message: "El ID del producto es requerido" }),
      name: z.string().min(1, { message: "El nombre del producto es requerido" }),
      quantity: z.number().min(1, { message: "La cantidad es requerida" }),
      price: z.number().min(0, { message: "El precio es requerido" }),
      description: z.string().optional(),
    })
  ).nonempty({ message: "Se requiere al menos un producto" })
});

const { handleSubmit, values, meta, errors } = useForm({
  //validationSchema: toTypedSchema(productSchema),
  initialValues: { products: [productsLocal.value[0], ...productsLocal.value.slice(1)] },
})

const onSubmit = handleSubmit((values) => {
  console.log("values", values);
  console.log(productSchema.safeParse(products.value).success);
  console.log('orud', products)
  console.log(productsLocal.value);
});

const addProduct = () => {
  productsLocal.value = [
    ...productsLocal.value,
    {
      id: generateUniqueId(),
      name: "",
      quantity: 1,
      price: 0,
      description: "",
    },
  ]
  products.value = [...productsLocal.value];
};

const removeProduct = (index: number) => {
  console.log(index);

  // Filtrar el producto y asignar un nuevo array
  productsLocal.value = productsLocal.value.filter((_, i) => i !== index);

  products.value = [...productsLocal.value];

  // Verificar si el array está vacío
  if (productsLocal.value.length === 0) {
    productsLocal.value = [
      {
        id: generateUniqueId(),
        name: "",
        quantity: 1,
        price: 0,
        description: "",
      },
    ];
    products.value = [...productsLocal.value];
  }
};
  
</script>
