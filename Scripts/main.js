

// import { loadTradingView } from "./tvwidget.js";

// document.addEventListener("DOMContentLoaded", () => {
//     const chart = document.getElementById("tv-chart");
//     if (!chart?.dataset.loaded) {
//         loadTradingView("tv-chart");
//         chart.dataset.loaded = "true";
//     }


import { loadTradingView } from './tvwidget.js';

window.addEventListener("DOMContentLoaded", () => {
    loadTradingView("tv-chart", {
        symbol: "DEXSCREENER:WKCUSDT",
        interval: "15",   // 15-min candles
        theme: "dark"
    });


    // TRENDING SWIPER INIT
    const swiper = new Swiper('.trending-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 2,
        loop: true,
        freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.8,
            sticky: false,
        },
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
            waitForTransition: true
        },
        speed: 4000
    });

    const MajorNetworkSwiper = new Swiper('.major-networks-list-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 4,
        loop: true,
        freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 1,
            sticky: false,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            waitForTransition: true
        },
        speed: 8000
    });


    const pumpitSwiper = new Swiper('.chart-promo-swiper', {
        slidesPerView: '1.2',
        spaceBetween: 4,
        loop: true,
        freeMode: {
            enabled: true,
            momentum: true,
            momentumRatio: 0.1,
            sticky: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            waitForTransition: true
        },
        speed: 500
    });


    // NFT VIEWER MODULE (keeps your existing UX)
    (function () {
        const nftTabBtn = document.getElementById('cft') || document.getElementById('nftTabBtn');
        const cryptoTabBtn = document.getElementById('active');
        const listedArea = document.querySelector('.listed-area');
        if (!listedArea || !cryptoTabBtn) return;

        const listedCards = Array.from(listedArea.querySelectorAll('.listed-card'));
        const moreListed = listedArea.querySelector('.more-listed');

        let nftCard = document.getElementById('nft');
        if (!nftCard) {
            nftCard = document.createElement('div');
            nftCard.id = 'nft';
            nftCard.className = 'nft-card';
            nftCard.innerHTML = '<img src="Images/nft.png" alt="NFT"><div class="nft-controls"><button type="button" class="nft-prev">Prev</button><div class="nft-counter"></div><button type="button" class="nft-next">Next</button></div>';
            if (moreListed) listedArea.insertBefore(nftCard, moreListed);
            else listedArea.appendChild(nftCard);
        }

        const nftImg = nftCard.querySelector('img');
        let controls = nftCard.querySelector('.nft-controls');
        if (!controls) {
            controls = document.createElement('div');
            controls.className = 'nft-controls';
            controls.innerHTML = '<button type="button" class="nft-prev">Prev</button><div class="nft-counter"></div><button type="button" class="nft-next">Next</button>';
            nftCard.appendChild(controls);
        }
        const prevBtn = controls.querySelector('.nft-prev');
        const nextBtn = controls.querySelector('.nft-next');
        const counter = controls.querySelector('.nft-counter');

        const nftImages = ['Images/kitten.jpg', 'Images/cat.jpg', 'Images/cheetah.jpg', 'Images/panther.jpg', 'Images/lion.jpg'];
        let currentIndex = 0;
        function showNftAt(i) {
            if (!nftImages.length) return;
            currentIndex = ((i % nftImages.length) + nftImages.length) % nftImages.length;
            if (nftImg) nftImg.src = nftImages[currentIndex];
            if (counter) counter.textContent = (currentIndex + 1) + ' / ' + nftImages.length;
        }
        function showNFTView() {
            listedCards.forEach(c => c.style.display = 'none');
            if (moreListed) moreListed.style.display = 'none';
            nftCard.style.display = 'flex';
            showNftAt(0);
        }
        function showCryptoView() {
            listedCards.forEach(c => c.style.display = '');
            if (moreListed) moreListed.style.display = '';
            nftCard.style.display = 'none';
        }

        if (nftTabBtn) nftTabBtn.addEventListener('click', showNFTView);
        if (cryptoTabBtn) cryptoTabBtn.addEventListener('click', showCryptoView);
        if (prevBtn) prevBtn.addEventListener('click', () => showNftAt(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => showNftAt(currentIndex + 1));
        document.addEventListener('keydown', (e) => {
            if (nftCard.style.display !== 'none') {
                if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
            }
        });
        nftCard.style.display = 'none';
    })();

    // ------- CONFIG -------
    const DEBUG = true;
    const POLL_INTERVAL_MS = 30000;

    // Debug helper
    function dlog(...args) { if (DEBUG) console.log(...args); }

    // ------- COIN API-ID MAPPING -------
    window.coinIdMap = {
        pi: 'pi-network',
        bitcoin: 'bitcoin',
        ethereum: 'ethereum',
        binancecoin: 'binancecoin',
        coredao: 'coredaoorg',
        rockycat: 'rockycat',
        snowman: 'snowman',
        ice: 'ice',
        onet: 'onet',
        dogs: 'dogs-2',
        dogecoin: 'dogecoin',
        tether: 'tether',
        wikicat: 'wiki-cat',
    };

    // Price formatting
    function formatPrice(value) {
        if (typeof value !== 'number' || !isFinite(value)) return '--';
        const abs = Math.abs(value);
        const decimals = abs < 1 ? 6 : (abs < 10 ? 4 : 2);
        return `$${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    }

    // Apply color based on change
    function applyColorClass(el, changePercent) {
        const THRESHOLD = 0.01;
        el.classList.remove('price-up', 'price-down', 'price-error', 'price-loading');
        const change = Number(changePercent);
        if (!isFinite(change)) { el.classList.add('price-error'); return; }
        if (change >= THRESHOLD) el.classList.add('price-up');
        else if (change <= -THRESHOLD) el.classList.add('price-down');
    }

    // previous prices store
    window.previousPrices = window.previousPrices || {};

    // Parse numeric volume like "1.2K"
    function parseNumberString(str) {
        if (!str || typeof str !== 'string') return NaN;
        const s = str.trim().replace(/,/g, '').toUpperCase();
        const match = s.match(/^(-?[\d.]+)\s*([KMBT])?$/);
        if (!match) return NaN;
        let value = parseFloat(match[1]);
        const suffix = match[2];
        if (!isFinite(value)) return NaN;
        if (suffix) {
            switch (suffix) {
                case 'K': value *= 1e3; break;
                case 'M': value *= 1e6; break;
                case 'B': value *= 1e9; break;
                case 'T': value *= 1e12; break;
            }
        }
        return value;
    }

    function parseCurrencyString(str) {
        if (!str || typeof str !== 'string') return NaN;
        const s = str.trim().replace(/\$/g, '').replace(/,/g, '').toUpperCase();
        const match = s.match(/^(-?[\d.]+)\s*([KMBT])?$/);
        if (!match) return NaN;
        let value = parseFloat(match[1]);
        const suffix = match[2];
        if (!isFinite(value)) return NaN;
        if (suffix) {
            switch (suffix) {
                case 'K': value *= 1e3; break;
                case 'M': value *= 1e6; break;
                case 'B': value *= 1e9; break;
                case 'T': value *= 1e12; break;
            }
        }
        return value;
    }

    function formatTotalCurrency(value) {
        if (typeof value !== 'number' || !isFinite(value)) return '--';
        return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    }

    function updateTotalHoldings() {
        const amountEls = Array.from(document.querySelectorAll('.coin-amount'));
        if (!amountEls.length) return;
        let total = 0;
        amountEls.forEach(el => {
            const txt = el.textContent.trim();
            const parsed = parseCurrencyString(txt.replace(/\s+/g, ''));
            if (!isNaN(parsed)) total += parsed;
        });
        const amountGroup = document.querySelector('.amount-group');
        if (!amountGroup) return;
        const amountNodes = Array.from(amountGroup.querySelectorAll('.amount'));
        const target = amountNodes[1] || amountNodes[0];
        if (target) target.textContent = formatTotalCurrency(total);
    }

    // Main update: fetch prices and update UI
    async function updateCryptoPrices() {
        try {
            const elems = Array.from(document.querySelectorAll('.coin-value, [data-coin]'));
            dlog('Price fetch elements:', elems.length);
            const ids = elems.map(el => {
                let key = (el.dataset && el.dataset.coin) ? el.dataset.coin.trim().toLowerCase() : '';
                if (!key) {
                    const ticker = el.querySelector && el.querySelector('.coin-ticker');
                    if (ticker) key = ticker.textContent.replace(/^\s*\$?/, '').trim().toLowerCase();
                }
                return (window.coinIdMap[key] || key || '').trim();
            }).filter(Boolean);
            const uniqueIds = [...new Set(ids)];
            if (!uniqueIds.length) return;

            const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(uniqueIds.join(','))}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`;
            dlog('Fetching', url);
            const res = await fetch(url);
            if (!res.ok) throw new Error('CoinGecko fetch failed: ' + res.status);
            const data = await res.json();
            const byId = {};
            (data || []).forEach(item => { if (item && item.id) byId[item.id] = item; });

            elems.forEach(el => {
                const uiKey = (el.dataset && el.dataset.coin) ? el.dataset.coin.trim().toLowerCase() : '';
                const apiId = (window.coinIdMap[uiKey] || uiKey).trim();
                const entry = byId[apiId];
                const target = el.classList.contains('coin-value') ? el : (el.querySelector && el.querySelector('.coin-value')) || el;

                target.classList.remove('price-up', 'price-down', 'price-error', 'price-loading');

                if (!entry || typeof entry.current_price === 'undefined') {
                    target.textContent = '--';
                    target.classList.add('price-error');
                    return;
                }
                const current = Number(entry.current_price);
                const apiChange = typeof entry.price_change_percentage_24h === 'number' ? Number(entry.price_change_percentage_24h) : null;

                target.textContent = formatPrice(current);
                if (apiChange !== null) applyColorClass(target, apiChange);
                else if (window.previousPrices[apiId]) {
                    const prev = Number(window.previousPrices[apiId]);
                    if (prev && isFinite(prev)) {
                        const pct = ((current - prev) / prev) * 100;
                        applyColorClass(target, pct);
                    } else {
                        target.classList.add('price-error');
                    }
                } else {
                    target.classList.add('price-error');
                }

                // update holding amount if present
                const container = target.closest('.listed-card') || target.closest('.trending-card') || target.closest('.popup-card') || target.parentElement;
                if (container) {
                    const volumeEl = container.querySelector('.coin-volume');
                    const amountEl = container.querySelector('.coin-amount');
                    if (amountEl) {
                        let volumeNum = NaN;
                        if (volumeEl) volumeNum = parseNumberString(volumeEl.textContent || '');
                        else {
                            const dataVol = target.dataset.volume || target.getAttribute('data-volume') || '';
                            volumeNum = parseNumberString(String(dataVol));
                        }
                        if (!isNaN(volumeNum) && isFinite(current)) {
                            const holdingUsd = volumeNum * current;
                            amountEl.textContent = formatTotalCurrency(holdingUsd);
                        }
                    }
                }

                window.previousPrices[apiId] = current;
            });

            updateTotalHoldings();
        } catch (err) {
            console.error('Price update error:', err);
            document.querySelectorAll('.coin-value, [data-coin]').forEach(el => {
                const target = el.classList.contains('coin-value') ? el : (el.querySelector && el.querySelector('.coin-value')) || el;
                if (target) {
                    target.textContent = '--';
                    target.classList.add('price-error');
                }
            });
        }
    }


    // TOGGLE EYE VISIBILITY MODULE
    const toggleEye = document.getElementById('toggle-eye');
    const totalAssets = document.getElementById('total-assets');
    let isCurrent = document.getElementById('total-assets').textContent;

    let isVisible = true;

    toggleEye.addEventListener('click', () => {
        if (isVisible) {
            totalAssets.textContent = "$******";
            toggleEye.classList.remove('fa-eye');
            toggleEye.classList.add('fa-eye-slash');
            isVisible = false;
        } else {
            toggleEye.classList.remove('fa-eye-slash');
            toggleEye.classList.add('fa-eye');
            document.getElementById('total-assets').textContent = isCurrent;
            isVisible = true;
        }
    });

    //POPUP NOTIFICATIONS AND ANIMATED PAGES START HERE:...👇
    const fromCoinTicker = document.getElementById('chosen-ticker-from');
    const toCoinTicker = document.getElementById('chosen-ticker-to');
    const fromCoinBtn = document.getElementById('swap-from-button');
    const toCoinBtn = document.getElementById('swap-to-button');
    const fromCoinAmount = document.getElementById('swap-from-amount');
    const toCoinAmount = document.getElementById('swap-to-amount');
    const popUp = document.getElementById('popup');
    const overlay = document.getElementById('swap-overlay');
    const popUpExitBtn = document.getElementById('popup-exit-btn');
    const searchToken = document.getElementById('search-token');

    //SWAPPING INITIALISATIONS:...👇
    const swapSwitchBtn = document.getElementById('swap-switch');
    const swapSwitchIcon = document.getElementById('swap-switch-icon');
    const swapFromLogo = document.getElementById('chosen-logo-from');
    const swapToLogo = document.getElementById('chosen-logo-to');
    const swapNetworkLogo = document.getElementById('swap-network-Logo');
    const swapBtn = document.getElementById('swap-btn');
    const errorMessage = document.getElementById('error-message');
    const circleInfo = document.getElementById('circle-info');

    //NOTIFICATIONS INITIALISATIONS:...👇
    const notificationPopup = document.getElementById('notification-popup');
    const notificationExitBtn = document.getElementById('notification-exit-btn');
    const notificationCancel = document.getElementById('notification-cancel');
    const notificationOk = document.getElementById('notification-ok');
    const maxBtn = document.getElementById('max-btn');
    const depositBox = document.getElementById('deposit-box');
    const depositBtn = document.getElementById('deposit-btn');
    const depositExitBtn = document.getElementById('deposit-exit-btn');

    //MAJOR NETWORKS INITIALISATIONS:...👇
    const majorNetworksBtn = document.getElementById('major-networks-btn');
    const majorNetworksList = document.getElementById('major-networks-list');
    const majorNetworkChosenLogo = document.getElementById('major-network-chosen-logo');
    const majorNetworkChosenName = document.getElementById('major-network-chosen-name');


    // SELECTING A NETWORK FROM THE DROPDOWN LIST:...👇
    const networkList = document.querySelectorAll('.major-networks-list-card');


    // MAJOR NEWORK PAGE ANIMATION:...👇
    majorNetworksBtn.addEventListener('click', () => {
        majorNetworksList.style.visibility = 'visible';
        majorNetworksList.style.top = '90px';
        majorNetworksList.style.opacity = '1';
    });

    // CHOSING NETWORK AND EXITING THE MAJOR NETWORKS MENU:...👇
    networkList.forEach(networkChoice => {
        networkChoice.addEventListener('click', () => {
            const ChosenNetworkLogo = networkChoice.querySelector('img');
            const chosenNetworkName = networkChoice.querySelector('span');
            if (ChosenNetworkLogo) majorNetworkChosenLogo.src = ChosenNetworkLogo.src;
            if (chosenNetworkName) majorNetworkChosenName.textContent = chosenNetworkName.textContent;
            majorNetworksList.style.top = '55px';
            majorNetworksList.style.opacity = '0';
            majorNetworksList.style.visibility = 'hidden';
        });
    });




    let currentSelection = null;
    // can be "from" or "to"

    // FROM button
    fromCoinBtn.addEventListener('click', () => {
        currentSelection = "from";
        openPopup();
    });

    // TO button
    toCoinBtn.addEventListener('click', () => {
        currentSelection = "to";
        openPopup();
    });

    // DEPOSIT BUTTON
    depositBtn.addEventListener('click', () => {
        currentSelection = "deposit";
        openPopup();
    });

    function openPopup() {
        document.body.classList.add("no-scroll");
        overlay.style.display = 'block';
        popUp.style.visibility = 'visible';
        popUp.style.marginTop = '20px';

        setTimeout(() => {
            popUp.style.bottom = '0%';
        }, 200);
    }


    // SELECTING A COIN FROM THE POPUP CARDS:...👇
    let popupCards = document.querySelectorAll('.popup-card');
    const chosenLogoFrom = document.getElementById('chosen-logo-from');
    const chosenTickerFrom = document.getElementById('chosen-ticker-from');
    const chosenLogoTo = document.getElementById('chosen-logo-to');
    const chosenTickerTo = document.getElementById('chosen-ticker-to');
    const depositLogo = document.getElementById('deposit-logo');
    const depositTicker = document.getElementById('deposit-ticker');



    // Add click listeners ONCE
    popupCards.forEach(card => {
        card.addEventListener('click', () => {

            const logoImg = card.querySelector('img');
            const tickerText = card.querySelector('span');

            if (currentSelection === "from") {
                if (logoImg) chosenLogoFrom.src = logoImg.src;
                if (tickerText) chosenTickerFrom.textContent = tickerText.textContent;
            }

            if (currentSelection === "to") {
                if (logoImg) chosenLogoTo.src = logoImg.src;
                if (tickerText) chosenTickerTo.textContent = tickerText.textContent;
            }

            if (currentSelection === "deposit") {
                const depositCard = card;
                const depoLogo = depositCard.querySelector('img');
                const depoTicker = depositCard.querySelector('span');
                if (depoLogo) depositLogo.src = depoLogo.src;
                if (depoTicker) depositTicker.textContent = depoTicker.textContent;
                openDepositPage();
            }

            closePopup();


        });
    });


    // DEPOSIT PAGE ANIMATION:...👇

    function openDepositPage() {
        depositBox.style.left = '0';
        depositBox.style.opacity = '1';
        depositBox.style.visibility = 'visible';
        overlay.style.display = 'block';
    }

    depositExitBtn.addEventListener('click', () => {
        depositBox.style.left = '-100%';
        depositBox.style.opacity = '0.5';
        overlay.style.display = 'none';
        depositBox.style.visibility = 'hidden';
    });



    //WALLET COPY BUTTON FUNCTIONALITY:...👇
    const copyBtn = document.getElementById("copy-wallet-btn");
    const walletAddress = document.getElementById("wallet-address");

    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(walletAddress.innerText);

            copyBtn.innerHTML = "Copied ✓";

            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy';
            }, 1500);

        } catch (err) {
            console.error("Copy failed:", err);
        }
    });






    //DRAG VARIABLES HERE:...👇
    let startY = 0;
    let currentY = 0;
    let dragging = false;
    const popupHeader = document.getElementById('popup-header');

    popupHeader.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        dragging = true;
        popUp.style.transition = 'none'; // Disable transition during drag
    });

    popupHeader.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        currentY = e.touches[0].clientY;
        let diffY = currentY - startY;
        if (diffY > 0) { // Only allow dragging downwards
            popUp.style.transform = `translateY(${diffY}px)`; // Move the popup with finger
        }
    });

    popupHeader.addEventListener('touchend', () => {
        dragging = false;
        popUp.style.transition = 'bottom 0.5s ease, transform 0.25s ease'; // Re-enable transition

        //if dragged down enough, close it
        if (currentY - startY > 350) {
            closePopup();
        } else {
            //Return to normal
            popUp.style.transform = 'translateY(0)';
        }
    });

    function closePopup() {
        popUp.style.bottom = '-100%';
        popUp.style.transform = 'translateY(0)';
        setTimeout(() => {
            popUp.style.visibility = 'hidden';
            overlay.style.display = 'none';
            document.body.classList.remove("no-scroll");
            searchToken.value = '';
        }, 300);
    }


    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
        popUp.style.visibility = 'hidden';
        popUp.style.bottom = '-100%';
        searchToken.value = '';

        //FOR CLOSING THE NOTIFICATION POPUP
        notificationPopup.style.top = "35%";
        notificationPopup.style.opacity = "0";
        notificationPopup.style.visibility = "hidden";
        notificationPopup.style.transform = "translate(-50%, -50%) scale(0.1)";
        document.body.classList.remove("no-scroll");

        //FOR CLOSING THE DEPODIT PAGE:....👇
        depositBox.style.left = '-100%';
        depositBox.style.opacity = '0.5';
        overlay.style.display = 'none';
        depositBox.style.visibility = 'hidden';
    });

    popUpExitBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        popUp.style.visibility = 'hidden';
        popUp.style.bottom = '-100%';
        searchToken.value = '';
        document.body.classList.remove("no-scroll");
    });




    // CHART.JS INITIALISATION:...👇
    const chartsContainer = document.getElementById('charts-container');
    const chartSelectedCard = document.getElementById('chart-selected-card');
    const chartCoinName = document.getElementById('Chart-coin-name');
    const chartCoinTicker = document.getElementById('chart-coin-ticker');
    const chartCoinPair = document.getElementById('Chart-coin-pair');
    const chartCoinLogo = document.getElementById('chart-coin-logo');
    const chartPair1Logo = document.getElementById('chart-pair1-logo');
    const chartCoinValue = document.getElementById('chart-coin-value');
    const chartCoinVolume = document.getElementById('chart-coin-volume');
    const chartCoinAmount = document.getElementById('chart-coin-amount');
    const chartCardCoinValue = document.getElementById('chart-card-coin-value');
    const chartPercentageChange = document.getElementById('chart-percentage-change');
    const chartCardPercentageChange = document.querySelector('.chart-card-percentage-change');
    const chartExitBtn = document.getElementById('chart-exit-btn');
    const footerTradeBtn = document.getElementById('footer-trade-btn');
    const listedCoinName = document.getElementById('listed-coin-name');
    let listedCards = document.querySelectorAll('.listed-card');

    // Ensure the chart percentage elements also have the base percentage-change class
    if (chartCardPercentageChange && !chartCardPercentageChange.classList.contains('percentage-change')) {
        chartCardPercentageChange.classList.add('percentage-change');
    }
    if (chartPercentageChange && !chartPercentageChange.classList.contains('percentage-change')) {
        chartPercentageChange.classList.add('percentage-change');
    }


    footerTradeBtn.addEventListener('click', () => {
        chartsContainer.style.display = 'block';
        document.body.classList.add('no-scroll');
    });

    chartExitBtn.addEventListener('click', () => {
        chartsContainer.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });


    function copyCoinValueToChart(card) {
        document.addEventListener("click", (e) => {
            const card = e.target.closest(".listed-card");
            if (!card) return;

            const source = card.querySelector(".coin-value");
            const target1 = document.getElementById("chart-card-coin-value");
            const target2 = document.getElementById("chart-coin-value");

            // copy the data-coin key
            target1.dataset.coin = source.dataset.coin;
            target2.dataset.coin = source.dataset.coin;

            // copy the displayed value too
            target1.textContent = source.textContent;
            target2.textContent = source.textContent;
        });
    }


    // TV-widget CHART FOR EACH COIN CANDLESTICKS CHART HERE:...👇
    // const tvSymbolMap = {
    //     BTC: "BINANCE:BTCUSDT",
    //     ETH: "BINANCE:ETHUSDT",
    //     WKC: "MEXC:WKCUSDT",     // example – adjust to real exchange
    //     RKC: "MEXC:RKCUSDT"      // example – adjust to real exchange
    // };


    listedCards.forEach(selectedCard => {
        selectedCard.addEventListener('click', () => {

            const coinName = selectedCard.querySelector('span');
            const coinValue = selectedCard.querySelector('.coin-value');
            const chartVolume = selectedCard.querySelector('.coin-volume');
            const chartAmount = selectedCard.querySelector('.coin-amount');
            const percentageChange = selectedCard.querySelector('.percentage-change');
            const coinLogoImg = selectedCard.querySelector('img');
            const coinTicker = selectedCard.querySelector('.coin-ticker');

            let listedTicker = coinTicker.textContent.replace(/\$/g, '').trim();



            /* =================  UPDATES CHART UI ================= */
            if (coinName) chartCoinName.textContent = coinName.textContent;
            if (coinValue) {
                // copy coin value and coin id to chart
                if (coinValue.dataset?.coin) {
                    chartCardCoinValue.dataset.coin = coinValue.dataset.coin;
                }
                chartCoinValue.textContent = coinValue.textContent;
                chartCardCoinValue.textContent = coinValue.textContent;
            }

            if (chartVolume) chartCoinVolume.textContent = chartVolume.textContent;
            if (chartAmount) chartCoinAmount.textContent = chartAmount.textContent;
            if (percentageChange) {
                const pctText = percentageChange.textContent;

                [chartCardPercentageChange, chartPercentageChange].forEach(el => {
                    if (!el) return;
                    el.textContent = pctText;
                    el.classList.remove('positive', 'negative');
                    el.classList.add('percentage-change');
                    if (percentageChange.classList.contains('positive')) el.classList.add('positive');
                    if (percentageChange.classList.contains('negative')) el.classList.add('negative');
                });
            }
            if (coinTicker) chartCoinTicker.textContent = coinTicker.textContent;
            if (listedTicker) chartCoinPair.textContent = `${listedTicker}/USDT`;
            if (coinLogoImg) {
                chartCoinLogo.src = coinLogoImg.src;
                chartPair1Logo.src = coinLogoImg.src;
            }

            updateCryptoPrices();
            copyCoinValueToChart();

            chartsContainer.style.display = 'block';
            document.body.classList.add('no-scroll');


            /* ================= ✅ TRADINGVIEW UPDATE ================= */
            // const tvSymbol = tvSymbolMap[listedTicker] || `BINANCE:${listedTicker}USDT`;
            // if (!tvSymbol) return;

            // // 2️⃣ Get TradingView widget
            // const widget = getTVWidget();
            // if (!widget) return;

            // // 3️⃣ Update chart
            // widget.onChartReady(() => {
            //     widget.activeChart().setSymbol(
            //         tvSymbol,
            //         widget.activeChart().resolution()
            //     );
            // });
        });
    });






    //Clicking the Inter-Switch button changes the Swapping icon order: (From and To).
    const swapALogo = swapFromLogo;
    const swapBLogo = swapToLogo;
    let srcA = swapALogo.getAttribute("src");
    let srcB = swapBLogo.getAttribute("src");

    //When user chooses a new token from first option to swap, update the logos accordingly
    function swapChoiceA(newSrc) {
        swapALogo.src = newSrc;
    }

    //When user chooses a new token from second option to swap, update the logos accordingly
    function swapChoiceB(newSrc) {
        swapBLogo.src = newSrc;
    }

    //Clicking the Inter-Switch button changes the Swapping order: (From and To).
    swapSwitchBtn.addEventListener('click', () => {
        let isDefault = false;
        if (!isDefault) {
            const temp = fromCoinTicker.textContent;
            fromCoinTicker.textContent = toCoinTicker.textContent;
            toCoinTicker.textContent = temp;
            isDefault = true;
        } else {
            const temp = fromCoinTicker.textContent;
            fromCoinTicker.textContent = toCoinTicker.textContent;
            toCoinTicker.textContent = temp;
            isDefault = false;
        }

        // SWITCHING THE LOGOS TOO:...👇
        const tempLogo = swapALogo.src;
        swapALogo.src = swapBLogo.src;
        swapBLogo.src = tempLogo;

    });



    //WSAPPING ERROR HERE....!
    swapBtn.addEventListener('click', () => {

        try {
            const rawValue = fromCoinAmount.value.trim();

            if (rawValue === "") {
                throw new Error("Enter amount...!");
            }

            const amount = Number(rawValue);
            if (isNaN(amount)) {
                throw new Error("invalid input!");
            }

            if (amount < 2) {
                throw new Error("Minimum Swap = $2");
            }

            errorMessage.style.display = "none";
            circleInfo.style.color = "#dadcdf";
            document.body.classList.add("no-scroll");
            notificationPopup.style.top = "50%";
            notificationPopup.style.opacity = "1";
            notificationPopup.style.visibility = "visible";
            notificationPopup.style.transform = "translate(-50%, -50%) scale(1)";
            overlay.style.display = "block";

        } catch (err) {
            errorMessage.style.display = "block";
            errorMessage.textContent = err.message;
            circleInfo.style.color = "#f83838";
        }

    });

    notificationExitBtn.addEventListener('click', () => {
        // fromCoinAmount.value = '';
        // toCoinAmount.textContent = '$0.0000';
        document.body.classList.remove("no-scroll");
        notificationPopup.style.top = "35%";
        notificationPopup.style.opacity = "0";
        notificationPopup.style.visibility = "hidden";
        notificationPopup.style.transform = "translate(-50%, -50%) scale(0.1)";
        overlay.style.display = "none";
    });

    notificationCancel.addEventListener('click', () => {
        // fromCoinAmount.value = '';
        // toCoinAmount.textContent = '$0.0000';
        document.body.classList.remove("no-scroll");
        notificationPopup.style.top = "35%";
        notificationPopup.style.opacity = "0";
        notificationPopup.style.visibility = "hidden";
        notificationPopup.style.transform = "translate(-50%, -50%) scale(0.1)";
        overlay.style.display = "none";
    });

    notificationOk.addEventListener('click', () => {
        const usdBalance = document.getElementById('')
        fromCoinAmount.value
    });


    // Percentage-change updater (uses markets result when available or fallback)
    (async function changeColumnUpdater() {
        async function updateChangeColumn() {
            try {
                const cards = Array.from(document.querySelectorAll('.listed-card, .trending-card'));
                if (!cards.length) return;
                const map = [];
                const ids = [];
                cards.forEach(card => {
                    const coinVal = card.querySelector('.coin-value');
                    let uiKey = coinVal?.dataset?.coin?.trim?.().toLowerCase() || '';
                    if (!uiKey) {
                        const ticker = card.querySelector('.coin-ticker');
                        if (ticker) uiKey = ticker.textContent.replace(/^\s*\$?/, '').trim().toLowerCase();
                    }
                    if (!uiKey) return;
                    const apiId = (window.coinIdMap && (window.coinIdMap[uiKey] || uiKey)) || uiKey;
                    if (!apiId) return;
                    ids.push(apiId);
                    map.push({ card, apiId });
                });
                const uniqueIds = [...new Set(ids)].filter(Boolean);
                if (!uniqueIds.length) return;

                const marketsUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(uniqueIds.join(','))}&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`;
                let dataArr = [];
                try {
                    const r = await fetch(marketsUrl);
                    if (r.ok) dataArr = await r.json();
                } catch (err) { console.warn('markets fetch failed', err); }

                const dataById = {};
                (Array.isArray(dataArr) ? dataArr : []).forEach(it => { if (it && it.id) dataById[it.id] = it; });

                function fallbackChange() {
                    return (Math.random() * 40 - 20); // -20% to +20% range for more realistic crypto volatility
                }

                function formatPercentage(value) {
                    const abs = Math.abs(value);
                    // For extreme changes (>1000%), show fewer decimals
                    const decimals = abs >= 1000 ? 0 : 2;
                    const sign = value >= 0 ? '+' : '';
                    return `${sign}${value.toFixed(decimals)}%`;
                }

                map.forEach(({ card, apiId }) => {
                    const pcEl = card.querySelector('.percentage-change');
                    if (!pcEl) return;
                    const entry = dataById[apiId];
                    let change = null;
                    let source = 'unknown';

                    if (entry && typeof entry.price_change_percentage_24h === 'number') {
                        change = Number(entry.price_change_percentage_24h);
                        source = 'api';
                    } else if (window.previousPrices && window.previousPrices[apiId]) {
                        const prev = window.previousPrices[apiId];
                        const curr = entry?.current_price;
                        if (prev && curr) {
                            change = ((curr - prev) / prev) * 100;
                            source = 'computed';
                        }
                    }

                    if (change === null) {
                        change = fallbackChange();
                        source = 'fallback';
                    }

                    // Log extreme changes to help debug
                    if (Math.abs(change) > 1000) {
                        console.warn(`Extreme change detected for ${apiId}: ${change.toFixed(2)}% (${source})`);
                    }

                    pcEl.textContent = formatPercentage(change);
                    pcEl.classList.remove('positive', 'negative');
                    pcEl.classList.add(change >= 0 ? 'positive' : 'negative');

                    // If this card corresponds to the coin currently shown in the chart, update chart percentage too
                    try {
                        const selectedCoin = (chartCardCoinValue && chartCardCoinValue.dataset && chartCardCoinValue.dataset.coin) ? chartCardCoinValue.dataset.coin.trim().toLowerCase() : '';
                        const cardCoinEl = card.querySelector('.coin-value');
                        const cardCoinKey = cardCoinEl?.dataset?.coin?.trim?.().toLowerCase() || '';
                        if (selectedCoin && cardCoinKey && selectedCoin === cardCoinKey) {
                            const pctText = formatPercentage(change);
                            if (chartCardPercentageChange) {
                                chartCardPercentageChange.textContent = pctText;
                                chartCardPercentageChange.classList.remove('positive', 'negative');
                                if (!chartCardPercentageChange.classList.contains('percentage-change')) chartCardPercentageChange.classList.add('percentage-change');
                                chartCardPercentageChange.classList.add(change >= 0 ? 'positive' : 'negative');
                            }
                            if (chartPercentageChange) {
                                chartPercentageChange.textContent = pctText;
                                chartPercentageChange.classList.remove('positive', 'negative');
                                if (!chartPercentageChange.classList.contains('percentage-change')) chartPercentageChange.classList.add('percentage-change');
                                chartPercentageChange.classList.add(change >= 0 ? 'positive' : 'negative');
                            }
                        }
                    } catch (err) { /* no-op */ }
                });

            } catch (err) {
                console.error('Update change column failed:', err);
            }
        }
        await updateChangeColumn();
        setInterval(updateChangeColumn, POLL_INTERVAL_MS);
    })();

    // Start price updates and schedule
    updateCryptoPrices();
    setInterval(updateCryptoPrices, POLL_INTERVAL_MS);



    // View More button
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function () {
            const hiddenCoins = document.querySelectorAll('.hidden-coin');

            // Toggle logic
            let isOpening = true;

            hiddenCoins.forEach(coin => {
                if (coin.classList.contains('visible')) {
                    isOpening = false;
                    coin.classList.remove('visible');
                    this.textContent = 'View More';
                } else {
                    coin.classList.add('visible');
                }
            });

            // Update button content + icon
            if (isOpening) {
                this.innerHTML = 'View Less <i class="fa fa-chevron-up"></i>';
            } else {
                this.innerHTML = 'View More <i class="fa fa-chevron-down"></i>';
            }

            updateCryptoPrices();
        });
    }

});

// End of script.js




