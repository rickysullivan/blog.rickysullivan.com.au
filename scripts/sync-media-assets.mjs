import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const derivativeWidths = [480, 800, 1200];
const processableExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const mediaConcurrency = 4;

const toPublicPath = (relativePath) => `/media/images/${relativePath.split(path.sep).join("/")}`;
const toResponsivePath = (relativePath, width, format) => {
  const parsed = path.parse(relativePath);
  return `/media/_responsive/${path
    .join(parsed.dir, `${parsed.name}-${parsed.ext.slice(1)}-${width}.${format}`)
    .split(path.sep)
    .join("/")}`;
};

async function imageFiles(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const relativePath = path.join(relativeDirectory, entry.name);
      if (entry.isDirectory()) return imageFiles(path.join(directory, entry.name), relativePath);
      return processableExtensions.has(path.extname(entry.name).toLowerCase())
        ? [relativePath]
        : [];
    }),
  );
  return files.flat().sort();
}

export async function mapWithConcurrency(values, concurrency, mapper) {
  const results = new Array(values.length);
  let nextIndex = 0;
  const worker = async () => {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(values[index], index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, worker));
  return results;
}

export async function syncMediaAssets({ sourceDir, outputDir, manifestPath }) {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  const entries = await mapWithConcurrency(
    await imageFiles(sourceDir),
    mediaConcurrency,
    async (relativePath) => {
      const sourcePath = path.join(sourceDir, relativePath);
      const metadata = await sharp(sourcePath).metadata();
      if (!metadata.width || !metadata.height) return null;

      if (path.extname(relativePath).toLowerCase() === ".gif") {
        return [
          toPublicPath(relativePath),
          { width: metadata.width, height: metadata.height, variants: null },
        ];
      }
      const widths = derivativeWidths.filter((width) => width <= metadata.width);
      if (widths.length === 0) widths.push(metadata.width);

      const variants = { avif: [], webp: [] };
      await Promise.all(
        widths.flatMap((width) =>
          ["avif", "webp"].map(async (format) => {
            const outputPath = path.join(
              outputDir,
              path.dirname(relativePath),
              `${path.parse(relativePath).name}-${path.parse(relativePath).ext.slice(1)}-${width}.${format}`,
            );
            await mkdir(path.dirname(outputPath), { recursive: true });
            await sharp(sourcePath)
              .resize({ width, withoutEnlargement: true })
              .toFormat(format, { quality: format === "avif" ? 50 : 75 })
              .toFile(outputPath);
            variants[format].push({ width, src: toResponsivePath(relativePath, width, format) });
          }),
        ),
      );
      variants.avif.sort((left, right) => left.width - right.width);
      variants.webp.sort((left, right) => left.width - right.width);

      return [
        toPublicPath(relativePath),
        { width: metadata.width, height: metadata.height, variants },
      ];
    },
  );
  const manifest = Object.fromEntries(entries.filter(Boolean));

  await mkdir(path.dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

const sourceSet = (variants) => variants.map(({ src, width }) => `${src} ${width}w`).join(", ");

function responsivePicture(image, descriptor) {
  const { src, alt = "", ...properties } = image.properties;
  return {
    type: "element",
    tagName: "picture",
    properties: {},
    children: [
      {
        type: "element",
        tagName: "source",
        properties: {
          type: "image/avif",
          srcSet: sourceSet(descriptor.variants.avif),
          sizes: "(min-width: 768px) 720px, 100vw",
        },
        children: [],
      },
      {
        type: "element",
        tagName: "source",
        properties: {
          type: "image/webp",
          srcSet: sourceSet(descriptor.variants.webp),
          sizes: "(min-width: 768px) 720px, 100vw",
        },
        children: [],
      },
      {
        type: "element",
        tagName: "img",
        properties: {
          ...properties,
          src,
          alt,
          width: descriptor.width,
          height: descriptor.height,
          loading: "lazy",
          decoding: "async",
        },
        children: [],
      },
    ],
  };
}

function fallbackImage(image, descriptor) {
  return {
    ...image,
    properties: {
      ...image.properties,
      width: descriptor.width,
      height: descriptor.height,
      loading: "lazy",
      decoding: "async",
    },
  };
}

function attributeValue(attributes, name) {
  return (
    new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`, "i").exec(attributes)?.[1] ??
    new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`, "i").exec(attributes)?.[2]
  );
}

function responsiveRawImage(raw, manifest) {
  return raw.replace(/<img\s+([^>]*?)\/?\s*>/gi, (image, attributes) => {
    const src = attributeValue(attributes, "src");
    const descriptor = manifest[src];
    if (!descriptor) return image;
    const sizedAttributes = `${attributes.replace(/\s(?:width|height|loading|decoding)=(?:"[^"]*"|'[^']*')/gi, "")} width="${descriptor.width}" height="${descriptor.height}" loading="lazy" decoding="async"`;
    if (!descriptor.variants) return `<img ${sizedAttributes}>`;
    return `<picture><source type="image/avif" srcset="${sourceSet(descriptor.variants.avif)}" sizes="(min-width: 768px) 720px, 100vw"><source type="image/webp" srcset="${sourceSet(descriptor.variants.webp)}" sizes="(min-width: 768px) 720px, 100vw"><img ${sizedAttributes}></picture>`;
  });
}

function visitChildren(node, manifest) {
  if (!node?.children) return;
  node.children = node.children.map((child) => {
    if (child.type === "raw") {
      return { ...child, value: responsiveRawImage(child.value, manifest) };
    }
    if (child.type === "element" && child.tagName === "img") {
      const descriptor = manifest[child.properties?.src];
      return descriptor
        ? descriptor.variants
          ? responsivePicture(child, descriptor)
          : fallbackImage(child, descriptor)
        : child;
    }
    visitChildren(child, manifest);
    return child;
  });
}

export function rehypeResponsiveMedia(manifest) {
  return (tree) => visitChildren(tree, manifest);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const projectRoot = process.cwd();
  await syncMediaAssets({
    sourceDir: path.join(projectRoot, "public/media/images"),
    outputDir: path.join(projectRoot, "public/media/_responsive"),
    manifestPath: path.join(projectRoot, "src/generated-media-manifest.json"),
  });
}
