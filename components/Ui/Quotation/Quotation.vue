<template>
  <div class="flex w-full">
    <UiTabs v-model="currentTab" :default-value="0">
      <UiTabsList :pill="true" class="relative grid w-full grid-cols-4">
        <UiTabsTrigger :pill="false" :value="0">Datos de empresa</UiTabsTrigger>
        <UiTabsTrigger :pill="false" :value="1">Datos de cliente</UiTabsTrigger>
        <UiTabsTrigger :pill="false" :value="2">Productos</UiTabsTrigger>
        <UiTabsTrigger :pill="false" :value="3">Cuenta</UiTabsTrigger>
        <UiTabsIndicator />
      </UiTabsList>
      
      <form class="w-full space-y-4" @submit="onSubmit">
        <UiTabsContent :value="0">
          <UiQuotationBusiness />
        </UiTabsContent>
        <UiTabsContent :value="1">
          <UiQuotationCustomer  />
        </UiTabsContent>
        <UiTabsContent :value="2">
          <UiQuotationProducts  />
        </UiTabsContent>
        <UiTabsContent :value="3">
          <UiQuotationPayment  />
        </UiTabsContent>
        <div class="flex justify-end mt-4 gap-4">
            <UiButton v-if="currentTab > 0" type="button" @click="goToPage(-1)">
              <Icon class="size-4" name="lucide:arrow-left" />
              Anterior
            </UiButton>
            <UiButton v-if="currentTab < 3" type="button" @click="goToPage(+1)">
              Siguiente
              <Icon class="size-4" name="lucide:arrow-right" />
            </UiButton>
            <UiButton v-if="currentTab == 3" type="submit">
              <Icon class="size-4" name="lucide:file-text" />
              Generar PDF
            </UiButton>
          </div>
      </form>
    </UiTabs>
  </div>
</template>

<script lang="ts" setup>
import { z } from "zod";

const currentTab = ref(0);

const schema = z.object({
  folio: z.string({ required_error: "El folio es requerido" }).max(10,{
    message: "El folio no puede ser mayor a 10 caracteres",
  }),
  date_quotation: z.date({ required_error: "La fecha de cotización es requerida" }),
  date_expiration: z.date({ required_error: "La fecha de expiración es requerida" }),
  business: z.object({
    name: z.string({ required_error: "El nombre de la empresa es requerido" }),
    rfc: z.string({ required_error: "El RFC de la empresa es requerido" }),
    address: z.string({ required_error: "La dirección de la empresa es requerida" }),
    zip: z.string({ required_error: "El código postal de la empresa es requerido" }),
    city: z.string({ required_error: "La ciudad de la empresa es requerida" }),
    state: z.string({ required_error: "El estado de la empresa es requerido" }),
    country: z.string({ required_error: "El país de la empresa es requerido" }),
    email: z.string().email({ message: "El correo no es válido" }).optional(),
    phone: z.string().min(10,{message: "Teléfono de 10 números"})
    .max(10,{message: "Teléfono de 10 números"}).optional(),
  }),
  customer: z.object({
    customer_name: z.string({ required_error: "Cliente es requerido" }),
    customer_rfc: z.string({ required_error: "El RFC del cliente es requerido" }).optional(),
    customer_address: z.string({ required_error: "La dirección del cliente es requerida" }).optional(),
    customer_zip: z.string({ required_error: "El código postal del cliente es requerido" }).optional(),
    customer_city: z.string({ required_error: "La ciudad del cliente es requerida" }).optional(),
    customer_state: z.string({ required_error: "El estado del cliente es requerido" }).optional(),
    customer_country: z.string({ required_error: "El país del cliente es requerido" }).optional(),
    customer_email: z.string().email({message: "El correo no es válido"}).optional(),
    customer_phone: z.string().min(10, {message: "Teléfono de 10 números"})
    .max(10, {message: "Teléfono de 10 números"}).optional(),
  }),
});

const { handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(schema),
  });

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values);
});

const goToPage = (index: number) => {
  currentTab.value += index;
};
</script>