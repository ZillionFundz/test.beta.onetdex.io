// ===========================================================
// TradingView Advanced Chart (SINGLE CONTAINER): tvwidget.js
// ===========================================================

export function loadTradingView(containerId = "tv-chart", options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Ensure container has a real height (fixes mobile black screen)
    container.style.height = container.style.height || "250px";
    container.style.width = container.style.width || "100%";

    const initWidget = () => {
        // Wrap in requestAnimationFrame to ensure container layout is ready
        requestAnimationFrame(() => {
            const widget = new TradingView.widget({
                container_id: containerId,

                // ---- CORE CONFIG ----
                symbol: options.symbol || "NASDAQ:AAPL", // pass "BINANCE:WKCUSDT" for WKC
                interval: options.interval || "D",
                timezone: options.timezone || "Etc/UTC",
                autosize: true,
                theme: options.theme || "dark",
                locale: options.locale || "en",

                // ---- CHART TYPE ----
                style: options.style ?? 1, // candlesticks by default
                hide_top_toolbar: options.hide_top_toolbar ?? false,
                hide_side_toolbar: options.hide_side_toolbar ?? true,
                hide_legend: options.hide_legend ?? false,
                allow_symbol_change: options.allow_symbol_change ?? true,
                save_image: options.save_image ?? false,

                // ---- FEATURES ----
                disabled_features: options.disabled_features || [],
                enabled_features: options.enabled_features || [],

                // ---- VISUAL OVERRIDES ----
                overrides: {
                    "paneProperties.background": options.backgroundColor || "#1e1e1e",
                    "paneProperties.vertGridProperties.color": options.gridColor || "rgba(255,255,255,0.06)",
                    "paneProperties.horzGridProperties.color": options.gridColor || "rgba(255,255,255,0.06)",
                }
            });

            // Optional: auto-resize when window changes (mobile orientation)
            window.addEventListener("resize", () => widget.chart().resize());
        });
    };

    // If TradingView already loaded, init immediately
    if (window.TradingView) {
        initWidget();
        return;
    }

    // Avoid double-loading the script
    if (window.__tv_script_loaded) return;
    window.__tv_script_loaded = true;

    // Load TradingView script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = initWidget;

    document.head.appendChild(script);
}
