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
        <form class="w-full space-y-4" @submit="onSubmit">
          <Field v-slot="{ componentField }" name="folio">
            <UiFormItem label="Folio">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="date_quotation">
            <UiFormItem label="Fecha de cotización">
              <UiDatepicker v-bind="componentField">
                <template #default="{ togglePopover }">
                  <UiButton variant="outline"
                    :class="[!componentField && 'text-muted-foreground', 'w-[260px] justify-start text-left']"
                    @click="togglePopover"
                  >
                    <Icon name="lucide:calendar" class="h-4 w-4" />
                    {{ componentField.modelValue ? format(componentField.modelValue, "MMMM dd, yyyy", {locale: es}) : "Seleccionar fecha" }}
                  </UiButton>
                </template>
              </UiDatepicker>
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="date_expiration">
            <UiFormItem label="Fecha de vencimiento">
              <UiDatepicker v-bind="componentField">
                <template #default="{ togglePopover }">
                  <UiButton variant="outline"
                    :class="[!componentField && 'text-muted-foreground', 'w-[260px] justify-start text-left']"
                    @click="togglePopover"
                  >
                    <Icon name="lucide:calendar" class="h-4 w-4" />
                    {{ componentField.modelValue ? format(componentField.modelValue, "MMMM dd, yyyy", {locale: es}) : "Seleccionar fecha" }}
                  </UiButton>
                </template>
              </UiDatepicker>
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="business_name">
            <UiFormItem label="Razón social">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="business_rfc">
            <UiFormItem label="RFC">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="business_address">
            <UiFormItem label="Dirección">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="buiness_zip">
            <UiFormItem label="Código postal">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="business_city">
            <UiFormItem label="Ciudad">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="business_state">
            <UiFormItem label="Estado">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="business_country">
            <UiFormItem label="País">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="business_email">
            <UiFormItem label="Correo electrónico">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <Field v-slot="{ componentField }" name="business_phone">
            <UiFormItem label="Teléfono">
              <UiInput v-bind="componentField" />
            </UiFormItem>
          </Field>
          <div>
            <UiButton type="submit">Update</UiButton>
          </div>
        </form>
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
import { UiFormItem } from "#components";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const schema = z.object({
  folio: z.string({ required_error: "El folio es requerido" }).max(10,{
    message: "El folio no puede ser mayor a 10 caracteres",
  }),
  date_quotation: z.date({ required_error: "La fecha de cotización es requerida" }),
  date_expiration: z.date({ required_error: "La fecha de expiración es requerida" }),
  business_name: z.string({ required_error: "El nombre de la empresa es requerido" }),
  business_rfc: z.string({ required_error: "El RFC de la empresa es requerido" }),
  business_address: z.string({ required_error: "La dirección de la empresa es requerida" }),
  business_zip: z.string({ required_error: "El código postal de la empresa es requerido" }),
  business_city: z.string({ required_error: "La ciudad de la empresa es requerida" }),
  business_state: z.string({ required_error: "El estado de la empresa es requerido" }),
  business_country: z.string({ required_error: "El país de la empresa es requerido" }),
  business_email: z.string({ required_error: "El correo de la empresa es requerido" }),
  business_phone: z.string({ required_error: "El teléfono de la empresa es requerido" }),
});

const { handleSubmit, isSubmitting } = useForm({
    validationSchema: toTypedSchema(schema),
  });

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values);
})
</script>

<style>

</style>