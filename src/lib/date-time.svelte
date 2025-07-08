<script lang="ts">
	import {localeFormatDate} from "$lib/locale.js";

	interface Props {
		readonly date: Date;
		readonly locale?: string;
	}

	const { date, locale }: Props = $props();

	const isoString = $derived(date.toISOString());
	const formatted = $derived(localeFormatDate(date, locale));
</script>

<time datetime={isoString}>
	{formatted}
</time>
