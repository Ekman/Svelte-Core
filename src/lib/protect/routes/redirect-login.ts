import { redirect } from "@sveltejs/kit";
import type { ProtectConfig } from "../contracts.js";
import {strTrimEnd, throwIfUndefined} from "@nekm/core";
import {cookieGetAndDelete, getRedirectUri, jwtVerifyAccessToken, jwtVerifyIdToken, STATE_KEY} from "../helper.js";
import { createRemoteJWKSet } from "jose";
import type { RouteFactory } from "./routes.js";

export const ROUTE_PATH_REDIRECT_LOGIN = "_auth/redirect/login";

export const routeRedirectLoginFactory: RouteFactory = (config: ProtectConfig) => {
	const jwksUrl = new URL(config.oauth.jwksUrl ?? `${strTrimEnd(config.oauth.issuer, '/')}/.well-known/jwks.json`);
	const tokenUrl = `${config.oauth.baseUrl}/${config.oauth.tokenPath ?? 'oauth2/token'}`;

	async function exchangeCodeForToken(
		fetch: typeof window.fetch,
		origin: string,
		code: string,
	): Promise<unknown> {
		const response = await fetch(
			tokenUrl,
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

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Token exchange failed: ${error}`);
		}

		return await response.json();
	}

	return {
		path: ROUTE_PATH_REDIRECT_LOGIN,
		async handle({ event }) {
			const state = event.url.searchParams.get("state") ?? undefined;
			const stateCookie = cookieGetAndDelete(event.cookies, STATE_KEY);

			if (state !== stateCookie) {
				throw new Error("State do not match");
			}

			const code = event.url.searchParams.get("code") ?? undefined;
			throwIfUndefined(code);

			const auth = await exchangeCodeForToken(fetch, event.url.origin, code);

			const jwks = createRemoteJWKSet(jwksUrl);

			const [id, access] = await Promise.all([
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
