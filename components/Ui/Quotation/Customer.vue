<template>
  <div>
    <Field v-slot="{ componentField}" name="customer_name">
      <UiFormItem label="Nombre">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="customer_rfc">
      <UiFormItem label="Correo electrónico">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="customer_address">
      <UiFormItem label="Dirección">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="customer_zip">
      <UiFormItem label="Código postal">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="customer_city">
      <UiFormItem label="Ciudad">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="customer_state">
      <UiFormItem label="Estado">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="customer_country">
      <UiFormItem label="País">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="customer_email">
      <UiFormItem hint="Opcional" label="Correo electrónico">
        <UiInput v-bind="componentField" />
      </UiFormItem>
    </Field>
    <Field v-slot="{ componentField }" name="customer_phone">
      <UiFormItem hint="Opcional" label="Teléfono">
        <UiInput v-bind="componentField" v-maska="'(##) #-###-##-##'" />
      </UiFormItem>
    </Field>
  </div>
</template>

<script lang="ts" setup>
import { vMaska } from "maska/vue";
</script>

<style>

</style>