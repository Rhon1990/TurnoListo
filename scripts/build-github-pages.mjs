import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildHostingEnvironment } from "./build-hosting-env.mjs";
import { projectRoot } from "./lib/firebase-env.mjs";

const githubPagesDirectory = path.join(projectRoot, "dist", "github-pages");

function renderEnvironmentIndex() {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TurnoListo | Entornos</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f5f2ed;
        color: #1d1a16;
      }
      main {
        width: min(92vw, 520px);
      }
      h1 {
        margin: 0 0 0.5rem;
        font-size: 2rem;
      }
      p {
        margin: 0 0 1.25rem;
        color: #6e6258;
      }
      nav {
        display: grid;
        gap: 0.75rem;
      }
      a {
        display: block;
        padding: 1rem;
        border: 1px solid rgba(29, 26, 22, 0.14);
        border-radius: 8px;
        background: #fff;
        color: inherit;
        text-decoration: none;
        font-weight: 700;
      }
      span {
        display: block;
        margin-top: 0.2rem;
        color: #6e6258;
        font-size: 0.9rem;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>TurnoListo</h1>
      <p>Selecciona el entorno de GitHub Pages.</p>
      <nav aria-label="Entornos">
        <a href="./dev/admin.html#restaurants">Develop<span>Firebase turnolisto-f62c1</span></a>
        <a href="./prod/admin.html#restaurants">Producción<span>Firebase turnolisto-prod</span></a>
      </nav>
    </main>
  </body>
</html>
`;
}

async function copyEnvironment(environmentName, targetName) {
  const sourceDirectory = await buildHostingEnvironment(environmentName);
  const targetDirectory = path.join(githubPagesDirectory, targetName);
  await mkdir(targetDirectory, { recursive: true });
  await cp(sourceDirectory, targetDirectory, { recursive: true, force: true });
}

export async function buildGitHubPagesArtifact() {
  await rm(githubPagesDirectory, { recursive: true, force: true });
  await mkdir(githubPagesDirectory, { recursive: true });

  await copyEnvironment("develop", "dev");
  await copyEnvironment("production", "prod");
  await writeFile(path.join(githubPagesDirectory, "index.html"), renderEnvironmentIndex());

  return githubPagesDirectory;
}

const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isDirectExecution) {
  const targetDirectory = await buildGitHubPagesArtifact();
  console.log(`GitHub Pages artifact rendered at ${path.relative(projectRoot, targetDirectory)}.`);
}
