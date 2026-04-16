import {
  CdpPage,
  DEFAULT_DEBUG_BASE_URL,
  closeTarget,
  openTarget,
  sleep,
  waitForTarget,
} from "./cdp-client.mjs";
import { writeFile } from "node:fs/promises";

const DEBUG_BASE_URL = process.env.TURNOLISTO_DEBUG_BASE_URL || DEFAULT_DEBUG_BASE_URL;
const BASE_URL = process.env.TURNOLISTO_BASE_URL || "https://rhon1990.github.io/TurnoListo";
const REPORT_PATH = process.env.TURNOLISTO_RESPONSIVE_REPORT_PATH || "/tmp/turnolisto-responsive-audit.json";

const VIEWPORTS = [
  { key: "desktop", width: 1440, height: 1100, mobile: false },
  { key: "tablet", width: 834, height: 1112, mobile: true },
  { key: "mobile", width: 390, height: 844, mobile: true },
];

const PAGE_SPECS = [
  { key: "landing", url: `${BASE_URL}/index.html`, title: "Landing" },
  { key: "contact", url: `${BASE_URL}/contact.html`, title: "Contacto" },
  { key: "admin", urlFragment: "/TurnoListo/admin.html", title: "Admin actual" },
  { key: "restaurant", urlFragment: "/TurnoListo/restaurant.html", title: "Restaurante actual" },
  { key: "client", urlFragment: "/TurnoListo/client.html", title: "Cliente actual" },
];

const report = {
  startedAt: new Date().toISOString(),
  viewports: VIEWPORTS,
  pages: [],
};

function describePage(pageSpec, viewport, diagnostics) {
  const overflowLabel = diagnostics.pageHorizontalOverflowPx > 0
    ? `desborde ${diagnostics.pageHorizontalOverflowPx}px`
    : "sin desborde";
  const imageLabel = diagnostics.brokenImages.length
    ? `${diagnostics.brokenImages.length} imagen(es) con error`
    : "imagenes ok";
  console.log(`[responsive] ${pageSpec.title} · ${viewport.key}: ${overflowLabel} · ${imageLabel}`);
}

async function attachOrOpenPage(pageSpec) {
  if (pageSpec.urlFragment) {
    const target = await waitForTarget(pageSpec.urlFragment, {
      debugBaseUrl: DEBUG_BASE_URL,
      timeoutMs: 15000,
    });
    const page = new CdpPage(target, { debugBaseUrl: DEBUG_BASE_URL, label: pageSpec.title });
    await page.connect();
    return { page, transient: false, targetId: target.id };
  }

  const target = await openTarget(pageSpec.url, DEBUG_BASE_URL);
  const page = new CdpPage(target, { debugBaseUrl: DEBUG_BASE_URL, label: pageSpec.title });
  await page.connect();
  await page.waitForLoad(45000).catch(() => null);
  return { page, transient: true, targetId: target.id };
}

function buildDiagnosticsExpression() {
  return `
    (() => {
      const selectorFor = (element) => {
        if (!(element instanceof Element)) return "";
        if (element.id) return "#" + element.id;
        const className = String(element.className || "").trim().split(/\\s+/).filter(Boolean).slice(0, 2).join(".");
        const tag = String(element.tagName || "").toLowerCase();
        return className ? tag + "." + className : tag;
      };

      const isVisible = (element) => {
        if (!(element instanceof Element)) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity || 1) > 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      };

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const root = document.documentElement;
      const body = document.body;
      const pageHorizontalOverflowPx = Math.max(
        0,
        (root?.scrollWidth || 0) - viewportWidth,
        (body?.scrollWidth || 0) - viewportWidth,
      );

      const overflowingElements = Array.from(document.querySelectorAll("body *"))
        .filter(isVisible)
        .map((element) => {
          if (element.classList.contains("sr-only") || element.classList.contains("file-picker__input")) {
            return null;
          }

          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const localOverflowPx = Math.max(0, rect.right - viewportWidth, rect.left * -1);
          const contentOverflowPx = Math.max(
            0,
            (element.scrollWidth || 0) - (element.clientWidth || 0),
          );
          const isFormControl = ["INPUT", "SELECT", "TEXTAREA"].includes(String(element.tagName || "").toUpperCase());
          const shouldIgnoreScrollable = ["auto", "scroll"].includes(style.overflowX) && contentOverflowPx <= 48;
          const shouldIgnoreFormControl = isFormControl && localOverflowPx <= 160 && pageHorizontalOverflowPx === 0;
          if (shouldIgnoreScrollable) return null;
          if (shouldIgnoreFormControl) return null;
          if (localOverflowPx <= 2 && contentOverflowPx <= 32) return null;
          return {
            selector: selectorFor(element),
            text: String(element.innerText || element.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 120),
            localOverflowPx: Math.max(localOverflowPx, contentOverflowPx),
            width: Math.round(rect.width),
            right: Math.round(rect.right),
          };
        })
        .filter(Boolean)
        .sort((left, right) => right.localOverflowPx - left.localOverflowPx)
        .slice(0, 8);

      const brokenImages = Array.from(document.images || [])
        .filter((image) => {
          const source = String(image.currentSrc || image.src || "").trim();
          return isVisible(image) && source && (!image.complete || !image.naturalWidth);
        })
        .map((image) => ({
          src: image.currentSrc || image.src || "",
          alt: image.alt || "",
        }))
        .slice(0, 8);

      const visibleButtons = Array.from(document.querySelectorAll("button, a, input[type='submit'], input[type='button']"))
        .filter(isVisible)
        .map((element) => ({
          selector: selectorFor(element),
          label: String(element.innerText || element.value || element.getAttribute("aria-label") || "").trim().replace(/\\s+/g, " ").slice(0, 80),
        }))
        .slice(0, 18);

      const tallContentPx = Math.max(0, (root?.scrollHeight || 0) - viewportHeight);

      return {
        title: document.title,
        url: location.href,
        viewportWidth,
        viewportHeight,
        pageHorizontalOverflowPx,
        overflowingElements,
        brokenImages,
        visibleButtons,
        tallContentPx,
      };
    })()
  `;
}

async function auditPage(pageSpec) {
  const { page, transient, targetId } = await attachOrOpenPage(pageSpec);

  try {
    await page.bringToFront();
    await sleep(1000);

    const results = [];
    for (const viewport of VIEWPORTS) {
      await page.setViewport(viewport);
      await sleep(1400);
      const diagnostics = await page.evaluate(buildDiagnosticsExpression());
      describePage(pageSpec, viewport, diagnostics);
      results.push({
        viewport: viewport.key,
        ...diagnostics,
      });
    }

    await page.resetViewport();
    return {
      page: pageSpec.key,
      title: pageSpec.title,
      results,
    };
  } finally {
    try {
      await page.resetViewport();
    } catch {}
    await page.close().catch(() => null);
    if (transient && targetId) {
      await closeTarget(targetId, DEBUG_BASE_URL).catch(() => null);
    }
  }
}

async function main() {
  for (const pageSpec of PAGE_SPECS) {
    try {
      const pageReport = await auditPage(pageSpec);
      report.pages.push(pageReport);
    } catch (error) {
      report.pages.push({
        page: pageSpec.key,
        title: pageSpec.title,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`[responsive] ${pageSpec.title}:`, error);
    }
  }

  report.finishedAt = new Date().toISOString();
  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
