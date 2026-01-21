import type { ProtectConfig } from "$lib/protect/contracts.ts";
import { protect } from "$lib/protect/protect.ts";
import { ROUTE_PATH_REDIRECT_LOGIN } from "$lib/protect/routes/redirect-login.ts";
import { ROUTE_PATH_REDIRECT_LOGOUT } from "$lib/protect/routes/redirect-logout.ts";
import { queryParamsCreate, strTrimEnd, throwIfUndefined } from "@nekm/core";
import type { Handle } from "@sveltejs/kit";

export interface ProtectCognitoConfig extends Pick<ProtectConfig, "protect" | "sessionExists"> {
	readonly cognito: {
		readonly url: string;
		readonly clientId: string;
		readonly scope: string;
		readonly clientSecret: string;
	};
	readonly callback: {
		readonly jwtDecodeAndVerify: (token: string, tokenType: "id" | "access") => Promise<unknown> | unknown;
		readonly onLogin: (authToken: AuthToken, idToken: unknown, accessToken: unknown) => Promise<void> | void;
		readonly onLogout: () => Promise<void> | void;
	};
}

export interface AuthToken {
	readonly id_token: string;
	readonly access_token: string;
	readonly refresh_token: string;
	readonly expires_in: number;
	readonly expires_at: Date;
	readonly token_type: "Bearer";
}

export function protectCognito(config: ProtectCognitoConfig): Handle {
	async function exchangeCodeForToken(
		fetch: typeof window.fetch,
		origin: string,
		code: string,
	): Promise<AuthToken> {
		const response = await fetch(
			`${config.cognito.url}/oauth2/token`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Accept": "application/json",
				},
				body: new URLSearchParams({
					grant_type: "authorization_code",
					client_id: config.cognito.clientId,
					client_secret: config.cognito.clientSecret,
					code,
					redirect_uri: getRedirectUri(origin, ROUTE_PATH_REDIRECT_LOGIN),
				}).toString(),
			}
		);

		const token: AuthToken = await response.json();

		const now = new Date();
		now.setUTCSeconds(now.getUTCSeconds() + token.expires_in);

		return { ...token, expires_at: now };
	}

	function getRedirectUri(origin: string, path: string): string {
		return `${strTrimEnd(origin, "/")}/${path}`;
	}

	return protect({
		protect: config.protect,
		sessionExists: config.sessionExists,
		callback: {
			createLoginUrl: ({ url }) => {
				const params = queryParamsCreate({
					redirect_uri: getRedirectUri(url.origin, ROUTE_PATH_REDIRECT_LOGIN),
					scope: config.cognito.scope,
					client_id: config.cognito.clientId,
					response_type: "code",
				});

				return `${config.cognito.url}/login?${params}`;
			},
			async createRedirectLoginUrl({ url }) {
				// const state = url.searchParams.get("state") ?? undefined;

				const code = url.searchParams.get("code") ?? undefined;
				throwIfUndefined(code);

				const authToken = await exchangeCodeForToken(fetch, url.origin, code);
				const idToken = await config.callback.jwtDecodeAndVerify(authToken.id_token, "id");
				const accessToken = await config.callback.jwtDecodeAndVerify(authToken.access_token, "access");

				await config.callback.onLogin(authToken, idToken, accessToken);

				return "/";
			},
			createLogoutUrl({ url }) {
				const params = queryParamsCreate({
					logout_uri: getRedirectUri(url.origin, ROUTE_PATH_REDIRECT_LOGOUT),
					client_id: config.cognito.clientId,
				});

				return `${config.cognito.url}/logout?${params}`;
			},
			async createRedirectLogoutUrl() {
				await config.callback.onLogout();
				return "/";
			}
		},
	});
}
