import { authClient } from "~/lib/auth-client";
import { Plan } from "~/types/plan";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const { data: session } = await authClient.useSession(useFetch);

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

	if (session.value && to.path === "/app/onboarding") {
		return;
	}

	const user = session.value?.user as any;

	if (user?.business_user.length === 0) {
		return navigateTo("/app/onboarding");
	}

	if (session.value && to.path === "/app/configuracion") {
		return;
	}

	if (session.value && user?.plan[0]?.name === Plan.FREE && to.path !== "/app/cotizaciones/nuevo") {
		return navigateTo("/app/cotizaciones/nuevo", {
			replace: true,
		});
	}
});
