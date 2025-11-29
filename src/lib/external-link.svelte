<script lang="ts">
	import type {Snippet} from "svelte";

	export interface ExternalLinkProps {
		readonly href: string;
		readonly children: Snippet;
		readonly type?: "nofollow" | "ugc" | "sponsored";
	}

	const { href, children, type = "nofollow" }: ExternalLinkProps = $props();
</script>

<a {href} target="_blank" rel="{type} noreferrer noopener">
	{@render children()}
</a>
