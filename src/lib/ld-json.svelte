<script lang="ts">
	export interface LdJsonProps {
		readonly schema: Record<string, unknown>;
		readonly format?: boolean;
	}

	const { schema, format } = $props();

	const json = $derived(JSON.stringify(schema, undefined, format ? 2 : undefined));
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${json}</script>`}
</svelte:head>
