import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readProjectFile = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("runs media generation before Astro commands and does not track generated derivatives", async () => {
  const [packageJson, gitignore] = await Promise.all([
    readProjectFile("package.json"),
    readProjectFile(".gitignore"),
  ]);
  const scripts = JSON.parse(packageJson).scripts;

  assert.equal(scripts["media:sync"], "node scripts/sync-media-assets.mjs");
  assert.equal(scripts.prebuild, "npm run media:sync");
  assert.equal(scripts.precheck, "npm run media:sync");
  assert.equal(scripts.predev, "npm run media:sync");
  assert.match(gitignore, /^public\/media\/_responsive\/$/m);
  assert.match(gitignore, /^src\/generated-media-manifest\.json$/m);
});

test("uses the responsive image transformer for article Markdown and post covers", async () => {
  const [config, postPage] = await Promise.all([
    readProjectFile("astro.config.mjs"),
    readProjectFile("src/pages/post/[slug].astro"),
  ]);

  assert.match(config, /rehypeResponsiveMedia/);
  assert.doesNotMatch(config, /rehypeRaw/);
  assert.match(config, /rehypePlugins:\s*\[rehypeSlug,\s*\[rehypeResponsiveMedia/);
  assert.match(postPage, /ResponsiveImage/);
  assert.match(postPage, /<ResponsiveImage[\s\S]*?src=\{data\.cover\.src\}/);
});
