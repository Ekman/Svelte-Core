import { strTrimEnd } from "@nekm/core";
import type { ProtectConfig } from "./contracts.js";
import { jwtVerify } from "jose";

export function getRedirectUri(origin: string, path: string): string {
	return `${strTrimEnd(origin, "/")}/${path}`;
}

export async function jwtVerifyIdToken(config: ProtectConfig, jwks: unknown, idToken: string) {
	const { payload } = await jwtVerify(
		idToken,
		// @ts-expect-error It's OK.
		jwks,
		{
			issuer: config.oauth.issuer,
			audience: config.oauth.clientId,
		}
	);

	return payload;
}

export async function jwtVerifyAccessToken(config: ProtectConfig, jwks: unknown, accessToken: string) {
	const { payload } = await jwtVerify(
		accessToken,
		// @ts-expect-error It's OK.
		jwks,
		{ issuer: config.oauth.issuer }
	);

	return payload;
}
