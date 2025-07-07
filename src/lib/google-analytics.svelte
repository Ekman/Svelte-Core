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
		readonly productionDomain?: string;
	}

	const { id, productionDomain }: GoogleAnalyticsProps = $props();

	function createConfig() {
		if (!productionDomain) {
			return {};
		}

		return page.url.hostname !== productionDomain ? { debug_mode: true } : {};
	}

	onMount(() => {
		window.dataLayer = window.dataLayer || [];
		window.gtag = function () {
			window.dataLayer.push(arguments);
		}
		window.gtag("js", new Date());
		window.gtag("config", id, createConfig());

		return browserImportScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
	});
</script>
