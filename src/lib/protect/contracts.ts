import type { Handle, RequestEvent } from "@sveltejs/kit";

type ProtectEvent<T = string> = (event: RequestEvent) => Promise<T> | T;

export interface ProtectConfig {
	readonly protect: ProtectEvent<boolean>;
	readonly sessionExists: () => ProtectEvent<boolean>
	readonly callback: {
		readonly createLoginUrl: ProtectEvent;
		readonly createRedirectLoginUrl: ProtectEvent;
		readonly createLogoutUrl: ProtectEvent;
		readonly createRedirectLogoutUrl: ProtectEvent;
	}
}

export interface Route {
	readonly path: string;
	readonly handle: Handle;
}

export type RouteFactory = (config: ProtectConfig) => Route;
