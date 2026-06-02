import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

const currentFile = fileURLToPath(import.meta.url);
const qaDir = path.dirname(currentFile);
const projectRoot = path.resolve(qaDir, "..");
const sharedJs = readFileSync(path.join(projectRoot, "shared.js"), "utf8");

function extractFunction(name) {
  const start = sharedJs.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `shared.js debe definir ${name}.`);
  const bodyStart = sharedJs.indexOf("{", sharedJs.indexOf(")", start));
  assert.notEqual(bodyStart, -1, `No se pudo encontrar el cuerpo de ${name}.`);
  let depth = 0;
  let end = -1;

  for (let index = bodyStart; index < sharedJs.length; index += 1) {
    const char = sharedJs[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        end = index + 1;
        break;
      }
    }
  }

  assert.notEqual(end, -1, `No se pudo extraer ${name}.`);
  return sharedJs.slice(start, end);
}

const context = {
  result: null,
};

vm.runInNewContext(
  `
  const ORDER_STATUSES = ["received", "preparing", "ready", "delivered", "cancelled"];
  const statusMeta = {
    received: { label: "Recibido", color: "#ec7c0d", bg: "rgba(236, 124, 13, 0.12)" },
    preparing: { label: "En preparación", color: "#ec7c0d", bg: "rgba(236, 124, 13, 0.18)" },
    ready: { label: "Listo para recoger", color: "#1f7a63", bg: "rgba(31, 122, 99, 0.14)" },
    delivered: { label: "Entregado", color: "#0c5b75", bg: "rgba(12, 91, 117, 0.12)" },
    cancelled: { label: "Cancelado", color: "#7f1d1d", bg: "rgba(127, 29, 29, 0.12)" },
  };
  const now = new Date("2026-06-02T12:00:00.000Z");
  const orders = [
    {
      id: "today-ready",
      restaurantId: "rest-a",
      createdAt: "2026-06-02T10:00:00.000Z",
      archivedAt: null,
      status: "ready",
      estimatedReadyMinutes: 10,
      promisedReadyAt: "2026-06-02T12:10:00.000Z",
      lifecycleMilestones: { readyAt: "2026-06-02T10:08:00.000Z" },
      predictionTrainingRecord: { minutesToReady: 8 },
      statusDurations: { received: 2, preparing: 6 },
      aiRiskLevel: "low",
      aiEtaMinutes: 0,
      aiPressureScore: 1,
      aiPriorityScore: 1,
    },
    {
      id: "old-active",
      restaurantId: "rest-a",
      createdAt: "2026-05-20T10:00:00.000Z",
      archivedAt: null,
      status: "received",
      estimatedReadyMinutes: 10,
      promisedReadyAt: "2026-05-20T10:10:00.000Z",
      lifecycleMilestones: { readyAt: null },
      predictionTrainingRecord: null,
      statusDurations: {},
      aiRiskLevel: "high",
      aiEtaMinutes: 20,
      aiPressureScore: 9,
      aiPriorityScore: 99,
    },
  ];

  function getCurrentRestaurantSession() {
    return { restaurantId: "rest-a" };
  }
  function loadOrders() {
    return orders;
  }
  function enrichOrdersWithIntelligence(value) {
    return value;
  }
  function getOrderPromiseDelayMinutes(order) {
    if (!order.promisedReadyAt) return null;
    return Math.max(0, Math.floor((now.getTime() - new Date(order.promisedReadyAt).getTime()) / 60000));
  }
  function getOrderDurationMinutes(order) {
    return Math.max(0, Math.floor((now.getTime() - new Date(order.createdAt).getTime()) / 60000));
  }
  function isOrderResolvedWithinPromise(order) {
    return order.id === "today-ready";
  }
  function getStatusDurationMinutes(order, status) {
    return Number(order.statusDurations?.[status] || 0);
  }
  function getRemainingEstimatedMinutes() {
    return null;
  }
  function buildAdaptiveRestaurantModel() {
    return { confidenceLabel: "Aprendiendo", confidenceScore: 0, sampleCount: 1, meanAbsoluteError: null, deliveredSampleCount: 0 };
  }

  ${extractFunction("normalizeDashboardPeriod")}
  ${extractFunction("getDashboardPeriodMeta")}
  ${extractFunction("getDashboardPeriodStart")}
  ${extractFunction("isWithinDashboardPeriod")}
  ${extractFunction("filterOrdersByDashboardPeriod")}
  ${extractFunction("getUniqueOperationalTodayCount")}
  ${extractFunction("getDashboardStats")}

  result = getDashboardStats({ period: "day", referenceDate: now });
  `,
  context,
);

assert.equal(context.result.totalToday, 1, "El total diario debe contar solo pedidos creados hoy.");
assert.equal(context.result.activeNow, 1, "Los activos del dashboard diario no deben incluir pedidos abiertos de otros periodos.");
assert.equal(context.result.readyNow, 1, "Los listos para recoger deben respetar el periodo activo.");
assert.equal(context.result.delayedActive, 0, "El riesgo operativo diario no debe arrastrar retrasos de pedidos creados fuera del periodo.");
assert.equal(context.result.aiHighRiskCount, 0, "La prediccion IA debe calcularse con los activos del periodo activo.");
assert.equal(
  context.result.statusCounts.find((item) => item.status === "received").count,
  0,
  "El grafico de estados debe usar activos del periodo, no todos los abiertos historicos.",
);
assert.equal(
  context.result.throughputMix.find((item) => item.label === "Activos").count,
  1,
  "El mix de rendimiento debe mantener el mismo alcance temporal que el dashboard.",
);

console.log("Restaurant dashboard period contracts check passed.");
