<script lang="ts">
	import {onMount} from "svelte";
	import {browserImportScript} from "@nekm/core";
	import {page} from "$app/state";

	export interface GoogleAnalyticsProps {
		/**
		 * Google Analytics tracking ID.
		 */
		readonly id: string;

		/**
		 * Base domain to the production site. If the current domain does not match
		 * this, then Google Analytics will send debug data only.
		 */
		readonly productionDomain?: string | URL;
	}

	interface GoogleAnalyticsConfig {
		readonly debug_mode?: boolean;
	}

	const { id, productionDomain }: GoogleAnalyticsProps = $props();

	const url = "https://www.googletagmanager.com";

	const productionDomainStr = $derived(productionDomain instanceof URL ? productionDomain.hostname : productionDomain);

	onMount(() => {
		let config: GoogleAnalyticsConfig = { debug_mode: true };

		if (productionDomain) {
			if (page.url.hostname === productionDomainStr) {
				config = {};
			}
		}

		window.dataLayer = window.dataLayer || [];
		window.gtag = function () {
			window.dataLayer.push(arguments);
		}
		window.gtag("js", new Date());
		window.gtag("config", id, config);

		return browserImportScript(`${url}/gtag/js?id=${id}`);
	});
</script>

<svelte:head>
	<link rel="dns-prefetch" href={url} />
</svelte:head>
