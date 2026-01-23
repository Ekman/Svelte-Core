import { redirect } from "@sveltejs/kit";
import type { ProtectConfig } from "../contracts.js";
import { queryParamsCreate } from "@nekm/core";
import {cookieSet, getRedirectUri, STATE_KEY} from "../helper.js";
import { ROUTE_PATH_REDIRECT_LOGIN } from "./redirect-login.js";
import { randomUUID } from "node:crypto";
import type { RouteFactory } from "./routes.js";

export const ROUTE_PATH_LOGIN = "/_auth/login";

export const routeLoginFactory: RouteFactory = (config: ProtectConfig) => {
	const authorizeUrl = `${config.oauth.baseUrl}/${config.oauth.authorizePath ?? "/oauth2/authorize"}`;

	return {
		path: ROUTE_PATH_LOGIN,
		async handle({ event }) {
			const state = randomUUID();
			cookieSet(event.cookies, STATE_KEY, state);

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
