<script lang="ts" setup>
	import { loginSchemaZod } from "#shared/utils/login-schema.zod";
	import { authClient } from "~/lib/auth-client";

	definePageMeta({
		layout: "full",
	});

	const title = "Iniciar sesión";
	const description = "Nos encanta verte de nuevo.";

	useSeoMeta({ title, description });

	const loginSchema = loginSchemaZod();

	const { handleSubmit, values } = useForm({
		validationSchema: toTypedSchema(loginSchema),
	});

	const status = ref("idle");

	// const { data, status, error, execute } = await useFetch("/api/auth/login", {
	// 	immediate: false,
	// 	watch: false,
	// 	method: "POST",
	// 	body: values,
	// });

	const submit = handleSubmit(async () => {
		console.log("submit values", values);
		const { data, error } = await authClient.signIn.email(
			{
				email: values.email!,
				password: values.password!,
			},
			{
				onRequest() {
					status.value = "pending";
				},
				onSuccess() {
					useSonner.success("Bienvenido de nuevo!", {
						description: "Has iniciado sesión correctamente.",
					});
					setTimeout(() => {
						navigateTo("/app", {
							replace: true,
							external: true,
						});
					}, 1000);
					status.value = "success";
				},
				onError({ response }) {
					status.value = "error";
					let description =
						"Ocurrió un error. Intenta nuevamente o pongase en contacto con administrador.";
					if (response.status === 401) {
						description = "Correo electrónico o la contraseña son incorrectos.";
					} else if (response.status === 429) {
						description = "Demasiados intentos de inicio de sesión. Intenta nuevamente más tarde.";
					}
					useSonner.error("Ocurrió un error", {
						description,
					});
				},
			}
		);
		// await execute();
		// if (status.value === "error") {
		// 	useSonner.error("Ocurrió un error", {
		// 		description: error.value?.statusMessage,
		// 	});
		// 	return;
		// }
		// useSonner.success("Bienvenido de nuevo!", {
		// 	description: "Has iniciado sesión correctamente.",
		// });
		// navigateTo("/app", {
		// 	replace: true,
		// });
	});
</script>

<template>
	<div class="flex h-screen items-center justify-center">
		<div class="w-full max-w-[360px] px-5">
			<svg
				class="my-6 h-8 fill-primary"
				viewBox="0 0 53 44"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M23.2997 0L52.0461 28.6301V44H38.6311V34.1553L17.7522 13.3607L13.415 13.3607L13.415 44H0L0 0L23.2997 0ZM38.6311 15.2694V0L52.0461 0V15.2694L38.6311 15.2694Z"
					class="ccustom"
				/>
			</svg>

			<h1 class="text-2xl font-bold tracking-tight lg:text-3xl">{{ title }}</h1>
			<p class="mt-1 text-muted-foreground">{{ description }}</p>

			<form class="mt-10" @submit.prevent="submit">
				<fieldset class="grid gap-5">
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
					<div class="flex items-start justify-end">
						<NuxtLink
							class="text-sm font-medium text-primary underline underline-offset-2"
							to="/recuperar"
							>¿Olvidaste la contraseña?</NuxtLink
						>
					</div>
					<UiButton
						class="w-full"
						type="submit"
						:text="status == 'pending' ? 'Accediendo' : 'Acceder'"
						:loading="status == 'pending'"
						:disabled="status == 'pending'"
					/>
				</fieldset>
			</form>

			<p class="mt-6 text-sm text-muted-foreground">
				¿No tiene una cuenta?
				<NuxtLink
					class="font-semibold text-primary underline-offset-2 hover:underline"
					to="/registro"
				>
					Crear una cuenta
				</NuxtLink>
			</p>
		</div>
	</div>
</template>
