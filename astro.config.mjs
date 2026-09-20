// @ts-check
import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { unified } from "@astrojs/markdown-remark";
import rehypeSlug from "rehype-slug";
import { rehypeResponsiveMedia } from "./scripts/sync-media-assets.mjs";
import { siteConfig } from "./src/config/site.ts";
import { codeThemes, codeDefaultColor } from "./src/config/code.ts";

import mdx from "@astrojs/mdx";

const shikiConfig = /** @type {const} */ ({
  themes: codeThemes,
  defaultColor: codeDefaultColor,
});

const responsiveMediaManifest = JSON.parse(
  readFileSync(new URL("./src/generated-media-manifest.json", import.meta.url), "utf8"),
);

export default defineConfig({
  site: siteConfig.siteUrl,
  integrations: [
    sitemap({
      filter: (page) => page !== new URL("/search/", siteConfig.siteUrl).toString(),
    }),
    mdx(),
  ],
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeSlug, [rehypeResponsiveMedia, responsiveMediaManifest]],
    }),
    shikiConfig,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
