<script lang="ts">
	import {onMount} from "svelte";
	import {localeFormatDate} from "$lib/locale.js";

	interface Props {
		readonly date: Date;
	}

	const { date }: Props = $props();

	const isoString = date.toISOString();
	let formatted = $state(isoString);

	onMount(() => {
		formatted = localeFormatDate(date);
	})
</script>

<time datetime={isoString}>
	{formatted}
</time>
