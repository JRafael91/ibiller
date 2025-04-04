<template>
  <div>
    <form id="form" class="w-full space-y-4" @submit.prevent="onSubmit">
      <Field v-slot="{ componentField }" name="folio">
        <UiFormItem label="Folio">
          <UiInput v-bind="componentField"/>
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
      <Field v-slot="{ componentField }" name="name">
        <UiFormItem label="Razón social">
          <UiInput v-bind="componentField" />
        </UiFormItem>
      </Field>
      <Field v-slot="{ componentField }" name="rfc">
        <UiFormItem label="RFC">
          <UiInput v-bind="componentField" />
        </UiFormItem>
      </Field>
      <Field v-slot="{ componentField }" name="address">
        <UiFormItem label="Dirección">
          <UiInput v-bind="componentField" />
        </UiFormItem>
      </Field>
      <Field v-slot="{ componentField }" name="zip">
        <UiFormItem label="Código postal">
          <UiInput v-bind="componentField" />
        </UiFormItem>
      </Field>
      <Field v-slot="{ componentField }" name="city">
        <UiFormItem label="Ciudad">
          <UiInput v-bind="componentField" />
        </UiFormItem>
      </Field>
      <Field v-slot="{ componentField }" name="state">
        <UiFormItem label="Estado">
          <UiInput v-bind="componentField" />
        </UiFormItem>
      </Field>
      <Field v-slot="{ componentField }" name="country">
        <UiFormItem label="País">
          <UiInput v-bind="componentField" />
        </UiFormItem>
      </Field>
      <Field v-slot="{ componentField }" name="email">
        <UiFormItem hint="Opcional" label="Correo electrónico">
          <UiInput v-bind="componentField" />
        </UiFormItem>
      </Field>
      <Field v-slot="{ componentField }" name="phone">
        <UiFormItem hint="Opcional" label="Teléfono">
          <UiInput v-bind="componentField" v-maska="'(##) #-###-##-##'" />
        </UiFormItem>
      </Field>
  </form>
  </div>
</template>

<script lang="ts" setup>
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { vMaska } from "maska/vue";
import { z } from "zod";

const business: any = defineModel('business', {required: true});
const disabled = defineModel('disabled', {required: true});

const emit = defineEmits(["goToPage"]);

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

const { handleSubmit, values, setFieldValue, meta } = useForm({
  validationSchema: toTypedSchema(businessSchema),
  initialValues: business.value,
});

const onSubmit = handleSubmit(async (values) => {
  business.value = values;
  emit("goToPage", +1);
});



watch([values, meta], ([newValues, newMeta]) => {
  if(newValues.email === "") {
    setFieldValue("email", null);
  }
  if(newValues.phone === "") {
    setFieldValue("phone", null);
  }
  disabled.value = newMeta.valid;
  business.value = {...business.value, ...newValues};
});
</script>