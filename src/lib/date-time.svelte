<script lang="ts">
	import {onMount} from "svelte";
	import {localeFormatDate} from "$lib/locale.js";

	interface Props {
		readonly date: Date;
	}

	const { date }: Props = $props();

	const isoString = $derived(date.toISOString());
	let formatted = $state(localeFormatDate(date));

	onMount(() => {
		// Want to rerun this on mount as we want to use the browser
		// locale.
		formatted = localeFormatDate(date);
	})
</script>

<time datetime={isoString}>
	{formatted}
</time>
