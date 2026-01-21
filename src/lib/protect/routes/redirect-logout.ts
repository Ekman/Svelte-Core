import { redirect } from "@sveltejs/kit";
import type { ProtectConfig, RouteFactory } from "../contracts.ts";

export const ROUTE_PATH_REDIRECT_LOGOUT = "_auth/redirect/logout";

export const routeRedirectLogoutFactory: RouteFactory = (config: ProtectConfig) => {
	return {
		path: ROUTE_PATH_REDIRECT_LOGOUT,
		async handle({ event }) {
			const loginUrl = await config.callback.createLogoutUrl(event);
			throw redirect(302, loginUrl);
		}
	}
}
