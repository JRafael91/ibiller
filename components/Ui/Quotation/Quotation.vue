<template>
  <pre>{{ formData }}</pre>
  <div class="flex w-full">
    <UiTabs v-model="currentTab" :default-value="0">
      <UiTabsList :pill="true" class="relative grid w-full grid-cols-4">
        <UiTabsTrigger :pill="false" :value="0" >Datos de empresa</UiTabsTrigger>
        <UiTabsTrigger :pill="false" :value="1" :disabled="!disabledCustomer">Datos de cliente</UiTabsTrigger>
        <UiTabsTrigger :pill="false" :value="2" >Productos</UiTabsTrigger>
        <UiTabsTrigger :pill="false" :value="3" :disabled="!disabledPayment">Cuenta</UiTabsTrigger>
        <UiTabsIndicator />
      </UiTabsList>
        <UiTabsContent :value="0">
          <UiQuotationBusiness 
            v-model:business="formData.business" 
            v-model:disabled="disabledCustomer"
            @goToPage="goToPage"
          />
        </UiTabsContent>
        <UiTabsContent :value="1">
          <UiQuotationCustomer 
            v-model:customer="formData.customer"
            v-model:disabled="disabledProducts"
            @goToPage="goToPage"
          />
        </UiTabsContent>
        <UiTabsContent :value="2">
          <UiQuotationProducts 
            v-model:products="formData.products"
            v-model:disabled="disabledPayment"
            @goToPage="goToPage"
          />
        </UiTabsContent>
        <UiTabsContent :value="3">
        </UiTabsContent>
    </UiTabs>
  </div>
  <div class="flex justify-end mt-4 gap-4">
    <UiButton v-if="currentTab > 0" type="button"  @click="goToPage(-1)">
      <Icon class="size-4" name="lucide:arrow-left" />
      Anterior
    </UiButton>
    <UiButton v-if="currentTab < 3" type="submit" form="form">
      Siguiente
      <Icon class="size-4" name="lucide:arrow-right" />
    </UiButton>
    <UiButton v-if="currentTab == 3" type="submit" form="form">
      <Icon class="size-4" name="lucide:file-text" />
      Generar PDF
    </UiButton>
    </div>
</template>

<script lang="ts" setup>
import { z } from 'zod';

const currentTab = ref(0);
const disabledCustomer = ref(false);
const disabledProducts = ref(false);
const disabledPayment = ref(false);

const businessSchema = z.object({
  folio: z.string().min(1, { message: "El folio es requerido" }),
  date_quotation: z.date({ required_error: "La fecha de cotización es requerida" }),
  date_expiration: z.date({ required_error: "La fecha de expiración es requerida" }),
  name: z.string().min(1, { message: "El nombre de la empresa es requerido" }),
  rfc: z.string().min(12, { message: "El RFC debe tener 12 o 13 caracteres" })
  .max(13, { message: "El RFC debe tener 12 o 13 caracteres" }),
  address: z.string().min(3, { message: "La dirección es requerida" }),
  zip: z.string().min(3, { message: "El código postal es requerido" }),
  city: z.string().min(3, { message: "La ciudad es requerida" }),
  state: z.string().min(3, { message: "El estado es requerido" }),
  country: z.string().min(3, { message: "El país es requerido" }),
  email: z.string().email({ message: "El correo no es válido" }).nullable().optional(),
  phone: z.string().min(16,{message: "Teléfono de 10 números"})
  .max(16,{message: "Teléfono de 10 números"}).nullable().optional(),
});

const formData: any = reactive({
  business: {
    folio: "",
    date_quotation: new Date(),
    date_expiration: new Date(),
    name: "",
    rfc: "",
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
    email: null,
    phone: null,
  },
  customer: {
    name: "",
    rfc: "",
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
    email: null,
    phone: null,
  },
  products: [
    {
      id: generateUniqueId(),
      name: "",
      quantity: 1,
      price: 0,
      description: "",
    }
  ],
});

const goToPage = (value: number) => {
  currentTab.value += value;
};

const submit = () => {
  console.log('submit');
};
</script>