import type { Handle, RequestEvent } from "@sveltejs/kit";

export interface ProtectTokens<TAuthToken = unknown, TIdToken = unknown, TAccessToken = unknown> {
	readonly auth: TAuthToken;
	readonly id: TIdToken;
	readonly access: TAccessToken;
}

export interface ProtectConfig<TAuthToken = unknown, TIdToken = unknown, TAccessToken = unknown> {
	readonly protect?: (event: RequestEvent) => Promise<boolean> | boolean;
	readonly jwtDecodeAndVerifyIdToken: (token: string) => Promise<TIdToken> | TIdToken;
	readonly jwtDecodeAndVerifyAccessToken: (token: string) => Promise<TAccessToken> | TAccessToken;
	readonly session: {
		readonly exists: (event: RequestEvent) => Promise<boolean> | boolean;
		readonly stateGenerate: (event: RequestEvent) => Promise<string> | string;
		readonly stateGet: (event: RequestEvent) => Promise<string> | string;
	};
	readonly hooks?: {
		readonly onLogout?: (event: RequestEvent) => Promise<void> | void;
		readonly onLogin?: (event: RequestEvent, tokens: ProtectTokens<TAuthToken, TIdToken, TAccessToken>) => Promise<void> | void;
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
