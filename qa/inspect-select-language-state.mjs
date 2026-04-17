import {
  CdpPage,
  closeTarget,
  openTarget,
  sleep,
} from "./cdp-client.mjs";

const BASE_URL = process.env.TURNOLISTO_BASE_URL || "http://127.0.0.1:4173";
const DEBUG_BASE_URL = process.env.TURNOLISTO_DEBUG_BASE_URL || "http://127.0.0.1:9222";
const LANGUAGE_SEQUENCE = ["en", "fr", "es"];

const PAGE_SPECS = [
  { key: "admin", url: `${BASE_URL}/admin.html?qa=select-language-state` },
  { key: "contact", url: `${BASE_URL}/contact.html?qa=select-language-state` },
  { key: "restaurant", url: `${BASE_URL}/restaurant.html?qa=select-language-state` },
];

async function openPage(url, label) {
  const target = await openTarget(url, DEBUG_BASE_URL);
  const page = new CdpPage(target, { debugBaseUrl: DEBUG_BASE_URL, label });
  await page.connect();
  await page.bringToFront();
  await page.waitForLoad(15000).catch(() => null);
  await sleep(1200);
  return { page, target };
}

async function closePage(page, target) {
  await page.close().catch(() => null);
  await closeTarget(target.id, DEBUG_BASE_URL).catch(() => null);
}

async function switchLanguage(page, language) {
  await page.evaluate(`
    (async () => {
      window.TurnoListoI18n?.setLanguage(${JSON.stringify(language)});
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return true;
    })()
  `);
  await sleep(350);
}

async function captureInitialState(page) {
  return page.evaluate(`
    (() => {
      const selects = Array.from(document.querySelectorAll("select"));
      return selects.map((select, index) => {
        const options = Array.from(select.options).map((option) => ({
          value: option.value,
          label: option.textContent.trim(),
        }));
        const fallbackValue = options.find((option) => option.value)?.value || "";
        const selectedValue = select.value || fallbackValue;
        if (selectedValue) {
          select.value = selectedValue;
          select.dispatchEvent(new Event("input", { bubbles: true }));
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        return {
          index,
          id: select.id || null,
          name: select.name || null,
          selectedValue,
          optionValues: options.map((option) => option.value),
          optionLabels: options.map((option) => option.label),
        };
      });
    })()
  `);
}

async function captureCurrentState(page) {
  return page.evaluate(`
    (() => Array.from(document.querySelectorAll("select")).map((select, index) => ({
      index,
      id: select.id || null,
      name: select.name || null,
      selectedValue: select.value,
      selectedIndex: select.selectedIndex,
      optionValues: Array.from(select.options).map((option) => option.value),
      optionLabels: Array.from(select.options).map((option) => option.textContent.trim()),
    })))()
  `);
}

function compareStates(pageKey, baseline, current, language) {
  const failures = [];
  const baselineList = Array.isArray(baseline) ? baseline : Object.values(baseline || {});
  const currentList = Array.isArray(current) ? current : Object.values(current || {});
  const byKey = new Map(currentList.map((item) => [item.id || `${item.name || "select"}:${item.index}`, item]));

  baselineList.forEach((item) => {
    const selectKey = item.id || `${item.name || "select"}:${item.index}`;
    const snapshot = byKey.get(selectKey);
    if (!snapshot) {
      failures.push(`${pageKey}:${selectKey}:${language}: select missing after language change`);
      return;
    }

    if (JSON.stringify(snapshot.optionValues) !== JSON.stringify(item.optionValues)) {
      failures.push(`${pageKey}:${selectKey}:${language}: option values changed`);
    }

    if (snapshot.selectedIndex < 0) {
      failures.push(`${pageKey}:${selectKey}:${language}: select lost its selection`);
    }

    if (item.selectedValue && snapshot.selectedValue !== item.selectedValue) {
      failures.push(`${pageKey}:${selectKey}:${language}: selected value changed from "${item.selectedValue}" to "${snapshot.selectedValue}"`);
    }
  });

  return failures;
}

const report = [];
const failures = [];

for (const pageSpec of PAGE_SPECS) {
  const { page, target } = await openPage(pageSpec.url, pageSpec.key);

  try {
    await page.waitFor(`Boolean(window.TurnoListoI18n && document.querySelector(".language-dock__select"))`, {
      timeoutMs: 15000,
      description: `${pageSpec.key} i18n ready`,
    });

    const baseline = await captureInitialState(page);
    const pageReport = {
      page: pageSpec.key,
      selectCount: baseline.length,
      languages: [],
    };

    for (const language of LANGUAGE_SEQUENCE) {
      await switchLanguage(page, language);
      const current = await captureCurrentState(page);
      const languageFailures = compareStates(pageSpec.key, baseline, current, language);
      failures.push(...languageFailures);
      pageReport.languages.push({
        language,
        failures: languageFailures,
        selects: (Array.isArray(current) ? current : Object.values(current || {})).map((item) => ({
          id: item.id,
          name: item.name,
          selectedValue: item.selectedValue,
          selectedIndex: item.selectedIndex,
        })),
      });
    }

    report.push(pageReport);
  } finally {
    await closePage(page, target);
  }
}

console.log(JSON.stringify({ report, failures }, null, 2));

if (failures.length) {
  process.exitCode = 1;
}
