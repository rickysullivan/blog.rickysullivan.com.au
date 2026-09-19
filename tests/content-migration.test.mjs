import assert from "node:assert/strict";
import test from "node:test";

import { isIgnoredArtifact, rewriteBody, selectPublished } from "../scripts/content-migration.mjs";

test("selectPublished excludes the special about page and Ghost drafts", () => {
  const entries = [
    { slug: "about", status: "published" },
    { slug: "welcome", status: "published" },
    { slug: "tell-him-hes-dreamin", status: "draft" },
  ];

  assert.deepEqual(selectPublished(entries), [{ slug: "welcome", status: "published" }]);
});

test("rewriteBody converts recovered image, document, and Ghost post URLs", () => {
  const input = [
    "![A photo](../images/2026/05/valley.png)",
    "[A clipping](../files/2025/08/drongo.pdf)",
    "[Related post](__GHOST_URL__/the-dennis-denuto-metric/)",
  ].join("\n");

  assert.equal(
    rewriteBody(input),
    [
      "![A photo](/media/images/2026/05/valley.png)",
      "[A clipping](/media/documents/2025/08/drongo.pdf)",
      "[Related post](/post/the-dennis-denuto-metric/)",
    ].join("\n"),
  );
});

test("isIgnoredArtifact keeps Finder metadata out of public media", () => {
  assert.equal(isIgnoredArtifact(".DS_Store"), true);
  assert.equal(isIgnoredArtifact("stormy-valley.png"), false);
});
