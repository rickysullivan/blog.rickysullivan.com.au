import assert from "node:assert/strict";
import test from "node:test";

import { requiredOutputPaths } from "../scripts/assert-built-site.mjs";

test("requiredOutputPaths covers the recovered site routes and public artifacts", () => {
  assert.deepEqual(requiredOutputPaths, [
    "index.html",
    "about/index.html",
    "post/welcome/index.html",
    "post/the-dennis-denuto-metric/index.html",
    "post/dont-become-vsf-because-you-scud-ran-vfr-into-imc/index.html",
    "rss.xml",
    "robots.txt",
    "sitemap-index.xml",
    "_redirects",
  ]);
});
