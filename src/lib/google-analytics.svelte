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
		 * Base domain to the site.
		 */
		readonly baseDomain: string;
	}

	const { id, baseDomain }: GoogleAnalyticsProps = $props();

	onMount(() => {
		window.dataLayer = window.dataLayer || [];
		window.gtag = function () {
			window.dataLayer.push(arguments);
		}
		window.gtag("js", new Date());
		const config = page.url.hostname !== baseDomain ? { debug_mode: true } : {};
		window.gtag("config", id, config);

		return browserImportScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
	});
</script>
