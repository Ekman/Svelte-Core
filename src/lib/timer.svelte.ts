import { interval, timer } from "@nekm/core"

export function effectTimer(waitMs: number, fn: () => void | Promise<void>): void {
	$effect(() => {
		let stop = false;

		timer(waitMs).then(async () => {
			if (!stop) {
				await fn();
			}
		});

		return () => {
			stop = true;
		}
	})
}

export function effectInterval(waitMs: number, fn: () => void | Promise<void>) {
	$effect(() => interval(waitMs, fn));
}
