function openTerminal(spaceUrl, useIframe = false) {
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

async function openMediaModal() {
    const modal = document.getElementById('terminal-modal');
    const body = document.getElementById('terminal-body');

    body.innerHTML = '<div style="color:var(--accent); font-family:var(--font-mono); padding: 2rem;">>> INITIATING SECURE CONNECTION...</div>';
    modal.classList.add('active');

    try {
        const [sommaRes, snapshotRes] = await Promise.all([
            fetch('components/templates/somma-modal-content.html'),
            fetch('components/templates/snapshot-cards.html')
        ]);
        
        if(!sommaRes.ok || !snapshotRes.ok) throw new Error("Fetch failed");

        const sommaHTML = await sommaRes.text();
        const snapshotCardsHTML = await snapshotRes.text();

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
                            <strong>Objective:</strong> DOMINATE FINANCIAL MARKETS<br><br>
                            In financial markets, you're up against the best traders in the world from <strong>day one</strong>  <strong>This is a good prototype</strong> but it needs funding.
                        </div>
                        <div class="desc-line"></div>
                        <div class="desc-meta"><span>SEC_LEVEL: 4</span><span>[ ENCRYPTED ]</span></div>
                    </div>
                </div>

                <div class="gallery-section">
                    <h4>>> SYSTEM_SNAPSHOTS</h4>
                    <div class="gallery-scroll">
                        ${snapshotCardsHTML}
                    </div>
                </div>
            </div>
        `;

        body.innerHTML = content;
        
        if (typeof initSommaPlayers === "function") {
            initSommaPlayers();
        }
    } catch (error) {
        console.error("Failed to load modal templates:", error);
        body.innerHTML = '<div style="color: var(--term-alert); padding: 20px; font-family: var(--font-mono);">>> ERROR: TEMPLATE FETCH FAILED. Ensure you are running a local server.</div>';
    }
}

async function openPDFModal() {
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
            
            const renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };
            
            await page.render(renderContext).promise;
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

function closeTerminal() {
    const modal = document.getElementById('terminal-modal');
    modal.classList.remove('active');
    
    if (typeof destroySommaPlayers === "function") {
        destroySommaPlayers();
    }
    
    setTimeout(() => {
        document.getElementById('terminal-body').innerHTML = '';
        const headerText = modal.querySelector('.modal-header span');
        if(headerText) headerText.innerText = ">> REMOTE_LINK_ESTABLISHED // TERMINAL_01";
    }, 300);
}

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeTerminal();
});