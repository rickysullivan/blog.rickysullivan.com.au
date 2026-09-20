import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { contactEmail, requiredOutputPaths } from "../scripts/assert-built-site.mjs";

test("requiredOutputPaths covers the recovered site routes and public artifacts", () => {
  assert.deepEqual(requiredOutputPaths, [
    "index.html",
    "about/index.html",
    "contact/index.html",
    "post/welcome/index.html",
    "post/the-dennis-denuto-metric/index.html",
    "post/dont-become-vsf-because-you-scud-ran-vfr-into-imc/index.html",
    "rss.xml",
    "robots.txt",
    "sitemap-index.xml",
    "_redirects",
  ]);
});

test("contactEmail is the published contact address", () => {
  assert.equal(contactEmail, "ricky@rickysullivan.com.au");
});

test("masthead keeps the wordmark as a fixed unit on narrow screens", () => {
  const header = readFileSync(
    new URL("../src/components/SiteHeader.astro", import.meta.url),
    "utf8",
  );
  const styles = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");

  assert.match(header, /class="header-actions flex items-center gap-5"/);
  assert.match(styles, /\.wordmark \{[\s\S]*?flex: 0 0 auto;/);
  assert.match(styles, /@media \(max-width: 460px\) \{[\s\S]*?\.site-header \.inner/);
  assert.match(styles, /@media \(max-width: 359px\) \{[\s\S]*?\.theme-switch/);
});
