<script lang="ts">
	export interface LdJsonProps {
		readonly schema: Record<string, unknown>;
	}

	const { schema } = $props();

	const json = $derived(JSON.stringify(schema, undefined, 2));
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${json}</script>`}
</svelte:head>
