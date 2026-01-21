import { redirect } from "@sveltejs/kit";
import type { ProtectConfig, RouteFactory } from "../contracts.ts";
import { queryParamsCreate } from "@nekm/core";
import { getRedirectUri } from "../helper.ts";
import { ROUTE_PATH_REDIRECT_LOGOUT } from "./redirect-logout.ts";

export const ROUTE_PATH_LOGOUT = "_auth/logout";

export const routeLogoutFactory: RouteFactory = (config: ProtectConfig) => {
	// Check if the oauth provider supports a logout path.
	if (!config.oauth.logoutPath) {
		return undefined;
	}

	const logoutUrl = `${config.oauth.baseUrl}/${config.oauth.logoutPath}`;

	return {
		path: ROUTE_PATH_LOGOUT,
		async handle({ event }) {
			const params = queryParamsCreate({
				logout_uri: getRedirectUri(event.url.origin, ROUTE_PATH_REDIRECT_LOGOUT),
				client_id: config.oauth.clientId,
			});

			throw redirect(302, `${logoutUrl}?${params}`);
		}
	}
}
