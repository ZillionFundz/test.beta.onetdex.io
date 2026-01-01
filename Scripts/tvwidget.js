// tvwidget.js

export function loadTradingView(containerId = "tv-chart", options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (window.__tv_loaded) return;
    window.__tv_loaded = true;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
        new TradingView.widget({
            container_id: containerId,

            // ---- CORE CONFIG ----
            symbol: options.symbol || "NASDAQ:AAPL",
            interval: options.interval || "D",
            timezone: options.timezone || "Etc/UTC",
            autosize: true,
            theme: options.theme || "dark",

            // ---- STYLE ----
            style: options.style || "1",
            backgroundColor: options.backgroundColor || "#3f3f44",
            gridColor: options.gridColor || "rgba(255,255,255,0.06)",

            // ---- UI CONTROLS ----
            hide_top_toolbar: options.hide_top_toolbar ?? false,
            hide_side_toolbar: options.hide_side_toolbar ?? false,
            hide_legend: options.hide_legend ?? false,
            allow_symbol_change: options.allow_symbol_change ?? true,
            save_image: options.save_image ?? false,

            // ---- OPTIONAL EXTRAS ----
            locale: options.locale || "en",
            studies_overrides: options.studies_overrides || {},
            disabled_features: options.disabled_features || [],
            enabled_features: options.enabled_features || []
        });
    };

    document.head.appendChild(script);
}
