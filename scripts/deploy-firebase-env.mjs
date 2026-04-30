import { execFileSync } from "node:child_process";
import path from "node:path";
import {
  getFirebaseEnvironment,
  getHostingFirebaseConfigPath,
  loadFirebaseEnvironmentCatalog,
  projectRoot,
} from "./lib/firebase-env.mjs";
import { buildHostingEnvironment } from "./build-hosting-env.mjs";
import { renderFirebaseRuntime } from "./render-firebase-runtime.mjs";

const VALID_DEPLOY_SCOPES = new Set(["hosting", "backend", "all"]);

function runFirebaseCommand(args) {
  execFileSync("firebase", args, {
    cwd: projectRoot,
    stdio: "inherit",
  });
}

export async function deployFirebaseEnvironment(environmentName, scope = "all") {
  const normalizedScope = String(scope || "all").trim().toLowerCase();
  if (!VALID_DEPLOY_SCOPES.has(normalizedScope)) {
    throw new Error(`Invalid deploy scope: ${normalizedScope}. Use hosting, backend or all.`);
  }

  const catalog = await loadFirebaseEnvironmentCatalog();
  const environment = getFirebaseEnvironment(catalog, environmentName);

  if (normalizedScope === "hosting" || normalizedScope === "all") {
    await renderFirebaseRuntime();
    await buildHostingEnvironment(environmentName);
    runFirebaseCommand([
      "deploy",
      "--only",
      "hosting",
      "--project",
      environment.projectId,
      "--config",
      path.relative(projectRoot, getHostingFirebaseConfigPath(environmentName)),
    ]);
  }

  if (normalizedScope === "backend" || normalizedScope === "all") {
    runFirebaseCommand([
      "deploy",
      "--only",
      "firestore:rules,functions",
      "--project",
      environment.projectId,
    ]);
  }
}

const environmentName = String(process.argv[2] || "").trim();
const scope = String(process.argv[3] || "all").trim();

if (!environmentName) {
  console.error("Usage: node scripts/deploy-firebase-env.mjs <develop|production> [hosting|backend|all]");
  process.exit(1);
}

await deployFirebaseEnvironment(environmentName, scope);
