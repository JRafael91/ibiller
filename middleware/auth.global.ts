import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const { data: session } = await authClient.useSession(useFetch);

	console.log("entra al middleware");
	if (!session.value) {
		if (to.path.includes("/app")) {
			return navigateTo("/acceso");
		}
	}

	if (session.value) {
		if (to.path === "/acceso" || to.path === "/registro") {
			return navigateTo("/app");
		}
	}

	if (to.path === "/app/onboarding") {
		return;
	}

	const { data } = await useFetch("/api/session");

	if (data.value?.business_user.length === 0) {
		return navigateTo("/app/onboarding");
	}
});
