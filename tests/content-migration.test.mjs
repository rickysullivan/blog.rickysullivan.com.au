import assert from "node:assert/strict";
import test from "node:test";

import {
  isIgnoredArtifact,
  renderPost,
  rewriteBody,
  selectPublished,
} from "../scripts/content-migration.mjs";

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

test("rewriteBody turns an image followed by prose into a semantic caption", () => {
  const input =
    "![Stormy valley](../images/2026/05/valley.png)Scud running through unclear requirements.";

  assert.equal(
    rewriteBody(input),
    [
      "<figure>",
      '  <img src="/media/images/2026/05/valley.png" alt="Stormy valley" />',
      "  <figcaption>Scud running through unclear requirements.</figcaption>",
      "</figure>",
    ].join("\n"),
  );
});

test("rewriteBody converts a Ghost reusable card into a smaller disclosure block", () => {
  const input = [
    "kg-card-begin: html",
    "**AI disclosure:**",
    "",
    "This article was written with AI assistance.",
    "",
    "The argument and responsibility for the piece are mine.",
    "kg-card-end: html",
  ].join("\n");

  const output = rewriteBody(input);

  assert.match(
    output,
    /<aside class="article-card article-card--small" aria-label="AI disclosure">/,
  );
  assert.match(output, /<p class="article-card-title">AI disclosure<\/p>/);
  assert.doesNotMatch(output, /kg-card-(begin|end)/);
});

test("isIgnoredArtifact keeps Finder metadata out of public media", () => {
  assert.equal(isIgnoredArtifact(".DS_Store"), true);
  assert.equal(isIgnoredArtifact("stormy-valley.png"), false);
});

test("renderPost preserves a recovered local feature image as the post cover", () => {
  const rendered = renderPost({
    title: "It's the Vibe of it",
    slug: "the-dennis-denuto-metric",
    published_at: "2026-02-19T08:18:05.000Z",
    updated_at: "2026-05-28T22:45:26.000Z",
    feature_image: "../images/2026/02/8BE5F841-23F3-4C0E-8323-DEED36F28FE7.png",
    body: "Recovered body.",
  });

  assert.match(
    rendered,
    /cover:\n  src: "\/media\/images\/2026\/02\/8BE5F841-23F3-4C0E-8323-DEED36F28FE7\.png"/,
  );
});

test("renderPost restores the Dennis post's recovered courtroom video poster", () => {
  const rendered = renderPost({
    title: "It's the Vibe of it",
    slug: "the-dennis-denuto-metric",
    published_at: "2026-02-19T08:18:05.000Z",
    updated_at: "2026-05-28T22:45:26.000Z",
    body: "> \"It's the Constitution. It's Mabo. It's justice. It's law. It's the vibe and... ahh, no, that's it. It's the vibe.\"",
  });

  assert.match(rendered, /\/media\/images\/2026\/02\/the-castle\.jpg/);
  assert.match(rendered, /https:\/\/www\.youtube\.com\/watch\?v=97IiPli_uXw/);
});
