import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const workflowPath = new URL("../.github/workflows/preview-comment.yml", import.meta.url);

test("preview comment workflow keeps one Cloudflare preview link on each pull request", () => {
  assert.equal(existsSync(workflowPath), true, "preview comment workflow is missing");

  const workflow = readFileSync(workflowPath, "utf8");

  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /pull-requests: write/);
  assert.match(workflow, /<!-- cloudflare-preview -->/);
  assert.match(workflow, /github\.rest\.issues\.(createComment|updateComment)/);
});
