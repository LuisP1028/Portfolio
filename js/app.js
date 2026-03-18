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

    // Use fluid 'em' units so the flag coordinates scale naturally
    const totalW = 60; // Represents 60em (acts as 600px at max scale)
    const totalH = 32; // Represents 32em (acts as 320px at max scale)
    const slices = 30;
    const sliceW = totalW / slices;
    container.innerHTML = '';

    for (let i = 0; i < slices; i++) {
        const div = document.createElement('div');
        div.className = 'flag-segment';
        div.style.width = `${sliceW}em`;
        div.style.backgroundSize = `
            1.8em 1.8em,
            25em 17.5em,
            ${totalW}em ${totalH}em
        `;
        const offset = -i * sliceW;
        div.style.backgroundPosition = `
            ${offset}em 0,
            ${offset}em 0,
            ${offset}em 0
        `;
        div.style.animationDelay = `${i * 0.08}s`;
        
        // Scale the wave amplitude mathematically down to match em units
        const amp = 0.4 + (i * 0.02);
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