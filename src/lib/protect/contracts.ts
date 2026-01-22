import type { Handle, RequestEvent } from "@sveltejs/kit";

export interface ProtectTokens {
	readonly auth: unknown;
	readonly id: unknown;
	readonly access: unknown;
}

export interface ProtectConfig {
	readonly protect?: (event: RequestEvent) => Promise<boolean> | boolean;
	readonly jwtDecodeAndVerifyIdToken: (token: string) => Promise<unknown> | unknown;
	readonly jwtDecodeAndVerifyAccessToken: (token: string) => Promise<unknown> | unknown;
	readonly session: {
		readonly exists: (event: RequestEvent) => Promise<boolean> | boolean;
		readonly stateGenerate: (event: RequestEvent) => Promise<string> | string;
		readonly stateGet: (event: RequestEvent) => Promise<string> | string;
	};
	readonly hooks?: {
		readonly onLogout?: (event: RequestEvent) => Promise<void> | void;
		readonly onLogin?: (event: RequestEvent, tokens: ProtectTokens) => Promise<void> | void;
	};
	readonly oauth: {
		readonly clientId: string;
		readonly clientSecret: string;
		readonly baseUrl: string;
		readonly authorizePath?: string;
		readonly logoutPath?: string;
	}
}

export interface Route {
	readonly path: string;
	readonly handle: Handle;
}

export type RouteFactory = (config: ProtectConfig) => Route | undefined;
