// ===========================================================
// TradingView Advanced Chart (ES Module Safe)
// ===========================================================

let tvReadyPromise = null;

function loadTvCore() {
    if (window.TradingView) return Promise.resolve();

    if (tvReadyPromise) return tvReadyPromise;

    tvReadyPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;

        script.onload = () => {
            if (window.TradingView) resolve();
            else reject("TradingView failed to load");
        };

        script.onerror = () => reject("TradingView script error");

        document.head.appendChild(script);
    });

    return tvReadyPromise;
}

export async function loadTradingView(
    containerId = "tv-chart",
    symbol = "BTCUSDT"
) {
    const container = document.getElementById(containerId);
    if (!container) return;

    await loadTvCore();

    // Remove existing widget safely
    if (window.tvWidget) {
        window.tvWidget.remove();
        window.tvWidget = null;
    }

    window.tvWidget = new TradingView.widget({
        container_id: containerId,
        symbol,
        interval: "15",
        autosize: true,
        theme: "dark",
        timezone: "Etc/UTC",
        locale: "en",
        hide_side_toolbar: false,
    });
}
