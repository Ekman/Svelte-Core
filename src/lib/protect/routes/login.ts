import { redirect } from "@sveltejs/kit";
import type { ProtectConfig, RouteFactory } from "../contracts.ts";

export const ROUTE_PATH_LOGIN = "_auth/login";

export const routeLoginFactory: RouteFactory = (config: ProtectConfig) => {
	return {
		path: ROUTE_PATH_LOGIN,
		async handle({ event }) {
			const loginUrl = await config.callback.createLoginUrl(event);
			throw redirect(302, loginUrl);
		}
	}
}
