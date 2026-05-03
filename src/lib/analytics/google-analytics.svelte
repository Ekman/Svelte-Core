<script lang="ts">
	import {onMount} from "svelte";
	import {browserImportScript} from "@nekm/core";
	import {page} from "$app/state";
	import { dev } from "$app/environment";
	import { debug } from "node:console";

	export interface GoogleAnalyticsProps {
		/**
		 * Google Analytics tracking ID.
		 */
		readonly id: string;

		/**
		 * Activate debug mode. Defaults to true during dev
		 */
		readonly debugMode?: boolean;
	}

	const { id, debugMode = dev }: GoogleAnalyticsProps = $props();

	const url = "https://www.googletagmanager.com";

	onMount(() => {
		let config: { readonly debug_mode?: boolean } = { };

		if (debugMode) {
			config = { debug_mode: true };
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
