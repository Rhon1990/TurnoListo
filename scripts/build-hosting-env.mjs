import { cp, lstat, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  FRONTEND_BUILD_ENTRIES,
  getDistEnvironmentDirectory,
  loadFirebaseEnvironmentCatalog,
  projectRoot,
  renderFirebaseConfigForEnvironment,
  renderFirebaseMessagingServiceWorkerForEnvironment,
} from "./lib/firebase-env.mjs";

async function copyFrontendEntry(relativeEntryPath, targetDirectory) {
  const sourcePath = path.join(projectRoot, relativeEntryPath);
  const targetPath = path.join(targetDirectory, relativeEntryPath);
  const sourceStats = await lstat(sourcePath);

  await mkdir(path.dirname(targetPath), { recursive: true });
  if (sourceStats.isDirectory()) {
    await cp(sourcePath, targetPath, { recursive: true, force: true });
    return;
  }

  await cp(sourcePath, targetPath, { force: true });
}

export async function buildHostingEnvironment(environmentName) {
  const catalog = await loadFirebaseEnvironmentCatalog();
  const targetDirectory = getDistEnvironmentDirectory(environmentName);

  await rm(targetDirectory, { recursive: true, force: true });
  await mkdir(targetDirectory, { recursive: true });

  await Promise.all(FRONTEND_BUILD_ENTRIES.map((entry) => copyFrontendEntry(entry, targetDirectory)));

  await Promise.all([
    writeFile(
      path.join(targetDirectory, "firebase-config.js"),
      renderFirebaseConfigForEnvironment(catalog, environmentName),
    ),
    writeFile(
      path.join(targetDirectory, "firebase-messaging-sw.js"),
      renderFirebaseMessagingServiceWorkerForEnvironment(catalog, environmentName),
    ),
  ]);

  return targetDirectory;
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isDirectExecution) {
  const environmentName = String(process.argv[2] || "").trim();
  if (!environmentName) {
    console.error("Usage: node scripts/build-hosting-env.mjs <develop|production>");
    process.exit(1);
  }

  const targetDirectory = await buildHostingEnvironment(environmentName);
  console.log(`Hosting bundle for ${environmentName} rendered at ${path.relative(projectRoot, targetDirectory)}.`);
}
