// ===========================================================
// TradingView Advanced Chart (ES Module Safe)
// ===========================================================

// Shared promise → guarantees single script load
let tradingViewPromise = null;

/**
 * Load TradingView library ONCE
 * - Safe for ES modules
 * - Safe on refresh
 * - Safe on multiple calls
 */
function loadTradingViewScript() {
    // If TradingView already exists, resolve immediately
    if (window.TradingView) {
        return Promise.resolve();
    }

    // If loading is already in progress, reuse it
    if (tradingViewPromise) {
        return tradingViewPromise;
    }

    tradingViewPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;

        script.onload = () => resolve();
        script.onerror = () =>
            reject(new Error("TradingView script failed to load"));

        document.head.appendChild(script);
    });

    return tradingViewPromise;
}

/**
 * Default TradingView configuration
 * (Safe fallbacks + flexible overrides)
 */
const DEFAULT_CONFIG = {
    // ---- Core ----
    symbol: "NASDAQ:BTC",
    interval: "D",
    timezone: "Etc/UTC",
    autosize: true,
    theme: "dark",

    // ---- Style ----
    style: "1",
    backgroundColor: "#1e1e1eff",
    gridColor: "rgba(255,255,255,0.06)",

    // ---- UI ----
    hide_top_toolbar: false,
    hide_side_toolbar: true,
    hide_legend: false,
    allow_symbol_change: true,
    save_image: false,

    // ---- Extras ----
    locale: "en",
    studies_overrides: {},
    enabled_features: [],
    disabled_features: []
};

/**
 * Create a TradingView widget
 * - Does NOT reload the script
 * - Fully configurable
 * - ES-module friendly
 */
export async function loadTradingView(containerId = "tv-chart", options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`TradingView container "${containerId}" not found`);
        return null;
    }

    // Ensure TradingView is loaded first
    await loadTradingViewScript();

    // Merge defaults with user options
    const config = {
        container_id: containerId,
        ...DEFAULT_CONFIG,
        ...options
    };

    return new TradingView.widget(config);
}

