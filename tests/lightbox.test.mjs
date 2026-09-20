import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import test from "node:test";

test("published posts expose images as an accessible PhotoSwipe gallery", () => {
  execFileSync("npm", ["run", "build"], { stdio: "pipe" });

  const post = readFileSync(
    "dist/post/dont-become-vsf-because-you-scud-ran-vfr-into-imc/index.html",
    "utf8",
  );

  const scripts = globSync("dist/_astro/*.js")
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

  assert.match(post, /data-photoswipe-gallery/);
  assert.match(scripts, /lightbox-image/);
  assert.match(scripts, /pswpModule/);
  assert.match(scripts, /pswpWidth/);
  assert.match(scripts, /pswp__caption/);
  assert.match(scripts, /figcaption/);
});
