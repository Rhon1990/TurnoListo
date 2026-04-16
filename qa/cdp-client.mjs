const DEFAULT_DEBUG_BASE_URL = "http://127.0.0.1:9222";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`CDP request failed: ${response.status} ${response.statusText} (${url})`);
  }
  return response.json();
}

export async function listTargets(debugBaseUrl = DEFAULT_DEBUG_BASE_URL) {
  return readJson(`${debugBaseUrl}/json/list`);
}

export async function openTarget(url, debugBaseUrl = DEFAULT_DEBUG_BASE_URL) {
  return readJson(`${debugBaseUrl}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
}

export async function closeTarget(targetId, debugBaseUrl = DEFAULT_DEBUG_BASE_URL) {
  return readJson(`${debugBaseUrl}/json/close/${targetId}`);
}

export async function waitForTarget(urlFragment, options = {}) {
  const {
    debugBaseUrl = DEFAULT_DEBUG_BASE_URL,
    timeoutMs = 30000,
    pollMs = 300,
  } = options;
  const timeoutAt = Date.now() + timeoutMs;

  while (Date.now() < timeoutAt) {
    const targets = await listTargets(debugBaseUrl);
    const found = targets.find((target) => target.type === "page" && String(target.url || "").includes(urlFragment));
    if (found) return found;
    await sleep(pollMs);
  }

  throw new Error(`Timed out waiting for target containing "${urlFragment}"`);
}

export class CdpPage {
  constructor(target, options = {}) {
    this.target = target;
    this.debugBaseUrl = options.debugBaseUrl || DEFAULT_DEBUG_BASE_URL;
    this.label = options.label || String(target.title || target.url || "page");
    this.socket = null;
    this.nextCommandId = 0;
    this.pendingCommands = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    if (!this.target?.webSocketDebuggerUrl) {
      throw new Error(`Target "${this.label}" does not expose a webSocketDebuggerUrl.`);
    }

    this.socket = new WebSocket(this.target.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });

    this.socket.addEventListener("message", (event) => {
      const payload = JSON.parse(String(event.data || "{}"));
      if (payload.id && this.pendingCommands.has(payload.id)) {
        const handlers = this.pendingCommands.get(payload.id);
        this.pendingCommands.delete(payload.id);
        if (payload.error) {
          handlers.reject(new Error(payload.error.message || "Unknown CDP error"));
          return;
        }
        handlers.resolve(payload.result);
        return;
      }

      if (payload.method) {
        const handlers = this.eventListeners.get(payload.method) || [];
        handlers.forEach((handler) => handler(payload.params || {}));
      }
    });

    await this.send("Page.enable");
    await this.send("Runtime.enable");
    await this.send("DOM.enable");
    return this;
  }

  async close() {
    if (!this.socket) return;
    this.socket.close();
    this.socket = null;
  }

  on(method, handler) {
    const handlers = this.eventListeners.get(method) || [];
    handlers.push(handler);
    this.eventListeners.set(method, handlers);
  }

  async send(method, params = {}) {
    if (!this.socket) {
      throw new Error(`CDP socket for "${this.label}" is not connected.`);
    }

    const id = ++this.nextCommandId;
    const payload = { id, method, params };

    const response = new Promise((resolve, reject) => {
      this.pendingCommands.set(id, { resolve, reject });
    });

    this.socket.send(JSON.stringify(payload));
    return response;
  }

  async bringToFront() {
    await this.send("Page.bringToFront");
  }

  async setViewport(options = {}) {
    const width = Math.max(320, Math.round(Number(options.width || 1280)));
    const height = Math.max(480, Math.round(Number(options.height || 900)));
    const deviceScaleFactor = Number.isFinite(options.deviceScaleFactor)
      ? Number(options.deviceScaleFactor)
      : 1;
    const mobile = Boolean(options.mobile);

    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor,
      mobile,
      screenWidth: width,
      screenHeight: height,
      positionX: 0,
      positionY: 0,
      dontSetVisibleSize: false,
      screenOrientation: mobile
        ? { angle: 0, type: "portraitPrimary" }
        : { angle: 0, type: "landscapePrimary" },
    });
    await this.send("Emulation.setTouchEmulationEnabled", {
      enabled: mobile,
      maxTouchPoints: mobile ? 5 : 1,
    });
  }

  async resetViewport() {
    await this.send("Emulation.clearDeviceMetricsOverride");
    await this.send("Emulation.setTouchEmulationEnabled", {
      enabled: false,
      maxTouchPoints: 1,
    });
  }

  async waitForLoad(timeoutMs = 30000) {
    let resolved = false;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (resolved) return;
        resolved = true;
        reject(new Error(`Timed out waiting for load event on "${this.label}"`));
      }, timeoutMs);

      this.on("Page.loadEventFired", () => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timer);
        resolve();
      });
    });
  }

  async evaluate(expression, options = {}) {
    const { awaitPromise = true, returnByValue = true } = options;
    const result = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise,
      returnByValue,
    });

    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || `Evaluation failed on "${this.label}"`);
    }

    if (returnByValue) {
      return result.result?.value;
    }

    return result.result;
  }

  async waitFor(predicateExpression, options = {}) {
    const { timeoutMs = 30000, pollMs = 250, description = predicateExpression } = options;
    const timeoutAt = Date.now() + timeoutMs;

    while (Date.now() < timeoutAt) {
      const value = await this.evaluate(predicateExpression);
      if (value) return value;
      await sleep(pollMs);
    }

    throw new Error(`Timed out waiting for condition on "${this.label}": ${description}`);
  }

  async highlight(selector) {
    const selectorLiteral = JSON.stringify(selector);
    await this.evaluate(`
      (() => {
        const element = document.querySelector(${selectorLiteral});
        if (!element) return false;
        element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        const previousOutline = element.style.outline;
        const previousTransition = element.style.transition;
        element.style.transition = "outline 120ms ease";
        element.style.outline = "3px solid #ff7b00";
        window.setTimeout(() => {
          element.style.outline = previousOutline;
          element.style.transition = previousTransition;
        }, 900);
        return true;
      })();
    `);
  }

  async click(selector) {
    const selectorLiteral = JSON.stringify(selector);
    await this.highlight(selector);
    await sleep(350);
    const clicked = await this.evaluate(`
      (() => {
        const element = document.querySelector(${selectorLiteral});
        if (!element) return false;
        element.click();
        return true;
      })();
    `);

    if (!clicked) {
      throw new Error(`Could not click "${selector}" on "${this.label}"`);
    }
  }

  async fill(selector, value) {
    const selectorLiteral = JSON.stringify(selector);
    const valueLiteral = JSON.stringify(String(value));
    await this.highlight(selector);
    await sleep(350);
    const filled = await this.evaluate(`
      (() => {
        const element = document.querySelector(${selectorLiteral});
        if (!element) return false;
        element.focus();
        element.value = ${valueLiteral};
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      })();
    `);

    if (!filled) {
      throw new Error(`Could not fill "${selector}" on "${this.label}"`);
    }
  }

  async select(selector, value) {
    const selectorLiteral = JSON.stringify(selector);
    const valueLiteral = JSON.stringify(String(value));
    await this.highlight(selector);
    await sleep(350);
    const selected = await this.evaluate(`
      (() => {
        const element = document.querySelector(${selectorLiteral});
        if (!element) return false;
        element.value = ${valueLiteral};
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      })();
    `);

    if (!selected) {
      throw new Error(`Could not select "${value}" in "${selector}" on "${this.label}"`);
    }
  }
}

export { DEFAULT_DEBUG_BASE_URL, sleep };
