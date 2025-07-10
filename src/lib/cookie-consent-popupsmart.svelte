<script lang="ts">
	import {onMount} from "svelte";
	import {page} from "$app/state";
	import {browserImportScript} from "@nekm/core";

	export interface CookieConsentPopupsmart {
		readonly Palette?: string;
		readonly Mode?: string;
		readonly Theme?: string;
		readonly Location?: string;
		readonly LinkText?: string;
		readonly Message?: string;
		readonly ButtonText?: string;
	}

	const props: CookieConsentPopupsmart = $props();

	const url = "https://cookieconsent.popupsmart.com";

	onMount(async () => {
		await browserImportScript(`${url}/src/js/popper.js`);

		if ("start" in window) {
			// See: https://cookieconsent.popupsmart.com/#simple-cookie-consent
			// @ts-expect-error
			window.start.init({
				Palette: "palette3",
				Mode: "floating right",
				Theme: "edgeless",
				Location: `${page.url.origin}/privacy-policy`,
				LinkText: "Read the privacy policy",
				Message: "This website uses cookies to enhance your experience and analyze usage. By continuing to use this site, you consent to this data processing.",
				ButtonText: "OK, I understand",
				// Order matters. We want anything that is passed in to
				// be the mot important.
				...props,
			});
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href={url} />
</svelte:head>
