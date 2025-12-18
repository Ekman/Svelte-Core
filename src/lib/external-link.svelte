<script lang="ts">
	import type {Snippet} from "svelte";
	import {page} from "$app/state";

	export interface ExternalLinkProps {
		readonly href: string;
		readonly children: Snippet;
		readonly type?: "dofollow" | "nofollow" | "ugc" | "sponsored";
		readonly origin?: string;
	}

	const { href, children, type = "nofollow", origin }: ExternalLinkProps = $props();

	const source = $derived(origin ?? page.url.origin);

	const hrefWithSource = $derived.by(() => {
		const sign = href.includes("?") ? "&" : "?";
		return href + sign + `utm_source=${encodeURIComponent(source)}`;
	});

	const rel = $derived(type === "dofollow" ? undefined : type);
</script>

<a href={hrefWithSource}
	 target="_blank" rel="{rel} noreferrer noopener">
	{@render children()}
</a>
