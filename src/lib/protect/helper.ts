import { strTrimEnd } from "@nekm/core";
import type { ProtectConfig } from "./contracts.js";
import { jwtVerify, type JWTVerifyGetKey, type JWTVerifyOptions } from "jose";
import type {Cookies} from "@sveltejs/kit";

export const STATE_KEY = 'oauth_state';

export function getRedirectUri(origin: string, path: string): string {
	return `${strTrimEnd(origin, "/")}/${path}`;
}

export function jwtVerifyIdToken(config: ProtectConfig, jwks: JWTVerifyGetKey, idToken: string) {
	return jwtVerifyToken(
		jwks,
		{
			issuer: config.oauth.issuer,
			audience: config.oauth.clientId,
		},
		idToken,
	);
}

export function jwtVerifyAccessToken(config: ProtectConfig, jwks: JWTVerifyGetKey, accessToken: string) {
	return jwtVerifyToken(jwks, { issuer: config.oauth.issuer }, accessToken);
}

async function jwtVerifyToken(jwks: JWTVerifyGetKey, options: JWTVerifyOptions, token: string) {
	const { payload } = await jwtVerify(token, jwks, options);

	return payload;
}

const cookieDeleteOptions = Object.freeze({ path: '/' });

const cookieSetOptions = Object.freeze({
	...cookieDeleteOptions,
	httpOnly: true,
	secure: true,
	sameSite: 'lax',
	maxAge: 1800, // 30 minutes
},);

export function cookieSet(cookies: Cookies, key: string, value: string) {
	cookies.set(key, value, cookieSetOptions);
}

export function cookieGetAndDelete(cookies: Cookies, key: string): string | undefined {
	const value = cookies.get(key);

	if (!value) {
		return undefined;
	}

	cookies.delete(key, cookieDeleteOptions);

	return value;
}
