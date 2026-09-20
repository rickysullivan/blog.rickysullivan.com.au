import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getSeriesPeers } from "../src/lib/series.js";

const post = (id, series, date, draft = false) => ({
  id,
  data: { series, date: new Date(date), draft },
});

test("getSeriesPeers returns published posts in the same series, newest first", () => {
  const current = post("current", "Agent delivery", "2026-05-29");
  const posts = [
    current,
    post("older", "Agent delivery", "2026-02-19"),
    post("newer", "Agent delivery", "2026-06-01"),
    post("draft", "Agent delivery", "2026-07-01", true),
    post("other", "Notes", "2026-08-01"),
  ];

  assert.deepEqual(
    getSeriesPeers(posts, current).map((entry) => entry.id),
    ["newer", "older"],
  );
});

test("getSeriesPeers returns no peers when the current post has no series", () => {
  const current = post("current", undefined, "2026-05-29");

  assert.deepEqual(
    getSeriesPeers([current, post("other", "Agent delivery", "2026-06-01")], current),
    [],
  );
});

test("the content collection and Pages CMS expose optional series and curated sources", () => {
  const schema = readFileSync(new URL("../src/content.config.ts", import.meta.url), "utf8");
  const cms = readFileSync(new URL("../.pages.yml", import.meta.url), "utf8");
  const postPage = readFileSync(new URL("../src/pages/post/[slug].astro", import.meta.url), "utf8");

  assert.match(schema, /series:\s*z\.string\(\)\.trim\(\)\.min\(1\)\.optional\(\)/);
  assert.match(schema, /sources:\s*z\s*\.array\(/);
  assert.match(schema, /label:\s*z\.string\(\)\.trim\(\)\.min\(1\),/);
  assert.match(schema, /url:\s*z\.url\(\),/);
  assert.match(cms, /- name: series\n\s+type: string/);
  assert.match(cms, /- name: sources\n\s+type: object\n\s+list: true/);
  assert.match(postPage, /getSeriesPeers/);
  assert.match(postPage, /<h2[^>]*>Sources<\/h2>/);
});
