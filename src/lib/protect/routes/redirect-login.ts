import { redirect } from "@sveltejs/kit";
import type { ProtectConfig, RouteFactory } from "../contracts.ts";

export const ROUTE_PATH_REDIRECT_LOGIN = "_auth/redirect/login";

export const routeRedirectLoginFactory: RouteFactory = (config: ProtectConfig) => {
	return {
		path: ROUTE_PATH_REDIRECT_LOGIN,
		async handle({ event }) {
			const loginUrl = await config.callback.createRedirectLoginUrl(event);
			throw redirect(302, loginUrl);
		}
	}
}
