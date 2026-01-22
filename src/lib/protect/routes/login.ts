import { redirect } from "@sveltejs/kit";
import type { ProtectConfig, RouteFactory } from "../contracts.ts";
import { queryParamsCreate } from "@nekm/core";
import { getRedirectUri } from "../helper.ts";
import { ROUTE_PATH_REDIRECT_LOGIN } from "./redirect-login.ts";

export const ROUTE_PATH_LOGIN = "/_auth/login";

export const routeLoginFactory: RouteFactory = (config: ProtectConfig) => {
	const authorizeUrl = `${config.oauth.baseUrl}/${config.oauth.authorizePath ?? "/oauth2/authorize"}`;

	return {
		path: ROUTE_PATH_LOGIN,
		async handle({ event }) {
			const state = await config.session.stateGenerate();

			const params = queryParamsCreate({
				client_id: config.oauth.clientId,
				response_type: "code",
				redirect_uri: getRedirectUri(event.url.origin, ROUTE_PATH_REDIRECT_LOGIN),
				state,
			});

			throw redirect(302, `${authorizeUrl}?${params}`);
		}
	}
}
