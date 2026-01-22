import type { Handle } from "@sveltejs/kit";
import type { ProtectConfig } from "../contracts.js";
import { routeLoginFactory } from "./login.js";
import { routeLogoutFactory } from "./logout.js";
import { routeRedirectLogoutFactory } from "./redirect-logout.js";
import { routeRedirectLoginFactory } from "./redirect-login.js";

export interface Route {
	readonly path: string;
	readonly handle: Handle;
}

export type RouteFactory = (config: ProtectConfig) => Route | undefined;

const routeFactories = Object.freeze([
	routeLoginFactory,
	routeLogoutFactory,
	routeRedirectLoginFactory,
	routeRedirectLogoutFactory,
]);

export function routeCreate(config: ProtectConfig): Map<string, Handle> {
	return new Map(
		routeFactories
			.map(routeFactory => routeFactory(config))
			.filter(route => Boolean(route))
			// @ts-expect-error Incorrect typing error.
			.map(route => [`/${route.path}`, route.handle]),
	);
}
