import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");

const sharedJs = readFileSync(path.join(projectRoot, "shared.js"), "utf8");

for (const file of ["admin.js", "restaurant.js", "client.js"]) {
  const pageJs = readFileSync(path.join(projectRoot, file), "utf8");

  assert.doesNotThrow(
    () => new vm.Script(`${sharedJs}\n${pageJs}`, { filename: file }),
    `La combinacion shared.js + ${file} no debe romper por colisiones globales entre scripts clasicos.`
  );
}

console.log("Runtime script collision check passed.");
