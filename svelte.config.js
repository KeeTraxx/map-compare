import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  compilerOptions: {
    // Disable accessibility warnings
    warningFilter: (warning) => {
      // Ignore a11y warnings about onclick needing keyboard events
      if (warning.code === 'a11y_click_events_have_key_events') return false;
      if (warning.code === 'a11y_no_static_element_interactions') return false;
      // Allow other warnings
      return true;
    },
  },
};
