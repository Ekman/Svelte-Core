import type { Handle } from "@sveltejs/kit";
import type { ProtectConfig } from "../contracts.ts";
import { routeLoginFactory } from "./login.ts";
import { routeLogoutFactory } from "./logout.ts";
import { routeRedirectLogoutFactory } from "./redirect-logout.ts";
import { routeRedirectLoginFactory } from "./redirect-login.ts";

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
