import { error, redirect, type Handle } from "@sveltejs/kit";
import { ROUTE_PATH_LOGIN, routeLoginFactory } from "./routes/login.ts";
import type { ProtectConfig, Route } from "./contracts.ts";
import { routeLogoutFactory } from "./routes/logout.ts";
import { routeRedirectLoginFactory } from "./routes/redirect-login.ts";
import { routeRedirectLogoutFactory } from "./routes/redirect-logout.ts";

const routeFactories = Object.freeze([
	routeLoginFactory,
	routeLogoutFactory,
	routeRedirectLoginFactory,
	routeRedirectLogoutFactory,
]);

export function protect(config: ProtectConfig): Handle {
	const routes: ReadonlyArray<Route> = routeFactories.map(x => x(config));

	return async ({ event, resolve }) => {
		for (const route of routes) {
			if (event.url.pathname === route.path) {
				await route.handle({ event, resolve });
				// Handle should redirect. If it doesn't, something is wrong.
				throw error(500, "Illegal state");
			}
		}

		if (await config.protect(event)) {
			if (!await config.sessionExists()) {
				throw redirect(303, ROUTE_PATH_LOGIN);
			}
		}

		return await resolve(event);
	}
}
