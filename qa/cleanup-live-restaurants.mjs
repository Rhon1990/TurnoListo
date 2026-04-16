import { CdpPage, waitForTarget, sleep } from "./cdp-client.mjs";

const ADMIN_EMAIL = process.env.TURNOLISTO_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.TURNOLISTO_ADMIN_PASSWORD || "";
const namePrefix = process.argv[2] || "QA Unicorn";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Missing TURNOLISTO_ADMIN_EMAIL or TURNOLISTO_ADMIN_PASSWORD.");
}

const adminTarget = await waitForTarget("/TurnoListo/admin.html", {
  debugBaseUrl: "http://127.0.0.1:9222",
  timeoutMs: 20000,
});

const page = await new CdpPage(adminTarget, {
  debugBaseUrl: "http://127.0.0.1:9222",
  label: "admin-cleanup",
}).connect();

const workspaceVisible = await page.evaluate(`Boolean(document.querySelector("#adminWorkspace") && !document.querySelector("#adminWorkspace").hidden)`);
if (!workspaceVisible) {
  await page.fill('#adminLoginForm [name="username"]', ADMIN_EMAIL);
  await page.fill("#adminLoginPassword", ADMIN_PASSWORD);
  await page.click('#adminLoginForm button[type="submit"]');
  await page.waitFor(`Boolean(document.querySelector("#adminWorkspace") && !document.querySelector("#adminWorkspace").hidden)`, {
    timeoutMs: 45000,
    description: "admin workspace visible",
  });
}

await page.click('button[data-admin-section="restaurants"]');
await sleep(1200);
await page.fill("#adminSearchInput", namePrefix);
await sleep(1200);

let deletedCount = 0;

while (true) {
  const hasCard = await page.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll(".admin-card"));
      return cards.some((card) => String(card.innerText || "").includes(${JSON.stringify(namePrefix)}));
    })()
  `);

  if (!hasCard) break;

  const opened = await page.evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll(".admin-card"));
      const card = cards.find((node) => String(node.innerText || "").includes(${JSON.stringify(namePrefix)}));
      if (!card) return false;
      const button = Array.from(card.querySelectorAll("button")).find((node) => (node.innerText || "").trim() === "Eliminar");
      if (!button) return false;
      button.click();
      return true;
    })()
  `);

  if (!opened) break;

  await page.waitFor(`Boolean(document.querySelector("#adminDeleteModal") && !document.querySelector("#adminDeleteModal").hidden)`, {
    timeoutMs: 15000,
    description: "delete modal visible",
  });
  await sleep(900);
  await page.click("#adminDeleteConfirm");
  await sleep(1800);
  deletedCount += 1;
}

console.log(JSON.stringify({ deletedCount, namePrefix }, null, 2));
await page.close();
