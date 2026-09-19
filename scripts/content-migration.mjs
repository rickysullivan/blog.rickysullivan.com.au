import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const postOverrides = {
  welcome: {
    category: "Notes",
    excerpt: "A small first note from Ricky Sullivan Himself.",
    featured: false,
  },
  "the-dennis-denuto-metric": {
    category: "Software",
    excerpt: "Why AI-assisted software needs a gut check alongside the green checks.",
    featured: true,
  },
  "dont-become-vsf-because-you-scud-ran-vfr-into-imc": {
    category: "Software",
    excerpt: "Aviation has a useful warning for anyone letting an AI invent their requirements.",
    featured: true,
  },
};

const frontmatterExpression = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/;

const unquote = (value) => value.replace(/^"|"$/g, "").trim();

export const isIgnoredArtifact = (fileName) => fileName === ".DS_Store";

export const parseGhostEntry = (source) => {
  const match = source.match(frontmatterExpression);
  if (!match) throw new Error("Recovered Markdown is missing YAML frontmatter.");

  const data = Object.fromEntries(
    match[1]
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        return [line.slice(0, separator).trim(), unquote(line.slice(separator + 1).trim())];
      }),
  );

  return { ...data, body: match[2] };
};

export const selectPublished = (entries) =>
  entries.filter((entry) => entry.status === "published" && entry.slug !== "about");

const escapeHtmlAttribute = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

export const rewriteBody = (markdown) =>
  markdown
    .replace(
      /!\[([^\]]*)\]\(\.\.\/images\/([^)]+)\)([^\n]+)/g,
      (_, alt, imagePath, caption) =>
        `<figure>\n  <img src="/media/images/${imagePath}" alt="${escapeHtmlAttribute(alt)}" />\n  <figcaption>${caption.trim()}</figcaption>\n</figure>`,
    )
    .replaceAll("](../images/", "](/media/images/")
    .replaceAll("](../files/", "](/media/documents/")
    .replace(/__GHOST_URL__\/([^/)]+)\/?/g, "/post/$1/");

export const renderPost = (entry) => {
  const override = postOverrides[entry.slug];
  if (!override) throw new Error(`No migration override for ${entry.slug}.`);
  const cover = entry.feature_image?.startsWith("../images/")
    ? `cover:\n  src: ${JSON.stringify(entry.feature_image.replace("../images/", "/media/images/"))}\n  alt: ${JSON.stringify(`Feature image for ${entry.title}`)}\n`
    : "";

  return `---
title: ${JSON.stringify(entry.title)}
excerpt: ${JSON.stringify(override.excerpt)}
category: ${override.category}
date: ${entry.published_at}
updatedDate: ${entry.updated_at}
author:
  name: Ricky Sullivan
  role: Developer, dad, drongo
${cover}featured: ${override.featured}
draft: false
---

${rewriteBody(entry.body)}`;
};

export async function migrateGhostContent({ sourceRoot, projectRoot }) {
  const markdownRoot = path.join(sourceRoot, "markdown");
  const files = (await readdir(markdownRoot)).filter((file) => file.endsWith(".md"));
  const entries = await Promise.all(
    files.map(async (file) =>
      parseGhostEntry(await readFile(path.join(markdownRoot, file), "utf8")),
    ),
  );
  const postsRoot = path.join(projectRoot, "src/content/posts");

  await rm(postsRoot, { recursive: true, force: true });
  await mkdir(postsRoot, { recursive: true });

  for (const entry of selectPublished(entries)) {
    const destination = path.join(postsRoot, entry.slug, "index.md");
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, renderPost(entry));
  }

  const copyOptions = {
    recursive: true,
    filter: (source) => !isIgnoredArtifact(path.basename(source)),
  };
  await cp(
    path.join(sourceRoot, "images"),
    path.join(projectRoot, "public/media/images"),
    copyOptions,
  );
  await cp(
    path.join(sourceRoot, "files"),
    path.join(projectRoot, "public/media/documents"),
    copyOptions,
  );

  return selectPublished(entries).map((entry) => entry.slug);
}
