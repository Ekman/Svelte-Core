<script lang="ts">
	import {objectRemoveEmpty} from "@nekm/core";
	import {dev} from "$app/environment";

	export interface LdJsonProps {
		readonly schema: Record<string, unknown>;
		readonly format?: boolean;
	}

	const { schema, format = dev }: LdJsonProps = $props();

	const schemaWithoutEmpty = $derived(objectRemoveEmpty(schema));
	const json = $derived(JSON.stringify(schemaWithoutEmpty, undefined, format ? 2 : undefined));
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${json}</script>`}
</svelte:head>
