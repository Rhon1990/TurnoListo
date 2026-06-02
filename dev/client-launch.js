(function () {
  const LAST_CLIENT_ORDER_STORAGE_KEY = "turnolisto-client-last-order";
  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
  const normalizeOrderId = (value) => String(value || "").trim().toUpperCase();
  const orderFromUrl = normalizeOrderId(hashParams.get("order") || params.get("order") || "");
  const storedOrder = normalizeOrderId(window.localStorage.getItem(LAST_CLIENT_ORDER_STORAGE_KEY) || "");
  const orderId = orderFromUrl || storedOrder || "TL-ANA2048Q2Z9";

  if (orderId) {
    window.localStorage.setItem(LAST_CLIENT_ORDER_STORAGE_KEY, orderId);
  }

  const targetUrl = new URL("./client.html", window.location.href);
  targetUrl.searchParams.set("order", orderId);
  window.location.replace(targetUrl.toString());
})();
