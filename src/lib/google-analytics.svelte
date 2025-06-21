<script lang="ts">
	import {onMount} from "svelte";
	import {assets} from "$app/paths";
	import {browserImportScript} from "@nekm/core";
	import {page} from "$app/state";

	interface Props {
		/**
		 * Google Analytics tracking ID.
		 */
		readonly id: string;

		/**
		 * Base URL to the site.
		 * @default assets
		 */
		readonly baseUrl?: URL;
	}

	const { id, baseUrl: baseUrlProps }: Props = $props();
	const baseUrl = baseUrlProps ?? new URL(assets);

	onMount(() => {
		window.dataLayer = window.dataLayer || [];
		window.gtag = function () {
			window.dataLayer.push(arguments);
		}
		window.gtag("js", new Date());
		const config = page.url.hostname !== baseUrl.hostname ? { debug_mode: true } : {};
		window.gtag("config", id, config);

		return browserImportScript(`https://www.googletagmanager.com/gtag/js?id=${id}`);
	});
</script>
