async function loadChatWidget() {
    try {
        const response = await fetch('components/global/chat-widget.html');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const html = await response.text();
        const container = document.getElementById('chat-widget-container');
        
        if (container) {
            container.innerHTML = html;
            console.log("%c >> VILLAIN_OS WIDGET INJECTED ", "color: #ff3c00; font-weight: bold;");
            
            // Initialize the chat logic only AFTER the DOM elements exist
            if (typeof initializeChatLogic === 'function') {
                initializeChatLogic();
            } else {
                console.warn(">> WARN: initializeChatLogic() not found. Ensure chat-widget.js is loaded and wrapped correctly.");
            }
        } else {
            console.error(">> ERR: Target #chat-widget-container not found in DOM.");
        }
    } catch (error) {
        console.error('>> FAILED TO LOAD DOOM WIDGET:', error);
    }
}

function buildFlag() {
    const container = document.getElementById('flag-container');
    if (!container) return;

    // Use fluid 'em' units mapped to the container's dynamically scaling font-size
    const totalW = 60; // 60em total width
    const totalH = 32; // 32em total height
    const slices = 30; // Number of vertical segments for the wave
    const sliceW = totalW / slices;
    
    // Canton (the union/star box) proportions
    const cantonW = 25; 
    const cantonH = 17.5; 
    
    // Star field spacing
    const starSpacingX = 2.4;
    const starSpacingY = 2.4;

    container.innerHTML = '';

    for (let i = 0; i < slices; i++) {
        const div = document.createElement('div');
        div.className = 'flag-segment';
        div.style.width = `${sliceW}em`;
        
        // Define background layers natively in 'em' so they scale automatically
        // Layer 1: Stars | Layer 2: Canton Box | Layer 3: Stripes
        div.style.backgroundSize = `
            ${starSpacingX}em ${starSpacingY}em,
            ${cantonW}em ${cantonH}em,
            ${totalW}em ${totalH}em
        `;
        
        const offset = -i * sliceW;
        
        // Offset each slice to create a continuous background image
        div.style.backgroundPosition = `
            ${offset}em 0,
            ${offset}em 0,
            ${offset}em 0
        `;
        
        div.style.animationDelay = `${i * 0.08}s`;
        
        // Fluid wave amplitude: physically scales with the flag size
        // The wave gets slightly more exaggerated toward the trailing edge
        const amp = 0.4 + (i * 0.015);
        div.style.setProperty('--amp', `${amp}em`);
        
        container.appendChild(div);
    }
}

function enterMainSite() {
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

// Liquid Glass Header Logic
function initGlassHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('glass-active');
        } else {
            header.classList.remove('glass-active');
        }
    });
}

// Consolidate DOM initializations here
document.addEventListener('DOMContentLoaded', () => {
    buildFlag();
    loadChatWidget();
    initGlassHeader();
});

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    const clock = document.getElementById('clock');
    if(clock) clock.innerText = timeString + " UTC";
    
    if(Math.random() > 0.95) {
        const title = document.querySelector('h1');
        if(title) {
            title.style.textShadow = `${Math.random() * 5 - 2}px 0 var(--accent)`;
            setTimeout(() => {
                title.style.textShadow = "2px 2px 0px var(--text-dim)";
            }, 100);
        }
    }
}

setInterval(updateTime, 1000);
updateTime();

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
console.log("Welcome to the mainframe.");