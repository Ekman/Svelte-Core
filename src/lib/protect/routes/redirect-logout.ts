import { redirect } from "@sveltejs/kit";
import type { ProtectConfig, RouteFactory } from "../contracts.ts";
import { noop } from "@nekm/core";

export const ROUTE_PATH_REDIRECT_LOGOUT = "_auth/redirect/logout";

export const routeRedirectLogoutFactory: RouteFactory = (config: ProtectConfig) => {
		// Check if the oauth provider supports a logout path.
	if (!config.oauth.logoutPath) {
		return undefined;
	}

	const onLogout = config.hooks?.onLogout ?? noop;

	return {
		path: ROUTE_PATH_REDIRECT_LOGOUT,
		async handle() {
			await onLogout();
			throw redirect(302, "/");
		}
	}
}
