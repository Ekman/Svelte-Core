export function localeFormatDate(date: Date, locale?: string): string {
	const intl = Intl.DateTimeFormat(
		locale,
		{
			dateStyle: "medium",
			timeStyle: "short"
		}
	);

	return intl.format(date);
}
