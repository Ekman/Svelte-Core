import { redirect } from "@sveltejs/kit";
import type { ProtectConfig } from "../contracts.js";
import { noop } from "@nekm/core";
import type { RouteFactory } from "./routes.js";

export const ROUTE_PATH_REDIRECT_LOGOUT = "/_auth/redirect/logout";

export const routeRedirectLogoutFactory: RouteFactory = (config: ProtectConfig) => {
		// Check if the oauth provider supports a logout path.
	if (!config.oauth.logoutPath) {
		return undefined;
	}

	const logout = config.session.logout ?? noop;

	return {
		path: ROUTE_PATH_REDIRECT_LOGOUT,
		async handle({ event }) {
			await logout(event);
			throw redirect(302, "/");
		}
	}
}
