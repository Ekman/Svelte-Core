<script lang="ts">
	import {onMount} from "svelte";
	import {browserImportScript} from "@nekm/core";

	export interface AhrefsProps {
		readonly key: string;
	}

	const { key }: AhrefsProps = $props();

	const url = "https://analytics.ahrefs.com/analytics.js";

	onMount(() => {
		return browserImportScript(url, {
			attributes: { "data-key": key },
		});
	});
</script>

<svelte:head>
	<link rel="dns-prefetch" href={url} />
</svelte:head>
