<script lang="ts">
	import {assets} from "$app/paths";
	import {type QueryParams, queryParamsCreate} from "@nekm/core";

	export interface SeoCanonical {
		readonly path?: string;
		readonly queryParams?: QueryParams;
	}

	export interface SeoProps {
		readonly appName: string;
		readonly description: string;
		readonly title: string;
		readonly icon: string;
		readonly canonical?: SeoCanonical;
		readonly next?: SeoCanonical;
	}

	const { appName, description, title, icon, canonical, next }: SeoProps = $props();

	function createCanonical(canonical?: SeoCanonical, includeBaseUrl = false): string | undefined {
		let url;

		if (canonical || includeBaseUrl) {
			url = assets;
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
	<title>{appName} &raquo; {title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	{#if nextUrl}
		<link rel="next" href={nextUrl} />
	{/if}

	<meta property="og:site_name" content={appName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={icon} />
	<meta property="og:image:secure_url" content={icon} />
	<meta property="og:image:width" content="1024" />
	<meta property="og:image:height" content="1024" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:alt" content={`${appName} logo`} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />

	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={icon} />
	<meta name="twitter:creator" content="@iamBraska" />
</svelte:head>
