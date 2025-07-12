import { browserAssert } from "@nekm/core";

declare global {
  interface Window {
    gtag(...args: unknown[]): void;
    dataLayer: unknown[];
  }
}

export function gtag(
  command: string,
  event: string,
  params?: Record<string, unknown>,
): void {
  browserAssert();
  window.gtag(command, event, params);
}
