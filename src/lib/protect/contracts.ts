import type { RequestEvent } from "@sveltejs/kit";

export interface ProtectTokens {
	readonly auth: unknown;
	readonly id: unknown;
	readonly access: unknown;
}

export interface ProtectConfig {
	readonly session: {
		readonly exists: (event: RequestEvent) => Promise<boolean> | boolean;
		readonly login: (event: RequestEvent, tokens: ProtectTokens) => Promise<void> | void;
		readonly logout?: (event: RequestEvent) => Promise<void> | void;
	};
	readonly oauth: {
		readonly clientId: string;
		readonly clientSecret: string;
		readonly baseUrl: string;
		readonly authorizePath?: string;
		readonly logoutPath?: string;
		readonly jwksUrl?: string;
		readonly issuer: string;
	}
}
