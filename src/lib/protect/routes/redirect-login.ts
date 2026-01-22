import { redirect } from "@sveltejs/kit";
import type { ProtectConfig, RouteFactory } from "../contracts.ts";
import { noop, throwIfUndefined } from "@nekm/core";
import { getRedirectUri } from "../helper.ts";

export const ROUTE_PATH_REDIRECT_LOGIN = "/_auth/redirect/login";

export const routeRedirectLoginFactory: RouteFactory = (config: ProtectConfig) => {
	const onLogin = config.hooks?.onLogin ?? noop;

	async function exchangeCodeForToken(
		fetch: typeof window.fetch,
		origin: string,
		code: string,
	): Promise<unknown> {
		const response = await fetch(
			`${config.oauth.baseUrl}/oauth2/token`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Accept": "application/json",
				},
				body: new URLSearchParams({
					grant_type: "authorization_code",
					client_id: config.oauth.clientId,
					client_secret: config.oauth.clientSecret,
					code,
					redirect_uri: getRedirectUri(origin, ROUTE_PATH_REDIRECT_LOGIN),
				}).toString(),
			}
		);

		return await response.json();
	}

	return {
		path: ROUTE_PATH_REDIRECT_LOGIN,
		async handle({ event }) {
			const state = event.url.searchParams.get("state") ?? undefined;;
			const stateSession = await config.session.stateGet();

			if (state !== stateSession) {
				throw new Error("State do not match");
			}

			const code = event.url.searchParams.get("code") ?? undefined;
			throwIfUndefined(code);

			const authToken = await exchangeCodeForToken(fetch, event.url.origin, code);
			// @ts-expect-error Ignore, for now
			const idToken = await config.jwtDecodeAndVerifyIdToken(authToken.id_token);
			// @ts-expect-error Ignore, for now
			const accessToken = await config.jwtDecodeAndVerifyAccessToken(authToken.access_token);

			await onLogin(authToken, idToken, accessToken);

			throw redirect(302, "/");
		}
	}
}
