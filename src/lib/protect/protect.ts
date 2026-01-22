import { error, redirect, type Handle } from "@sveltejs/kit";
import { ROUTE_PATH_LOGIN, routeLoginFactory } from "./routes/login.js";
import type { ProtectConfig } from "./contracts.js";
import { ROUTE_PATH_LOGOUT, routeLogoutFactory } from "./routes/logout.js";
import { routeRedirectLoginFactory } from "./routes/redirect-login.js";
import { routeRedirectLogoutFactory } from "./routes/redirect-logout.js";
import { routeCreate } from "./routes/routes.ts";

const routeFactories = Object.freeze([
	routeLoginFactory,
	routeLogoutFactory,
	routeRedirectLoginFactory,
	routeRedirectLogoutFactory,
]);

export const PROTECT_LOGIN = "/" + ROUTE_PATH_LOGIN;
export const PROTECT_LOGOUT = "/" + ROUTE_PATH_LOGOUT;

export function protect(config: ProtectConfig): Handle {
	const routes = routeCreate(config);

	return async ({ event, resolve }) => {
		const routeHandle = routes.get(event.url.pathname);

		if (routeHandle) {
			await routeHandle({ event, resolve });

			// Handle should redirect. If it doesn't, something is wrong.
			throw error(500, "Illegal state");
		}

		const sessionExists = await config.session.exists(event);

		if (!sessionExists) {
			throw redirect(303, ROUTE_PATH_LOGIN);
		}

		return await resolve(event);
	}
}
