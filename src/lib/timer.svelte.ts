import { interval } from "@nekm/core"

export function effectTimer(waitMs: number, fn: () => void | Promise<void>): void {
	$effect(() => {
		const timeoutId = setTimeout(fn, waitMs);
		return () => clearTimeout(timeoutId);
	})
}

export function effectInterval(waitMs: number, fn: () => void | Promise<void>) {
	$effect(() => interval(waitMs, fn));
}
