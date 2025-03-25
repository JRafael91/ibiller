<template>
  <div>
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
    <Field v-slot="{ componentField }" name="business.name">
      <UiFormItem label="Razón social">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="business.rfc">
      <UiFormItem label="RFC">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="business.address">
      <UiFormItem label="Dirección">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="buiness.zip">
      <UiFormItem label="Código postal">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="business.city">
      <UiFormItem label="Ciudad">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="business.state">
      <UiFormItem label="Estado">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="business.country">
      <UiFormItem label="País">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="business.email">
      <UiFormItem hint="Opcional" label="Correo electrónico">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="business.phone">
      <UiFormItem hint="Opcional" label="Teléfono">
        <UiInput v-bind="componentField" v-maska="'(##) #-###-##-##'" />
      </UiFormItem>
    </Field>
  </div>
</template>

<script lang="ts" setup>
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { vMaska } from "maska/vue";
</script>

<style>

</style>