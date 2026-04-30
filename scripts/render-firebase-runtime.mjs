import { writeFile } from "node:fs/promises";
import path from "node:path";
import {
  loadFirebaseEnvironmentCatalog,
  projectRoot,
  renderFirebaseConfigResolver,
  renderFirebaseMessagingServiceWorkerResolver,
} from "./lib/firebase-env.mjs";

export async function renderFirebaseRuntime() {
  const catalog = await loadFirebaseEnvironmentCatalog();

  await Promise.all([
    writeFile(path.join(projectRoot, "firebase-config.js"), renderFirebaseConfigResolver(catalog)),
    writeFile(
      path.join(projectRoot, "firebase-messaging-sw.js"),
      renderFirebaseMessagingServiceWorkerResolver(catalog),
    ),
  ]);
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isDirectExecution) {
  await renderFirebaseRuntime();
  console.log("Firebase runtime source files rendered.");
}
