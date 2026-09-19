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

const renderGhostCard = (source) => {
  const [titleSource, ...paragraphs] = source.trim().split(/\n\s*\n/);
  const title = titleSource.replaceAll("**", "").replace(/:$/, "").trim();

  return `<aside class="article-card article-card--small" aria-label="${escapeHtmlAttribute(title)}">
  <p class="article-card-title">${title}</p>
${paragraphs.map((paragraph) => `  <p>${paragraph.trim()}</p>`).join("\n")}
</aside>`;
};

const restoreMissingGhostEmbeds = (slug, body) => {
  if (slug !== "the-dennis-denuto-metric") return body;

  const quote = `> "It's the Constitution. It's Mabo. It's justice. It's law. It's the vibe and... ahh, no, that's it. It's the vibe."`;
  const courtroomScene = `<figure>
  <a href="https://www.youtube.com/watch?v=97IiPli_uXw" rel="noreferrer">
    <img src="/media/images/2026/02/the-castle.jpg" alt="Dennis Denuto arguing in court in The Castle" />
  </a>
  <figcaption><a href="https://www.youtube.com/watch?v=97IiPli_uXw" rel="noreferrer">Watch the “It’s the vibe” courtroom scene from <em>The Castle</em> on YouTube.</a></figcaption>
</figure>`;

  return body.replace(quote, `${quote}\n\n${courtroomScene}`);
};

const ddmPipeline = `**Spec** → **AI Implementation** → **Tests** → **Security** → **Code Review**

↓

**DDM Vibe Check**

↓

**Ship** (high confidence) / **Iterate** (misaligned)`;

const ddmFlowDiagram = `<figure class="flow-diagram" aria-labelledby="ddm-flow-title">
  <figcaption id="ddm-flow-title">The Dennis Denuto Metric decision flow</figcaption>
  <div class="flow-diagram-stages" aria-label="Delivery pipeline">
    <span class="flow-diagram-node">Spec</span><span class="flow-diagram-arrow" aria-hidden="true">→</span>
    <span class="flow-diagram-node">AI implementation</span><span class="flow-diagram-arrow" aria-hidden="true">→</span>
    <span class="flow-diagram-node">Tests</span><span class="flow-diagram-arrow" aria-hidden="true">→</span>
    <span class="flow-diagram-node">Security</span><span class="flow-diagram-arrow" aria-hidden="true">→</span>
    <span class="flow-diagram-node">Code review</span>
  </div>
  <div class="flow-diagram-connector" aria-hidden="true">↓</div>
  <div class="flow-diagram-checkpoint"><span>DDM</span> Vibe check</div>
  <div class="flow-diagram-connector" aria-hidden="true">↓</div>
  <div class="flow-diagram-outcomes">
    <span><strong>Ship</strong><small>high confidence</small></span>
    <i aria-hidden="true">or</i>
    <span><strong>Iterate</strong><small>misaligned</small></span>
  </div>
</figure>`;

export const rewriteBody = (markdown) =>
  markdown
    .replace(ddmPipeline, ddmFlowDiagram)
    .replace(/kg-card-begin: html\n([\s\S]*?)\nkg-card-end: html/g, (_, card) =>
      renderGhostCard(card),
    )
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

${restoreMissingGhostEmbeds(entry.slug, rewriteBody(entry.body))}`;
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
