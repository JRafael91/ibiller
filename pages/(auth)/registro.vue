<script lang="ts" setup>
	import { signupSchemaZod } from "~/shared/utils/signup-schema.zod";

	definePageMeta({
		layout: "full",
	});

	const title = "Registrarse";
	const description = "Crea una cuenta para comenzar.";

	useSeoMeta({ title, description });

	const registerSchema = signupSchemaZod();

	const passwordRules = ref({
		minLength: false,
		hasNumber: false,
		hasNumberAndSpecialChar: false,
		hasMayuscule: false,
	});

	const { handleSubmit, controlledValues, values } = useForm({
		validationSchema: toTypedSchema(registerSchema),
	});

	watch(
		() => controlledValues.value.password,
		(newPassword) => {
			passwordRules.value.minLength = newPassword!.length >= 8;
			passwordRules.value.hasNumberAndSpecialChar = /.*[^A-Za-z0-9].*/.test(newPassword!);
			passwordRules.value.hasMayuscule = /.*[A-Z].*/.test(newPassword!);
			passwordRules.value.hasNumber = /.*\d.*/.test(newPassword!);
		}
	);

	const { data, status, error, execute } = await useFetch("/api/auth/signup", {
		immediate: false,
		watch: false,
		method: "POST",
		body: values,
	});

	const submit = handleSubmit(async () => {
		await execute();
		if (status.value === "error") {
			useSonner.error("Ocurrió un error", {
				description: error.value?.statusMessage,
			});
			return;
		}
		useSonner.success("Cuenta creada!", {
			description: "Se ha creado correctamente tu cuenta.",
		});

		navigateTo("/acceso", {
			replace: true,
		});
	});
</script>
<template>
	<div class="flex h-screen items-center justify-center">
		<div class="w-full md:w-1/2">
			<div class="mx-auto w-full max-w-[330px] px-5">
				<h1 class="text-2xl font-bold tracking-tight lg:text-3xl">{{ title }}</h1>
				<p class="mt-1 text-muted-foreground">{{ description }}</p>
				<form class="mt-10 w-full space-y-4" @submit.prevent="submit">
					<Field v-slot="{ componentField }" name="name" autocomplete="off">
						<UiFormItem label="Nombre">
							<UiInput v-bind="componentField" type="text" placeholder="John Doe" required />
						</UiFormItem>
					</Field>
					<Field v-slot="{ componentField }" name="email">
						<UiFormItem label="Correo electrónico">
							<UiInput
								v-bind="componentField"
								type="email"
								placeholder="john@example.com"
								required
							/>
						</UiFormItem>
					</Field>
					<Field v-slot="{ componentField }" name="password">
						<UiFormItem label="Contraseña">
							<UiInput v-bind="componentField" placeholder="********" type="password" required />
						</UiFormItem>
					</Field>
					<ul class="flex flex-col gap-4">
						<li class="flex items-center gap-3 text-sm text-muted-foreground">
							<Icon
								:class="[passwordRules.minLength ? 'text-green-500' : '']"
								class="size-[18px]"
								name="lucide:check-circle-2"
							/>
							<span :class="[passwordRules.minLength ? 'text-green-500' : '']"
								>Mínimo 8 caracteres</span
							>
						</li>
						<li class="flex items-center gap-3 text-sm text-muted-foreground">
							<Icon
								:class="[passwordRules.hasMayuscule ? 'text-green-500' : '']"
								class="size-[18px]"
								name="lucide:check-circle-2"
							/>
							<span :class="[passwordRules.hasMayuscule ? 'text-green-500' : '']"
								>Al menos una letra mayuscula</span
							>
						</li>
						<li class="flex items-center gap-3 text-sm text-muted-foreground">
							<Icon
								:class="[passwordRules.hasNumber ? 'text-green-500' : '']"
								class="size-[18px]"
								name="lucide:check-circle-2"
							/>
							<span :class="[passwordRules.hasNumber ? 'text-green-500' : '']"
								>Al menos un número</span
							>
						</li>
						<li class="flex items-center gap-3 text-sm text-muted-foreground">
							<Icon
								:class="[passwordRules.hasNumberAndSpecialChar ? 'text-green-500' : '']"
								class="size-[18px]"
								name="lucide:check-circle-2"
							/>
							<span :class="[passwordRules.hasNumberAndSpecialChar ? 'text-green-500' : '']">
								Al menos un carácter especial
							</span>
						</li>
					</ul>
					<UiButton
						class="w-full"
						type="submit"
						:text="status == 'pending' ? 'Registrando...' : 'Registrarse'"
						:loading="status == 'pending'"
						:disabled="status == 'pending'"
					/>
				</form>
				<p class="mt-8 text-sm text-muted-foreground">
					¿Ya tienes una cuenta?
					<NuxtLink
						class="font-semibold text-primary underline-offset-2 hover:underline"
						to="/acceso"
					>
						Acceder
					</NuxtLink>
				</p>
			</div>
		</div>
		<div class="hidden h-screen md:block md:w-1/2 lg:w-1/2">
			<img src="/photo.avif" alt="Login form image" class="size-full object-cover" />
		</div>
	</div>
</template>
