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
        div.style.backgroundSize = `
            18px 18px,
            250px 175px,
            ${totalW}px ${totalH}px
        `;
        const offset = -i * sliceW;
        div.style.backgroundPosition = `
            ${offset}px 0,
            ${offset}px 0,
            ${offset}px 0
        `;
        div.style.animationDelay = `${i * 0.08}s`;
        const amp = 4 + (i * 0.2);
        div.style.setProperty('--amp', `${amp}px`);
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

document.addEventListener('DOMContentLoaded', buildFlag);

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