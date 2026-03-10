/* ==========================================
 * COMPONENT LOADER (FETCH)
 * ========================================== */
async function loadComponents() {
    const elements = document.querySelectorAll('[data-include]');
    
    for (let el of elements) {
        const file = el.getAttribute('data-include');
        try {
            const response = await fetch(file);
            if (response.ok) {
                const html = await response.text();
                el.outerHTML = html; 
            } else {
                console.error(`Failed to load ${file}`);
            }
        } catch (error) {
            console.error(`Error fetching ${file}:`, error);
        }
    }
    
    // Recursive check: If the injected HTML contained MORE nested includes (like the cards inside the grid), run again.
    if (document.querySelectorAll('[data-include]').length > 0) {
        await loadComponents();
    } else {
        // All HTML is fully loaded and injected. Boot system.
        initCoreLogic();
    }
}

// Start loading sequence on DOM read
document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
});

/* ==========================================
 * CORE PORTFOLIO LOGIC
 * ========================================== */
function initCoreLogic() {
    
    // --- STARTUP SEQUENCE LOGIC ---
    function buildFlag() {
        const container = document.getElementById('flag-container');
        if (!container) return;

        const totalW = 600;
        const totalH = 320;
        const slices = 30;
        const sliceW = totalW / slices;
        container.innerHTML = '';

        for (let i = 0; i < slices; i++) {
            const div = document.createElement('div');
            div.className = 'flag-segment';
            div.style.width = `${sliceW}px`;
            div.style.backgroundSize = `18px 18px, 250px 175px, ${totalW}px ${totalH}px`;
            const offset = -i * sliceW;
            div.style.backgroundPosition = `${offset}px 0, ${offset}px 0, ${offset}px 0`;
            div.style.animationDelay = `${i * 0.08}s`;
            const amp = 4 + (i * 0.2);
            div.style.setProperty('--amp', `${amp}px`);
            container.appendChild(div);
        }
    }

    // Expose enterMainSite to global scope so HTML onclick can reach it
    window.enterMainSite = function() {
        const introLayer = document.getElementById('intro-layer');
        if (!introLayer) return;

        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        }

        introLayer.classList.add('fade-out');
        setTimeout(() => {
            introLayer.style.display = 'none';
            console.log(">> SYSTEM ACCESS GRANTED");
        }, 800);
    }

    buildFlag();

    // --- SYSTEM CLOCK ---
    function updateTime() {
        const clockEl = document.getElementById('clock');
        if(!clockEl) return;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
        });
        clockEl.innerText = timeString + " UTC";
        
        if(Math.random() > 0.95) {
            const title = document.querySelector('h1');
            if(title) {
                title.style.textShadow = `${Math.random() * 5 - 2}px 0 var(--accent)`;
                setTimeout(() => { title.style.textShadow = "2px 2px 0px var(--text-dim)"; }, 100);
            }
        }
    }
    setInterval(updateTime, 1000);
    updateTime();

    // --- SMOOTH SCROLLING ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log("%c SYSTEM READY ", "background: #000; color: #ff3c00; font-size: 20px; border: 2px solid #ff3c00; padding: 10px;");

    // --- SOMMA PLAYER SYSTEM ---
    window.playerFront = null; 
    window.playerBack = null;
    window.isFrontVisible = true;
    window.isAnimating = false;

    window.initSommaPlayers = function() {
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            setTimeout(window.initSommaPlayers, 200);
            return;
        }
        window.playerFront = new YT.Player('player-front', {
            height: '100%', width: '100%', videoId: 'i3wBk4f6JO0', 
            playerVars: { 'autoplay': 0, 'controls': 1, 'rel': 0, 'modestbranding': 1 },
            events: { 'onStateChange': (e) => window.handleHudState(e.data, 'front') }
        });
        window.playerBack = new YT.Player('player-back', {
            height: '100%', width: '100%', videoId: '1a9GwWK9HkQ', 
            playerVars: { 'autoplay': 0, 'controls': 1, 'rel': 0, 'modestbranding': 1 },
            events: { 'onStateChange': (e) => window.handleHudState(e.data, 'back') }
        });
    }

    window.destroySommaPlayers = function() {
        if (window.playerFront && typeof window.playerFront.destroy === 'function') window.playerFront.destroy();
        if (window.playerBack && typeof window.playerBack.destroy === 'function') window.playerBack.destroy();
        window.playerFront = null; window.playerBack = null;
        window.isFrontVisible = true; window.isAnimating = false;
    }

    window.handleHudState = function(playerState, side) {
        const hud = document.getElementById(`hud-${side}`);
        const btnText = document.getElementById(`text-${side}`);
        if (!hud || !btnText) return;
        if (playerState === YT.PlayerState.PLAYING) {
            hud.classList.add('playing'); btnText.innerText = 'FULL HUD';
        } else if (playerState === YT.PlayerState.PAUSED || playerState === YT.PlayerState.ENDED) {
            hud.classList.remove('playing'); btnText.innerText = 'WATCH FEED';
        }
    }

    window.toggleHud = function(side, event) {
        if(event) { event.stopPropagation(); event.stopImmediatePropagation(); }
        const hud = document.getElementById(`hud-${side}`);
        const btnText = document.getElementById(`text-${side}`);
        const player = (side === 'front') ? window.playerFront : window.playerBack;
        hud.classList.toggle('playing');
        if (!hud.classList.contains('playing')) {
            player.pauseVideo(); btnText.innerText = 'WATCH FEED';
        } else {
            player.playVideo(); btnText.innerText = 'FULL HUD';
        }
    }

    window.flipCard = function(event) {
        if(event) { event.stopPropagation(); event.stopImmediatePropagation(); }
        if (window.isAnimating) return;
        window.isAnimating = true;

        const card = document.getElementById('somma-card');
        const faceFront = document.getElementById('face-front');
        const faceBack = document.getElementById('face-back');
        
        card.classList.toggle('is-flipped');
        window.isFrontVisible = !window.isFrontVisible;

        setTimeout(() => {
            if(window.isFrontVisible) {
                faceFront.classList.add('active-side'); faceBack.classList.remove('active-side');
                if (window.playerBack && typeof window.playerBack.pauseVideo === 'function') window.playerBack.pauseVideo();
            } else {
                faceBack.classList.add('active-side'); faceFront.classList.remove('active-side');
                if (window.playerFront && typeof window.playerFront.pauseVideo === 'function') window.playerFront.pauseVideo();
            }
        }, 600);
        setTimeout(() => { window.isAnimating = false; }, 1200);
    }

    // --- MODAL SYSTEMS ---
    window.openTerminal = function(spaceUrl, useIframe = false) {
        const modal = document.getElementById('terminal-modal');
        const body = document.getElementById('terminal-body');
        body.innerHTML = '';
        if (useIframe) {
            const frame = document.createElement('iframe');
            frame.src = spaceUrl;
            frame.allow = 'clipboard-read; clipboard-write; microphone; camera; fullscreen; autoplay';
            body.appendChild(frame);
        } else {
            const app = document.createElement('gradio-app');
            app.setAttribute('src', spaceUrl);
            body.appendChild(app);
        }
        modal.classList.add('active');
    }

    window.openMediaModal = function() {
        const modal = document.getElementById('terminal-modal');
        const body = document.getElementById('terminal-body');

        // Dynamically grab the fetched templates instead of hardcoding the strings
        const sommaHTML = document.getElementById('template-somma-content').innerHTML;
        const galleryHTML = document.getElementById('template-gallery-content').innerHTML;

        const content = `
            <div class="media-showcase">
                <div class="video-section">
                    ${sommaHTML}
                    <div style="margin-top: 1rem; font-family: var(--font-mono); color: var(--text-dim); font-size: 0.8rem; border-left: 2px solid var(--accent); padding-left: 10px;">
                        >> VIDEO_FEED_ESTABLISHED<br>>> STREAM_QUALITY: 4K_UHD<br>>> LATENCY: 12ms
                    </div>
                    <div class="desc-box">
                        <div class="desc-corner tl"></div><div class="desc-corner tr"></div>
                        <div class="desc-corner bl"></div><div class="desc-corner br"></div>
                        <div class="desc-label">MISSION_BRIEF // 01</div>
                        <div class="desc-content">
                            <strong>Objective:</strong> Deploy scalable headless architecture for global retail operations.<br><br>
                            System integrates <strong>Next.js</strong> front-end logic with <strong>Go</strong> microservices for sub-millisecond transaction processing. Features include real-time inventory locking, high-frequency trading safeguards, and distributed CDN caching.
                        </div>
                        <div class="desc-line"></div>
                        <div class="desc-meta"><span>SEC_LEVEL: 4</span><span>[ ENCRYPTED ]</span></div>
                    </div>
                </div>
                ${galleryHTML}
            </div>
        `;
        body.innerHTML = content;
        modal.classList.add('active');
        window.initSommaPlayers();
    }

    window.openPDFModal = async function() {
        const modal = document.getElementById('terminal-modal');
        const body = document.getElementById('terminal-body');
        const headerText = modal.querySelector('.modal-header span');
        if(headerText) headerText.innerText = ">> DECRYPTING_FILE // SSM_WHITEPAPER.PDF";
        modal.classList.add('active');
        
        body.innerHTML = '';
        const container = document.createElement('div');
        container.id = 'pdf-viewer-container';
        
        const loader = document.createElement('div');
        loader.className = 'pdf-loading-text';
        loader.innerHTML = ">> DOWNLOADING DATA PACKETS... <br>>> PARSING BINARY...";
        container.appendChild(loader);
        body.appendChild(container);
        
        const url = 'SSMWhitePaper.pdf'; 
        
        try {
            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;
            loader.remove();
            
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const containerWidth = container.clientWidth || 800;
                const viewport = page.getViewport({ scale: 1.0 });
                const desiredWidth = containerWidth * 0.9;
                const scale = desiredWidth / viewport.width;
                const scaledViewport = page.getViewport({ scale: scale });
                
                const canvas = document.createElement('canvas');
                canvas.className = 'pdf-canvas';
                const context = canvas.getContext('2d');
                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;
                container.appendChild(canvas);
                
                await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
                canvas.classList.add('loaded'); 
            }
            
            const footer = document.createElement('div');
            footer.style.color = "var(--text-dim)";
            footer.style.fontFamily = "var(--font-pixel)";
            footer.style.marginTop = "20px";
            footer.innerText = `[ END OF DOCUMENT // ${pdf.numPages} PAGES RENDERED ]`;
            container.appendChild(footer);
        } catch (error) {
            console.error("PDF Load Error:", error);
            container.innerHTML = `
                <div style="color:var(--term-alert); padding:2rem; text-align:center;">
                    >> ERROR: DATA CORRUPTION DETECTED<br>
                    >> ${error.message}<br><br>
                    <a href="${url}" target="_blank" class="btn">[ MANUAL_DOWNLOAD ]</a>
                </div>
            `;
        }
    }

    window.closeTerminal = function() {
        const modal = document.getElementById('terminal-modal');
        modal.classList.remove('active');
        window.destroySommaPlayers();
        setTimeout(() => { document.getElementById('terminal-body').innerHTML = ''; }, 300);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") window.closeTerminal();
    });
}