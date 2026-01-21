import { strTrimEnd } from "@nekm/core";

export function getRedirectUri(origin: string, path: string): string {
	return `${strTrimEnd(origin, "/")}/${path}`;
}
