let tvReadyPromise;

function loadTvCore() {
  if (window.TradingView) return Promise.resolve();

  if (tvReadyPromise) return tvReadyPromise;

  tvReadyPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src*="tradingview.com/tv.js"]');
    if (existing) {
      waitForTradingView(resolve);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => waitForTradingView(resolve);
    document.head.appendChild(script);
  });

  return tvReadyPromise;
}

function waitForTradingView(resolve) {
  const check = () => {
    if (window.TradingView && window.TradingView.widget) {
      resolve();
    } else {
      requestAnimationFrame(check);
    }
  };
  check();
}

export async function loadTradingView(
  containerId = "tv-chart",
  symbol = "BTCUSDT"
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  await loadTvCore();

  if (window.tvWidget) {
    window.tvWidget.remove();
    window.tvWidget = null;
  }

  window.tvWidget = new window.TradingView.widget({
    container_id: containerId,
    symbol,
    interval: "15",
    autosize: true,
    theme: "dark",
    timezone: "Etc/UTC",
    locale: "en",
  });
}
