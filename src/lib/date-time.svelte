<script lang="ts">
	export interface DateTimeProps {
		readonly date: Date;
		readonly locale?: string;
	}

	const { date, locale }: DateTimeProps = $props();

	const formatted = $derived.by(() => {
		const intl = Intl.DateTimeFormat(
			locale,
			{
				dateStyle: "medium",
				timeStyle: "short"
			}
		);

		return intl.format(date);
	});
</script>

<time datetime={date.toISOString()}>
	{formatted}
</time>
