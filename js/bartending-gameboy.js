import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * VIZ-BARTENDING: Freestanding 3D Game Boy Shell Controller
 * Renders the 15-part Nintendo Game Boy 3D model framelessly inside the
 * Deployed Units grid (#bartending-showcase-unit) with the live DITHER-OS
 * Bartending game mapped 1:1 onto its recessed screen mesh.
 */

const MODEL_PATHS = {
    glb: 'assets/gameboy/game-boy.glb',
    bakedGameBoy: 'assets/gameboy/baked-game-boy.jpg',
    bakedCartridgePocket: 'assets/gameboy/baked-cartridge-pocket.jpg',
    bakedPowerIndicator: 'assets/gameboy/baked-power-indicator.jpg'
};

const REQUIRED_MESH_NAMES = [
    'power-button',
    'screen',
    'power-button-frame',
    'power-indicator',
    'body',
    'cartridge-pocket',
    'volume-control',
    'button-a',
    'button-b',
    'button-cross-down',
    'button-cross-left',
    'button-cross-right',
    'button-cross-up',
    'button-select',
    'button-start'
];

// Full unclipped model bounds in GLB local coordinates:
// X: [-1.187, 1.187] (span 2.374 -> padded 2.52)
// Y: [-1.923, 1.930] (span 3.853 -> padded [-1.96, 1.98], span 3.94)
// Z: [-0.464, 0.440] (front face Z = 0.44)
const FRAMING = {
    fov: 32,
    targetMinY: -1.96,
    targetMaxY: 1.98,
    spanX: 2.52,
    frontZ: 0.44
};

const PITCH_LIMIT = 0.58;
const YAW_SENSITIVITY = 0.0085;
const PITCH_SENSITIVITY = 0.0065;
const DAMPING = 0.14;
const DRAG_THRESHOLD_PX = 4;

/**
 * Solves an 8x8 linear system via Gaussian elimination with partial pivoting
 * and returns a CSS matrix3d(...) string mapping a rectangle [0..w] x [0..h]
 * to the 4 target points [{x,y}, {x,y}, {x,y}, {x,y}] (TL, TR, BR, BL).
 */
function computeHomographyMatrix3d(w, h, pts) {
    if (w <= 0 || h <= 0 || !pts || pts.length !== 4) {
        throw new Error(`Invalid homography input: w=${w}, h=${h}`);
    }

    const src = [
        { x: 0, y: 0 },
        { x: w, y: 0 },
        { x: w, y: h },
        { x: 0, y: h }
    ];

    const A = [];
    const b = [];

    for (let i = 0; i < 4; i++) {
        const sx = src[i].x;
        const sy = src[i].y;
        const dx = pts[i].x;
        const dy = pts[i].y;

        A.push([sx, sy, 1, 0, 0, 0, -sx * dx, -sy * dx]);
        b.push(dx);

        A.push([0, 0, 0, sx, sy, 1, -sx * dy, -sy * dy]);
        b.push(dy);
    }

    const n = 8;
    for (let col = 0; col < n; col++) {
        let pivotRow = col;
        let maxAbs = Math.abs(A[col][col]);
        for (let row = col + 1; row < n; row++) {
            const val = Math.abs(A[row][col]);
            if (val > maxAbs) {
                maxAbs = val;
                pivotRow = row;
            }
        }

        if (maxAbs < 1e-10) {
            return 'matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1)';
        }

        if (pivotRow !== col) {
            const tmpRow = A[col];
            A[col] = A[pivotRow];
            A[pivotRow] = tmpRow;

            const tmpB = b[col];
            b[col] = b[pivotRow];
            b[pivotRow] = tmpB;
        }

        const pivotVal = A[col][col];
        for (let j = col; j < n; j++) {
            A[col][j] /= pivotVal;
        }
        b[col] /= pivotVal;

        for (let row = 0; row < n; row++) {
            if (row === col) continue;
            const factor = A[row][col];
            if (Math.abs(factor) < 1e-12) continue;
            for (let j = col; j < n; j++) {
                A[row][j] -= factor * A[col][j];
            }
            b[row] -= factor * b[col];
        }
    }

    const [h11, h12, h13, h21, h22, h23, h31, h32] = b;

    // Column-major 4x4 matrix for CSS matrix3d
    const m = [
        h11, h21, 0, h31,
        h12, h22, 0, h32,
        0,   0,   1, 0,
        h13, h23, 0, 1
    ];

    return `matrix3d(${m.map((v) => Number(v.toFixed(7))).join(',')})`;
}

function loadTextureStrict(loader, url) {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (tex) => {
                tex.flipY = false;
                tex.colorSpace = THREE.SRGBColorSpace;
                resolve(tex);
            },
            undefined,
            (err) => {
                reject(new Error(`Failed to load required Game Boy texture: ${url} (${err?.message || err})`));
            }
        );
    });
}

