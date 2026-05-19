var playerFront, playerBack;
var isFrontVisible = true;
var isAnimating = false;

function initSommaPlayers() {
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        setTimeout(initSommaPlayers, 200);
        return;
    }
    
    playerFront = new YT.Player('player-front', {
        height: '100%',
        width: '100%',
        videoId: 'i3wBk4f6JO0', 
        playerVars: { 'autoplay': 0, 'controls': 1, 'rel': 0, 'modestbranding': 1 },
        events: { 'onStateChange': (e) => handleHudState(e.data, 'front') }
    });

    playerBack = new YT.Player('player-back', {
        height: '100%',
        width: '100%',
        videoId: '1a9GwWK9HkQ', 
        playerVars: { 'autoplay': 0, 'controls': 1, 'rel': 0, 'modestbranding': 1 },
        events: { 'onStateChange': (e) => handleHudState(e.data, 'back') }
    });
}

function destroySommaPlayers() {
    if (playerFront && typeof playerFront.destroy === 'function') playerFront.destroy();
    if (playerBack && typeof playerBack.destroy === 'function') playerBack.destroy();
    playerFront = null;
    playerBack = null;
    isFrontVisible = true;
    isAnimating = false;
}

function handleHudState(playerState, side) {
    const hud = document.getElementById(`hud-${side}`);
    const btnText = document.getElementById(`text-${side}`);
    
    if (!hud || !btnText) return;

    if (playerState === YT.PlayerState.PLAYING) {
        hud.classList.add('playing');
        btnText.innerText = 'FULL HUD';
    } else if (playerState === YT.PlayerState.PAUSED || playerState === YT.PlayerState.ENDED) {
        hud.classList.remove('playing');
        btnText.innerText = 'WATCH FEED';
    }
}

function toggleHud(side, event) {
    if(event) { event.stopPropagation(); event.stopImmediatePropagation(); }
    
    const hud = document.getElementById(`hud-${side}`);
    const btnText = document.getElementById(`text-${side}`);
    const player = (side === 'front') ? playerFront : playerBack;

    if(!hud || !player) return;

    hud.classList.toggle('playing');

    if (!hud.classList.contains('playing')) {
        player.pauseVideo();
        btnText.innerText = 'WATCH FEED';
    } else {
        player.playVideo();
        btnText.innerText = 'FULL HUD';
    }
}

function flipCard(event) {
    if(event) { event.stopPropagation(); event.stopImmediatePropagation(); }
    if (isAnimating) return;
    isAnimating = true;

    const card = document.getElementById('somma-card');
    const faceFront = document.getElementById('face-front');
    const faceBack = document.getElementById('face-back');
    
    if(!card) return;

    card.classList.toggle('is-flipped');
    isFrontVisible = !isFrontVisible;

    setTimeout(() => {
        if(isFrontVisible) {
            faceFront.classList.add('active-side');
            faceBack.classList.remove('active-side');
            if (playerBack && typeof playerBack.pauseVideo === 'function') playerBack.pauseVideo();
        } else {
            faceBack.classList.add('active-side');
            faceFront.classList.remove('active-side');
            if (playerFront && typeof playerFront.pauseVideo === 'function') playerFront.pauseVideo();
        }
    }, 600);

    setTimeout(() => { isAnimating = false; }, 1200);
}