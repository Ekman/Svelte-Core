import { redirect } from "@sveltejs/kit";
import type { ProtectConfig } from "../contracts.js";
import { noop, throwIfUndefined } from "@nekm/core";
import { getRedirectUri, jwtVerifyAccessToken, jwtVerifyIdToken } from "../helper.js";
import { createRemoteJWKSet } from "jose";
import type { RouteFactory } from "./routes.ts";

export const ROUTE_PATH_REDIRECT_LOGIN = "_auth/redirect/login";

export const routeRedirectLoginFactory: RouteFactory = (config: ProtectConfig) => {
	const stateGet = config.session.stateGet ?? noop;
	const jwksUrl = new URL(config.oauth.jwksUrl);

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
			const stateSession = await stateGet(event);

			if (state !== stateSession) {
				throw new Error("State do not match");
			}

			const code = event.url.searchParams.get("code") ?? undefined;
			throwIfUndefined(code);

			const auth = await exchangeCodeForToken(fetch, event.url.origin, code);

			const jwks = createRemoteJWKSet(jwksUrl);

			const [ id, access ] = await Promise.all([
				// @ts-expect-error It's OK
				jwtVerifyIdToken(config, jwks, auth.id_token),
				// @ts-expect-error It's OK
				jwtVerifyAccessToken(config, jwks, auth.access_token),
			]);

			await config.session.login(
				event,
				{ auth, id, access },
			);

			throw redirect(302, "/");
		}
	}
}
