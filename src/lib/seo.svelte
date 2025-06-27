<script lang="ts">
	import {type QueryParams, queryParamsCreate} from "@nekm/core";

	export interface SeoCanonical {
		readonly path?: string;
		readonly queryParams?: QueryParams;
	}

	export interface SeoIcon {
		readonly href: string;
		readonly height: number;
		readonly width: number;
		readonly mimeContentType: string;
	}

	export interface SeoProps {
		readonly siteTitle: string;
		readonly pageTitle: string;
		readonly description: string;
		readonly origin: string;
		readonly icon: SeoIcon;
		readonly canonical?: SeoCanonical;
		readonly next?: SeoCanonical;
	}

	const { siteTitle, description, pageTitle, icon, canonical, next, origin }: SeoProps = $props();

	function createCanonical(canonical?: SeoCanonical, includeBaseUrl = false): string | undefined {
		let url;

		if (canonical || includeBaseUrl) {
			url = origin;
		}

		if (canonical?.path) {
			url += `/${canonical.path}`;
		}

		if (canonical?.queryParams) {
			const queryParamsStr = queryParamsCreate(canonical.queryParams)
			url += `?${queryParamsStr}`;
		}

		return url;
	}

	let canonicalUrl = $state(createCanonical(canonical, true));
	let nextUrl = $state(createCanonical(next));

	$effect(() => {
		canonicalUrl = createCanonical(canonical, true);
	});

	$effect(() => {
		nextUrl = createCanonical(next);
	});
</script>

<svelte:head>
	<title>{pageTitle} | {siteTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	{#if nextUrl}
		<link rel="next" href={nextUrl} />
	{/if}

	<meta property="og:site_name" content={siteTitle} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={icon.href} />
	<meta property="og:image:secure_url" content={icon.href} />
	<meta property="og:image:width" content={"" + icon.width} />
	<meta property="og:image:height" content={"" + icon.height} />
	<meta property="og:image:type" content={icon.mimeContentType} />
	<meta property="og:image:alt" content={`${siteTitle} logo`} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={icon.href} />
	<meta name="twitter:creator" content="@iamBraska" />
</svelte:head>
