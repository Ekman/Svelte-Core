<script lang="ts">
	import {localeFormatDate} from "$lib/locale.js";

	export interface DateTimeProps {
		readonly date: Date;
		readonly locale?: string;
	}

	const { date, locale }: DateTimeProps = $props();

	const isoString = $derived(date.toISOString());
	const formatted = $derived(localeFormatDate(date, locale));
</script>

<time datetime={isoString}>
	{formatted}
</time>
