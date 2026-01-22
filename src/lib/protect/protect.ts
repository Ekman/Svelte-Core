import { error, redirect, type Handle } from "@sveltejs/kit";
import { ROUTE_PATH_LOGIN, routeLoginFactory } from "./routes/login.js";
import type { ProtectConfig } from "./contracts.js";
import { routeLogoutFactory } from "./routes/logout.js";
import { routeRedirectLoginFactory } from "./routes/redirect-login.js";
import { routeRedirectLogoutFactory } from "./routes/redirect-logout.js";

const routeFactories = Object.freeze([
	routeLoginFactory,
	routeLogoutFactory,
	routeRedirectLoginFactory,
	routeRedirectLogoutFactory,
]);

export function protect(config: ProtectConfig): Handle {
	const protect = config.protect ?? (() => true);

	const routes = new Map(
		routeFactories
			.map(routeFactory => routeFactory(config))
			.filter(route => Boolean(route))
			// @ts-expect-error Incorrect typing error.
			.map(route => [route.path, route.handle]),
	);

	return async ({ event, resolve }) => {
		const routeHandle = routes.get(event.url.pathname);

		if (routeHandle) {
			await routeHandle({ event, resolve });

			// Handle should redirect. If it doesn't, something is wrong.
			throw error(500, "Illegal state");
		}

		if (await protect(event) && !(await config.session.exists(event))) {
			throw redirect(303, ROUTE_PATH_LOGIN);
		}

		return await resolve(event);
	}
}
