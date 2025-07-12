<script lang="ts">
	import {onMount} from "svelte";
	import {browserImportScript} from "@nekm/core";

	export interface AhrefsProps {
		readonly key: string;
	}

	const { key }: AhrefsProps = $props();

	const url = "https://analytics.ahrefs.com";

	onMount(() => {
		return browserImportScript(`${url}/analytics.js`, {
			attributes: { "data-key": key },
		});
	});
</script>

<svelte:head>
	<link rel="dns-prefetch" href={url} />
</svelte:head>
