import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const stylesCss = readFileSync(path.join(projectRoot, "styles.css"), "utf8");

assert.match(
  stylesCss,
  /#restaurantPlaybook\s+\.dashboard-subsection__top\s*\{[\s\S]*margin-bottom:\s*0\.75rem;/,
  "El encabezado del playbook debe reservar separacion inferior antes de la lista de pasos."
);

console.log("Restaurant playbook layout check passed.");
