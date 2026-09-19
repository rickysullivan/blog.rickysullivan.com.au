import { access, readFile } from "node:fs/promises";
import path from "node:path";

export const contactEmail = "ricky@rickysullivan.com.au";

export const requiredOutputPaths = [
  "index.html",
  "about/index.html",
  "contact/index.html",
  "post/welcome/index.html",
  "post/the-dennis-denuto-metric/index.html",
  "post/dont-become-vsf-because-you-scud-ran-vfr-into-imc/index.html",
  "rss.xml",
  "robots.txt",
  "sitemap-index.xml",
  "_redirects",
];

export async function assertBuiltSite(distRoot) {
  await Promise.all(
    requiredOutputPaths.map((outputPath) => access(path.join(distRoot, outputPath))),
  );

  const [home, contact, redirects] = await Promise.all([
    readFile(path.join(distRoot, "index.html"), "utf8"),
    readFile(path.join(distRoot, "contact/index.html"), "utf8"),
    readFile(path.join(distRoot, "_redirects"), "utf8"),
  ]);

  if (home.includes("Tell Him He's Dreamin'")) {
    throw new Error("Draft Ghost content appeared in the generated home page.");
  }

  if (!contact.includes(`mailto:${contactEmail}`)) {
    throw new Error("The generated contact page is missing the configured email address.");
  }

  for (const legacySlug of [
    "welcome",
    "the-dennis-denuto-metric",
    "dont-become-vsf-because-you-scud-ran-vfr-into-imc",
  ]) {
    if (!redirects.includes(`/${legacySlug} /post/${legacySlug}/ 301`)) {
      throw new Error(`Missing legacy redirect for /${legacySlug}.`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const distRoot = process.argv[2] ?? path.resolve("dist");
  await assertBuiltSite(distRoot);
  console.log(`Verified generated site at ${distRoot}`);
}
