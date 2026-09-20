import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const readSource = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("client navigation is enabled with a full-page fallback", () => {
  const layout = readSource("../src/layouts/BaseLayout.astro");

  assert.match(layout, /import\s*\{\s*ClientRouter\s*\}\s*from\s*["']astro:transitions["']/);
  assert.match(layout, /<ClientRouter\s+fallback="none"\s*\/>/);
});

test("theme and header controls reinitialise after each routed navigation", () => {
  const layout = readSource("../src/layouts/BaseLayout.astro");
  const header = readSource("../src/components/SiteHeader.astro");
  const post = readSource("../src/pages/post/[slug].astro");
  const codeGroup = readSource("../src/components/mdx/CodeGroup.astro");

  assert.match(layout, /astro:after-swap/);
  assert.match(layout, /astro:page-load/);
  assert.match(header, /data-astro-rerun/);
  assert.match(header, /AbortController/);
  assert.match(header, /__siteHeaderCleanup/);
  assert.match(post, /data-astro-rerun/);
  assert.match(post, /astro:page-load/);
  assert.match(codeGroup, /astro:page-load/);
});
