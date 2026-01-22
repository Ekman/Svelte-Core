import { redirect } from "@sveltejs/kit";
import type { ProtectConfig } from "../contracts.js";
import { noop, queryParamsCreate } from "@nekm/core";
import { getRedirectUri } from "../helper.js";
import { ROUTE_PATH_REDIRECT_LOGIN } from "./redirect-login.js";
import { randomUUID } from "node:crypto";
import type { RouteFactory } from "./routes.ts";

export const ROUTE_PATH_LOGIN = "_auth/login";

export const routeLoginFactory: RouteFactory = (config: ProtectConfig) => {
	const authorizeUrl = `${config.oauth.baseUrl}/${config.oauth.authorizePath ?? "/oauth2/authorize"}`;
	const statePersist = config.session.statePersist ?? noop;

	return {
		path: ROUTE_PATH_LOGIN,
		async handle({ event }) {
			const state = randomUUID();
			await statePersist(event, state);

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
