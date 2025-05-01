// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	ssr: false,
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: [
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@nuxt/icon",
		"@nuxt/image",
		"@nuxtjs/tailwindcss",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
		"@vee-validate/nuxt",
		"@samk-dev/nuxt-vcalendar",
		"nuxt-auth-utils",
		"nuxt-security",
	],

	tailwindcss: {
		exposeConfig: true,
		editorSupport: true,
	},

	colorMode: {
		classSuffix: "",
	},

	imports: {
		imports: [
			{
				from: "tailwind-variants",
				name: "tv",
			},
			{
				from: "tailwind-variants",
				name: "VariantProps",
				type: true,
			},
			{
				from: "vue-sonner",
				name: "toast",
				as: "useSonner",
			},
		],
	},

	build: {
		transpile: ["vue-sonner"],
	},
});
