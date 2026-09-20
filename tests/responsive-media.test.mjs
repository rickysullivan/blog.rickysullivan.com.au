import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import sharp from "sharp";

import {
  mapWithConcurrency,
  rehypeResponsiveMedia,
  syncMediaAssets,
} from "../scripts/sync-media-assets.mjs";

test("limits parallel derivative work while preserving file order", async () => {
  let active = 0;
  let peak = 0;
  const result = await mapWithConcurrency([1, 2, 3, 4], 2, async (value) => {
    active += 1;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active -= 1;
    return value * 2;
  });

  assert.deepEqual(result, [2, 4, 6, 8]);
  assert.equal(peak, 2);
});

test("creates responsive derivatives without changing the CMS source URL", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "blog-responsive-media-"));
  const sourceDir = path.join(root, "images");
  const outputDir = path.join(root, "responsive");
  const manifestPath = path.join(root, "manifest.json");
  const relativePath = "2026/05/flight-plan.png";
  const originalPath = path.join(sourceDir, relativePath);

  await mkdir(path.dirname(originalPath), { recursive: true });
  await sharp({
    create: { width: 1200, height: 800, channels: 3, background: "#123456" },
  })
    .png()
    .toFile(originalPath);

  const manifest = await syncMediaAssets({ sourceDir, outputDir, manifestPath });

  assert.equal(manifest["/media/images/2026/05/flight-plan.png"].width, 1200);
  assert.equal(manifest["/media/images/2026/05/flight-plan.png"].height, 800);
  await access(originalPath);
  await access(path.join(outputDir, "2026/05/flight-plan-png-480.avif"));
  await access(path.join(outputDir, "2026/05/flight-plan-png-800.webp"));
  assert.deepEqual(JSON.parse(await readFile(manifestPath, "utf8")), manifest);
});

test("turns local Markdown images into a responsive picture with the original fallback", async () => {
  const manifest = {
    "/media/images/2026/05/flight-plan.png": {
      width: 1200,
      height: 800,
      variants: {
        avif: [
          { width: 480, src: "/media/_responsive/2026/05/flight-plan-png-480.avif" },
          { width: 800, src: "/media/_responsive/2026/05/flight-plan-png-800.avif" },
        ],
        webp: [
          { width: 480, src: "/media/_responsive/2026/05/flight-plan-png-480.webp" },
          { width: 800, src: "/media/_responsive/2026/05/flight-plan-png-800.webp" },
        ],
      },
    },
  };
  const tree = {
    type: "root",
    children: [
      {
        type: "element",
        tagName: "img",
        properties: {
          src: "/media/images/2026/05/flight-plan.png",
          alt: "A completed flight plan",
        },
        children: [],
      },
      {
        type: "element",
        tagName: "img",
        properties: { src: "https://images.example/remote.png", alt: "Remote" },
        children: [],
      },
    ],
  };

  rehypeResponsiveMedia(manifest)(tree);

  const [picture, remoteImage] = tree.children;
  assert.equal(picture.tagName, "picture");
  assert.equal(picture.children[0].properties.type, "image/avif");
  assert.match(picture.children[0].properties.srcSet, /flight-plan-png-480\.avif 480w/);
  assert.equal(picture.children[2].tagName, "img");
  assert.equal(picture.children[2].properties.src, "/media/images/2026/05/flight-plan.png");
  assert.equal(picture.children[2].properties.width, 1200);
  assert.equal(picture.children[2].properties.height, 800);
  assert.equal(picture.children[2].properties.loading, "lazy");
  assert.equal(remoteImage.tagName, "img");
});
