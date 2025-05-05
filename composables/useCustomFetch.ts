import type { UseFetchOptions } from "nuxt/app";

export function useCustomFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
	return useFetch(url, {
		...options,
		headers: {
			"x-business-id": "e9af9d9f-9c87-46a4-9ccc-898443fceeb7",
		},
	});
}
