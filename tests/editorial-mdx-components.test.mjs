import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const componentDirectory = new URL("../src/components/mdx/", import.meta.url);

test("the editorial MDX components are available from the post renderer", () => {
  const postPage = readFileSync(new URL("../src/pages/post/[slug].astro", import.meta.url), "utf8");

  for (const component of ["Figure", "Disclosure", "PullQuote", "Diagram", "FurtherReading"]) {
    assert.equal(
      existsSync(new URL(`${component}.astro`, componentDirectory)),
      true,
      `${component}.astro exists`,
    );
    assert.match(postPage, new RegExp(`import ${component} from`));
    assert.match(postPage, new RegExp(`\\b${component}\\b`));
  }
});

test("the MDX showcase documents every editorial pattern", () => {
  const showcase = new URL(
    "../src/content/posts/editorial-components-showcase/index.mdx",
    import.meta.url,
  );

  assert.equal(existsSync(showcase), true);
  const source = readFileSync(showcase, "utf8");

  for (const component of ["Figure", "Disclosure", "PullQuote", "Diagram", "FurtherReading"]) {
    assert.match(source, new RegExp(`<${component}[\\s>]`));
  }
});
