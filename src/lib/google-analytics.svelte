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

	const { id, productionDomain }: GoogleAnalyticsProps = $props();

	onMount(() => {
		let config = {};

		if (productionDomain) {
			const productionDomainStr = productionDomain instanceof URL ? productionDomain.hostname : productionDomain;
			config = page.url.hostname !== productionDomainStr ? { debug_mode: true } : {};
		}

		window.dataLayer = window.dataLayer || [];
		window.gtag = function () {
			window.dataLayer.push(arguments);
		}
		window.gtag("js", new Date());
		window.gtag("config", id, config);

		return browserImportScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://www.googletagmanager.com" />
</svelte:head>
