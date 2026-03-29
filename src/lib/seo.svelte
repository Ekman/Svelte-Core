<script lang="ts">
	import { page } from "$app/state";
	import {
		type QueryParams,
		queryParamsCreate,
		strTrimStart,
		urlSetOrigin,
	} from "@nekm/core";

	export interface SeoCanonical {
		readonly path?: string;
		readonly queryParams?: QueryParams;
	}

	export interface SeoIcon {
		readonly href: string;
		readonly mimeContentType: string;
		readonly height: number;
		readonly width: number;
	}

	export interface SeoTwitter {
		readonly creator?: string;
		readonly site?: string;
	}

	export interface SeoProps {
		readonly siteTitle: string;
		readonly pageTitle: string;
		readonly description: string;
		readonly origin?: string;
		readonly icon: SeoIcon;
		readonly additionalIcons?: ReadonlyArray<SeoIcon>;
		readonly canonical?: SeoCanonical;
		readonly next?: SeoCanonical;
		readonly twitter?: SeoTwitter;
	}

	const {
		siteTitle,
		pageTitle,
		description,
		icon,
		additionalIcons = [],
		canonical = { path: page.url.pathname },
		next,
		origin = page.url.origin,
		twitter,
	}: SeoProps = $props();

	function createCanonical(canonical: SeoCanonical): string | undefined {
		if (!canonical.path) return origin;

		const path = strTrimStart(canonical.path, "/");
		if (path.length <= 0) return origin;

		const canonicalWithPath = `${origin}/${path}`;
		if (!canonical.queryParams) return canonicalWithPath;

		return `${canonicalWithPath}?${queryParamsCreate(canonical.queryParams)}`;
	}

	const iconHref = $derived(urlSetOrigin(origin, icon.href));
	const canonicalUrl = $derived(createCanonical(canonical));
	const nextUrl = $derived(!next ? undefined : createCanonical(next));
	const additionalAppleIcons = $derived(
		additionalIcons.filter((i) => i.mimeContentType === "image/png"),
	);
</script>

<svelte:head>
	<title>{pageTitle} | {siteTitle}</title>
	<meta name="description" content={description} />

	<link rel="canonical" href={canonicalUrl} />
	{#if nextUrl}
		<link rel="next" href={nextUrl} />
	{/if}

	<link
		rel="icon"
		type={icon.mimeContentType}
		sizes="{icon.width}x{icon.height}"
		href={icon.href}
	/>

	{#if icon.mimeContentType === "image/png"}
		<link
			rel="apple-touch-icon"
			sizes="{icon.width}x{icon.height}"
			href={icon.href}
		/>
	{/if}

	{#each additionalIcons as icon}
		<link
			rel="icon"
			type={icon.mimeContentType}
			sizes="{icon.width}x{icon.height}"
			href={icon.href}
		/>
	{/each}

	{#each additionalAppleIcons as icon}
		<link
			rel="apple-touch-icon"
			sizes="{icon.width}x{icon.height}"
			href={icon.href}
		/>
	{/each}

	<meta property="og:site_name" content={siteTitle} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={iconHref} />
	<meta property="og:image:secure_url" content={iconHref} />
	<meta property="og:image:width" content={"" + icon.width} />
	<meta property="og:image:height" content={"" + icon.height} />
	<meta property="og:image:type" content={icon.mimeContentType} />
	<meta property="og:image:alt" content={`${siteTitle} logo`} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={iconHref} />

	{#if twitter?.creator}
		<meta name="twitter:creator" content="@{twitter.creator}" />
	{/if}

	{#if twitter?.site}
		<meta name="twitter:site" content="@{twitter.site}" />
	{/if}
</svelte:head>
