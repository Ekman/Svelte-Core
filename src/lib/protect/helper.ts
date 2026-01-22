import { strTrimEnd } from "@nekm/core";
import type { ProtectConfig } from "./contracts.js";
import { jwtVerify, type JWTVerifyGetKey, type JWTVerifyOptions } from "jose";

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
