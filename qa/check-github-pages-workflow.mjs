import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const projectRoot = path.resolve(new URL("..", import.meta.url).pathname);
const workflowPath = path.join(projectRoot, ".github", "workflows", "github-pages.yml");
assert.ok(existsSync(workflowPath), "GitHub Pages workflow must exist.");
const workflowSource = readFileSync(workflowPath, "utf8");

assert.match(
  workflowSource,
  /branches:\s*\[\s*main\s*\]/,
  "GitHub Pages must deploy only from main to avoid feature branch/source drift.",
);

assert.match(workflowSource, /workflow_dispatch:/, "GitHub Pages workflow must support manual reruns.");
assert.match(workflowSource, /contents:\s*read/, "GitHub Pages workflow must have read-only repository contents access.");
assert.match(workflowSource, /pages:\s*write/, "GitHub Pages workflow must be allowed to publish Pages.");
assert.match(workflowSource, /id-token:\s*write/, "GitHub Pages workflow must allow OIDC deployment auth.");
assert.match(
  workflowSource,
  /npm run build:hosting:production/,
  "GitHub Pages workflow must publish the production hosting bundle.",
);
assert.match(
  workflowSource,
  /actions\/upload-pages-artifact@v\d+[\s\S]*path:\s*dist\/production/,
  "GitHub Pages workflow must upload dist/production as the Pages artifact.",
);
assert.match(
  workflowSource,
  /actions\/deploy-pages@v\d+/,
  "GitHub Pages workflow must deploy the uploaded artifact.",
);

console.log("GitHub Pages workflow contract check passed.");