function loadGLTFStrict(loader, url) {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltf) => resolve(gltf),
            undefined,
            (err) => {
                reject(new Error(`Failed to load required Game Boy 3D model: ${url} (${err?.message || err})`));
            }
        );
    });
}

async function initBartendingGameBoy() {
    const container = document.getElementById('bartending-showcase-unit');
    const canvas = document.getElementById('bartending-gb-canvas');
    const screenEl = document.getElementById('bartending-gb-screen');
    const screenShadowEl = document.getElementById('bartending-gb-screen-shadow');
    const iframeEl = document.getElementById('bartending-game-iframe');

    if (!container || !canvas || !screenEl || !screenShadowEl || !iframeEl) {
        throw new Error(
            'Fatal: Required DOM nodes for #bartending-showcase-unit 3D Game Boy showcase are missing.'
        );
    }

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FRAMING.fov, 1, 0.1, 100);
    scene.add(camera);

    const pivotGroup = new THREE.Group();
    scene.add(pivotGroup);

    const texLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();

    const [bakedGameBoy, bakedCartridgePocket, bakedPowerIndicator, gltf] = await Promise.all([
        loadTextureStrict(texLoader, MODEL_PATHS.bakedGameBoy),
        loadTextureStrict(texLoader, MODEL_PATHS.bakedCartridgePocket),
        loadTextureStrict(texLoader, MODEL_PATHS.bakedPowerIndicator),
        loadGLTFStrict(gltfLoader, MODEL_PATHS.glb)
    ]);

    const mainMaterial = new THREE.MeshBasicMaterial({ map: bakedGameBoy });
    const pocketMaterial = new THREE.MeshBasicMaterial({ map: bakedCartridgePocket });
    const screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x050505,
        transparent: true,
        opacity: 0
    });
    const powerMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uBakedTex: { value: bakedPowerIndicator },
            uPowerOn: { value: 1.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D uBakedTex;
            uniform float uPowerOn;
            varying vec2 vUv;
            void main() {
                vec3 baseColor = texture2D(uBakedTex, vUv).rgb;
                vec3 glowColor = vec3(1.0, 0.2, 0.2) * uPowerOn * 0.45;
                gl_FragColor = vec4(clamp(baseColor + glowColor, 0.0, 1.0), 1.0);
            }
        `
    });

    const meshesByName = new Map();
    const interactiveMeshes = [];

    gltf.scene.traverse((child) => {
        if (!child.isMesh) return;
        meshesByName.set(child.name, child);
        interactiveMeshes.push(child);

        if (child.name === 'screen') {
            child.material = screenMaterial;
        } else if (child.name === 'cartridge-pocket') {
            child.material = pocketMaterial;
        } else if (child.name === 'power-indicator') {
            child.material = powerMaterial;
        } else {
            child.material = mainMaterial;
        }
    });

    for (const reqName of REQUIRED_MESH_NAMES) {
        if (!meshesByName.has(reqName)) {
            throw new Error(`Fatal: Required mesh "${reqName}" missing from ${MODEL_PATHS.glb}`);
        }
    }

    pivotGroup.add(gltf.scene);
    pivotGroup.updateMatrixWorld(true);

    // Measure the screen mesh in neutral model coordinates
    const screenMesh = meshesByName.get('screen');
    const screenBox = new THREE.Box3().setFromObject(screenMesh);
    const localScreenCorners = [
        new THREE.Vector3(screenBox.min.x, screenBox.max.y, screenBox.max.z), // TL
        new THREE.Vector3(screenBox.max.x, screenBox.max.y, screenBox.max.z), // TR
        new THREE.Vector3(screenBox.max.x, screenBox.min.y, screenBox.max.z), // BR
        new THREE.Vector3(screenBox.min.x, screenBox.min.y, screenBox.max.z)  // BL
    ];
    const localScreenCenter = new THREE.Vector3(
        (screenBox.min.x + screenBox.max.x) * 0.5,
        (screenBox.min.y + screenBox.max.y) * 0.5,
        screenBox.max.z
    );

    // Store neutral transforms for the interactive hardware buttons
    const buttonNames = [
        'button-a',
        'button-b',
        'button-cross-up',
        'button-cross-down',
        'button-cross-left',
        'button-cross-right',
        'button-start',
        'button-select',
        'power-button',
        'volume-control'
    ];
    const buttonRestState = new Map();
    const buttonTargetOffset = new Map();

    for (const name of buttonNames) {
        const mesh = meshesByName.get(name);
        buttonRestState.set(name, {
            pos: mesh.position.clone(),
            rot: mesh.rotation.clone()
        });
        buttonTargetOffset.set(name, {
            dz: 0,
            dx: 0,
            rx: 0,
            ry: 0
        });
    }

    let baseScreenRect = { left: 0, top: 0, width: 1, height: 1 };
    let containerWidth = 0;
    let containerHeight = 0;

    function projectWorldPointToContainer(worldVec) {
        const projected = worldVec.clone().project(camera);
        return {
            x: (projected.x * 0.5 + 0.5) * containerWidth,
            y: (-projected.y * 0.5 + 0.5) * containerHeight
        };
    }

    function updateCameraAndBaseScreenRect() {
        const rect = container.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));

        containerWidth = width;
        containerHeight = height;

        renderer.setSize(width, height, false);
        camera.aspect = width / height;

        const spanY = FRAMING.targetMaxY - FRAMING.targetMinY;
        const centerY = (FRAMING.targetMaxY + FRAMING.targetMinY) * 0.5;
        const halfFovRad = THREE.MathUtils.degToRad(FRAMING.fov * 0.5);
        const tanHalfFov = Math.tan(halfFovRad);

        const distY = (spanY * 0.5) / tanHalfFov;
        const distX = (FRAMING.spanX * 0.5) / (tanHalfFov * camera.aspect);
        const dist = Math.max(distY, distX);

        camera.position.set(0, centerY, FRAMING.frontZ + dist);
        camera.lookAt(0, centerY, FRAMING.frontZ);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld(true);

        // Compute neutral screen rectangle with pivotGroup temporarily at (0, 0, 0)
        const savedRot = pivotGroup.rotation.clone();
        pivotGroup.rotation.set(0, 0, 0);
        pivotGroup.updateMatrixWorld(true);

        const tl = projectWorldPointToContainer(localScreenCorners[0].clone().applyMatrix4(pivotGroup.matrixWorld));
        const br = projectWorldPointToContainer(localScreenCorners[2].clone().applyMatrix4(pivotGroup.matrixWorld));

        baseScreenRect = {
            left: tl.x,
            top: tl.y,
            width: Math.max(1, br.x - tl.x),
            height: Math.max(1, br.y - tl.y)
        };

        screenEl.style.left = `${baseScreenRect.left.toFixed(3)}px`;
        screenEl.style.top = `${baseScreenRect.top.toFixed(3)}px`;
        screenEl.style.width = `${baseScreenRect.width.toFixed(3)}px`;
        screenEl.style.height = `${baseScreenRect.height.toFixed(3)}px`;

        pivotGroup.rotation.copy(savedRot);
        pivotGroup.updateMatrixWorld(true);
    }

    // Rotation & drag state
    let yawCurrent = 0;
    let pitchCurrent = 0;
    let yawTarget = 0;
    let pitchTarget = 0;

    let activePointerId = null;
    let pointerDownPos = { x: 0, y: 0 };
    let lastPointerPos = { x: 0, y: 0 };
    let isDragging = false;
    let activeButtonName = null;
    let powerSwitchToggled = false;

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();

    function raycastShell(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return [];
        pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointerNdc, camera);
        return raycaster.intersectObjects(interactiveMeshes, false);
    }

    function releaseButtons() {
        for (const [name, target] of buttonTargetOffset.entries()) {
            target.dz = 0;
            target.rx = 0;
            target.ry = 0;
            if (name !== 'power-button') {
                target.dx = 0;
            }
        }
        activeButtonName = null;
    }

    function pressButtonFromHit(hit) {
        const mesh = hit.object;
        const name = mesh.name;
        if (!buttonTargetOffset.has(name)) return false;

        activeButtonName = name;
        const target = buttonTargetOffset.get(name);

        if (name === 'button-a' || name === 'button-b') {
            target.dz = -0.055;
        } else if (name === 'button-start' || name === 'button-select') {
            target.dz = -0.035;
        } else if (name === 'power-button') {
            powerSwitchToggled = !powerSwitchToggled;
            target.dx = powerSwitchToggled ? -0.04 : 0;
        } else if (name === 'button-cross-up') {
            target.dz = -0.03;
            target.rx = -0.14;
        } else if (name === 'button-cross-down') {
            target.dz = -0.03;
            target.rx = 0.14;
        } else if (name === 'button-cross-left') {
            target.dz = -0.03;
            target.ry = -0.14;
        } else if (name === 'button-cross-right') {
            target.dz = -0.03;
            target.ry = 0.14;
        }
        return true;
    }

    function resetOrientation() {
        yawTarget = 0;
        pitchTarget = 0;
    }

    // Pointer interaction on the container / canvas
    container.addEventListener('pointerdown', (e) => {
        // Ignore if event originated inside the screen element when it's interactive
        if (e.target === iframeEl || screenEl.contains(e.target)) {
            return;
        }

        const hits = raycastShell(e.clientX, e.clientY);
        if (hits.length === 0) {
            // Outside the 3D Game Boy silhouette: allow normal page scroll / background behavior
            return;
        }

        activePointerId = e.pointerId;
        pointerDownPos = { x: e.clientX, y: e.clientY };
        lastPointerPos = { x: e.clientX, y: e.clientY };
        isDragging = false;

        const topHit = hits[0];
        pressButtonFromHit(topHit);

        if (canvas.setPointerCapture) {
            try {
                canvas.setPointerCapture(e.pointerId);
            } catch (_) {
                // Synthetic events in headless tests may not have an active hardware pointerId
            }
        }
    });

    window.addEventListener('pointermove', (e) => {
        if (activePointerId === null || e.pointerId !== activePointerId) return;

        const totalDx = e.clientX - pointerDownPos.x;
        const totalDy = e.clientY - pointerDownPos.y;

        if (!isDragging && Math.hypot(totalDx, totalDy) >= DRAG_THRESHOLD_PX) {
            isDragging = true;
            container.classList.add('is-dragging');
            screenEl.style.pointerEvents = 'none';
            if (activeButtonName && activeButtonName !== 'power-button') {
                releaseButtons();
            }
        }

        if (isDragging) {
            const dx = e.clientX - lastPointerPos.x;
            const dy = e.clientY - lastPointerPos.y;
            yawTarget += dx * YAW_SENSITIVITY;
            pitchTarget = THREE.MathUtils.clamp(
                pitchTarget + dy * PITCH_SENSITIVITY,
                -PITCH_LIMIT,
                PITCH_LIMIT
            );
            lastPointerPos = { x: e.clientX, y: e.clientY };
        }
    });

    function endPointerInteraction(e) {
        if (activePointerId === null || (e && e.pointerId !== undefined && e.pointerId !== activePointerId)) {
            return;
        }
        if (canvas.releasePointerCapture && activePointerId !== null) {
            try {
                canvas.releasePointerCapture(activePointerId);
            } catch (_) {
                // Ignore synthetic pointer release
            }
        }
        activePointerId = null;
        isDragging = false;
        container.classList.remove('is-dragging');
        releaseButtons();
    }

    window.addEventListener('pointerup', endPointerInteraction);
    window.addEventListener('pointercancel', endPointerInteraction);

    // Double-click on the 3D shell resets orientation to (0, 0, 0)
    container.addEventListener('dblclick', (e) => {
        if (e.target === iframeEl || screenEl.contains(e.target)) return;
        const hits = raycastShell(e.clientX, e.clientY);
        if (hits.length > 0) {
            resetOrientation();
        }
    });

    // Shake-to-reset support via custom event and DeviceMotion API
    window.addEventListener('gb-shake-reset', () => {
        resetOrientation();
    });

    let lastAccel = { x: null, y: null, z: null };
    window.addEventListener('devicemotion', (e) => {
        const acc = e.accelerationIncludingGravity || e.acceleration;
        if (!acc || acc.x === null || acc.y === null || acc.z === null) return;
        if (lastAccel.x !== null) {
            const delta =
                Math.abs(acc.x - lastAccel.x) +
                Math.abs(acc.y - lastAccel.y) +
                Math.abs(acc.z - lastAccel.z);
            if (delta > 18) {
                resetOrientation();
            }
        }
        lastAccel = { x: acc.x, y: acc.y, z: acc.z };
    });

    function updateScreenHomography() {
        pivotGroup.updateMatrixWorld(true);

        const worldCorners = localScreenCorners.map((pt) =>
            pt.clone().applyMatrix4(pivotGroup.matrixWorld)
        );
        const projectedPts = worldCorners.map((wPt) => {
            const p = projectWorldPointToContainer(wPt);
            return {
                x: p.x - baseScreenRect.left,
                y: p.y - baseScreenRect.top
            };
        });

        const matrix3d = computeHomographyMatrix3d(
            baseScreenRect.width,
            baseScreenRect.height,
            projectedPts
        );
        screenEl.style.transform = matrix3d;

        // Rear-face occlusion check
        const worldNormal = new THREE.Vector3(0, 0, 1)
            .applyQuaternion(pivotGroup.quaternion)
            .normalize();
        const worldCenter = localScreenCenter.clone().applyMatrix4(pivotGroup.matrixWorld);
        const toCam = camera.position.clone().sub(worldCenter).normalize();
        const facingDot = worldNormal.dot(toCam);

        if (facingDot <= 0.08) {
            screenEl.style.opacity = '0';
            screenEl.style.pointerEvents = 'none';
            iframeEl.style.pointerEvents = 'none';
        } else {
            const fade = THREE.MathUtils.clamp((facingDot - 0.08) / 0.14, 0, 1);
            screenEl.style.opacity = fade.toFixed(4);
            const isFrontInteractive =
                !isDragging && Math.abs(yawCurrent) <= 0.35 && Math.abs(pitchCurrent) <= 0.35;
            const pe = isFrontInteractive ? 'auto' : 'none';
            screenEl.style.pointerEvents = pe;
            iframeEl.style.pointerEvents = pe;
        }
    }

    function updateButtonAnimations() {
        for (const name of buttonNames) {
            const mesh = meshesByName.get(name);
            const rest = buttonRestState.get(name);
            const target = buttonTargetOffset.get(name);

            mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, rest.pos.x + target.dx, 0.25);
            mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, rest.pos.y, 0.25);
            mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, rest.pos.z + target.dz, 0.25);

            mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, rest.rot.x + target.rx, 0.25);
            mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, rest.rot.y + target.ry, 0.25);
        }
    }

    function tick() {
        yawCurrent += (yawTarget - yawCurrent) * DAMPING;
        pitchCurrent += (pitchTarget - pitchCurrent) * DAMPING;

        if (Math.abs(yawTarget - yawCurrent) < 1e-5) yawCurrent = yawTarget;
        if (Math.abs(pitchTarget - pitchCurrent) < 1e-5) pitchCurrent = pitchTarget;

        pivotGroup.rotation.y = yawCurrent;
        pivotGroup.rotation.x = pitchCurrent;

        updateButtonAnimations();
        updateScreenHomography();

        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    }

    updateCameraAndBaseScreenRect();
    updateScreenHomography();
    renderer.render(scene, camera);

    const resizeObserver = new ResizeObserver(() => {
        updateCameraAndBaseScreenRect();
        updateScreenHomography();
        renderer.render(scene, camera);
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', () => {
        updateCameraAndBaseScreenRect();
        updateScreenHomography();
        renderer.render(scene, camera);
    });

    // Expose deterministic diagnostic & control API on the container element
    container.__gbShowcase = {
        getRotation() {
            return {
                yaw: pivotGroup.rotation.y,
                pitch: pivotGroup.rotation.x,
                yawTarget,
                pitchTarget
            };
        },
        setRotation(yaw, pitch, immediate = false) {
            yawTarget = yaw;
            pitchTarget = THREE.MathUtils.clamp(pitch, -PITCH_LIMIT, PITCH_LIMIT);
            if (immediate) {
                yawCurrent = yawTarget;
                pitchCurrent = pitchTarget;
                pivotGroup.rotation.y = yawCurrent;
                pivotGroup.rotation.x = pitchCurrent;
                updateScreenHomography();
                renderer.render(scene, camera);
            }
        },
        resetOrientation(immediate = false) {
            resetOrientation();
            if (immediate) {
                yawCurrent = 0;
                pitchCurrent = 0;
                pivotGroup.rotation.set(0, 0, 0);
                updateScreenHomography();
                renderer.render(scene, camera);
            }
        },
        pressButton(name) {
            const resolvedName =
                name === 'button-power'
                    ? 'power-button'
                    : name === 'button-cross'
                    ? 'button-cross-up'
                    : name;
            const mesh = meshesByName.get(resolvedName);
            if (!mesh) {
                throw new Error(`Unknown Game Boy button mesh: ${name}`);
            }
            const box = new THREE.Box3().setFromObject(mesh);
            const center = box.getCenter(new THREE.Vector3());
            pressButtonFromHit({ object: mesh, point: center });
            updateButtonAnimations();
            renderer.render(scene, camera);
            return {
                name: resolvedName,
                targetOffset: { ...buttonTargetOffset.get(resolvedName) },
                position: mesh.position.clone(),
                rotation: { x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z }
            };
        },
        releaseButtons() {
            releaseButtons();
            updateButtonAnimations();
            renderer.render(scene, camera);
        },
        getMeshCenterClientPoint(name) {
            const resolvedName =
                name === 'button-power'
                    ? 'power-button'
                    : name === 'button-cross'
                    ? 'button-cross-up'
                    : name;
            const mesh = meshesByName.get(resolvedName);
            if (!mesh) {
                throw new Error(`Unknown Game Boy mesh: ${name}`);
            }
            pivotGroup.updateMatrixWorld(true);
            const box = new THREE.Box3().setFromObject(mesh);
            const center = box.getCenter(new THREE.Vector3());
            const localPt = projectWorldPointToContainer(center);
            const rect = canvas.getBoundingClientRect();
            return {
                clientX: rect.left + localPt.x,
                clientY: rect.top + localPt.y
            };
        },
        getBaseScreenRect() {
            return { ...baseScreenRect };
        },
        getMeshNames() {
            return Array.from(meshesByName.keys());
        }
    };

    container.dataset.gbReady = 'true';
    requestAnimationFrame(tick);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initBartendingGameBoy().catch((err) => {
            console.error(err);
            throw err;
        });
    });
} else {
    initBartendingGameBoy().catch((err) => {
        console.error(err);
        throw err;
    });
}
