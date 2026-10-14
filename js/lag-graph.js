import * as THREE from 'three';

const container = document.getElementById('viz-lag-container');
const canvas = document.getElementById('lag-graph-canvas');

if (!container || !canvas) {
    throw new Error('Fatal Error: Required DOM nodes #viz-lag-container or #lag-graph-canvas missing for OBJ-200 3D Halftone Graph.');
}

let width = Math.max(container.clientWidth, 1);
let height = Math.max(container.clientHeight, 1);
let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance'
});
renderer.setPixelRatio(pixelRatio);
renderer.setSize(width, height, false);
renderer.setClearColor(0x050505, 1);

// 1. 3D Scene Setup for the 8-Hop (17-Node, 18-Edge) LAG Policy Graph
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050505);

const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
camera.position.set(0, 1.2, 11.5);
camera.lookAt(0, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xff3c00, 2.6);
keyLight.position.set(6, 8, 9);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0x0088ff, 2.0);
rimLight.position.set(-7, -5, 6);
scene.add(rimLight);

const graphGroup = new THREE.Group();
scene.add(graphGroup);

// 17 Nodes arranged across 8 Hops in 3D space (Legislative -> Administrative -> Adjudication)
const nodeDefinitions = [
    // Hop 0: Statutory Authority
    { id: 0, hop: 0, pos: [-4.6, 0.2, 0.0], role: 'root' },
    // Hop 1: Public Law / US Code
    { id: 1, hop: 1, pos: [-3.3, 1.35, 0.9], role: 'primary' },
    { id: 2, hop: 1, pos: [-3.3, -1.15, -0.8], role: 'secondary' },
    // Hop 2: Enabling Regulations (CFR)
    { id: 3, hop: 2, pos: [-2.0, 1.75, -0.7], role: 'primary' },
    { id: 4, hop: 2, pos: [-2.0, 0.0, 1.35], role: 'secondary' },
    { id: 5, hop: 2, pos: [-2.0, -1.65, 0.3], role: 'secondary' },
    // Hop 3: Federal Register Rules
    { id: 6, hop: 3, pos: [-0.7, 1.25, 1.1], role: 'primary' },
    { id: 7, hop: 3, pos: [-0.7, -0.95, -1.2], role: 'secondary' },
    // Hop 4: CMS Program Manuals
    { id: 8, hop: 4, pos: [0.6, 1.7, -0.9], role: 'secondary' },
    { id: 9, hop: 4, pos: [0.6, 0.1, 1.2], role: 'primary' },
    { id: 10, hop: 4, pos: [0.6, -1.6, 0.5], role: 'secondary' },
    // Hop 5: National Coverage Determinations (NCD)
    { id: 11, hop: 5, pos: [1.9, 1.15, 0.8], role: 'primary' },
    { id: 12, hop: 5, pos: [1.9, -1.1, -0.95], role: 'secondary' },
    // Hop 6: Local Coverage Determinations (LCD) & Articles
    { id: 13, hop: 6, pos: [3.2, 1.45, -0.6], role: 'primary' },
    { id: 14, hop: 6, pos: [3.2, -0.2, 1.15], role: 'secondary' },
    { id: 15, hop: 6, pos: [3.2, -1.55, -0.3], role: 'alert' },
    // Hop 7: Terminal Claim Policy Execution (8th Hop)
    { id: 16, hop: 7, pos: [4.55, 0.15, 0.0], role: 'alert' }
];

// 18 Directed Edges connecting the 17 nodes across the 8 hops
const edgePairs = [
    [0, 1], [0, 2],
    [1, 3], [1, 4], [2, 5],
    [3, 6], [4, 6], [5, 7],
    [6, 8], [6, 9], [7, 10],
    [8, 11], [9, 11], [10, 12],
    [11, 13], [11, 14], [12, 15],
    [13, 16], [14, 16], [15, 16]
].slice(0, 18);

const palette = {
    accent: new THREE.Color(0xff3c00),
    vector: new THREE.Color(0x0088ff),
    alert: new THREE.Color(0xff0033),
    neutral: new THREE.Color(0xe0e0e0)
};

const nodeMeshes = [];
const baseSphereGeo = new THREE.SphereGeometry(0.34, 24, 24);
const haloSphereGeo = new THREE.SphereGeometry(0.54, 16, 16);

for (let i = 0; i < nodeDefinitions.length; i++) {
    const def = nodeDefinitions[i];
    let baseColor = palette.vector;
    if (def.role === 'root' || def.role === 'primary') {
        baseColor = palette.accent;
    } else if (def.role === 'alert') {
        baseColor = palette.alert;
    }

    const mat = new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: baseColor.clone().multiplyScalar(0.45),
        roughness: 0.25,
        metalness: 0.3
    });

    const mesh = new THREE.Mesh(baseSphereGeo, mat);
    mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);

    const haloMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const halo = new THREE.Mesh(haloSphereGeo, haloMat);
    mesh.add(halo);

    graphGroup.add(mesh);
    nodeMeshes.push({
        def,
        mesh,
        mat,
        halo,
        haloMat,
        baseColor: baseColor.clone(),
        basePos: new THREE.Vector3(def.pos[0], def.pos[1], def.pos[2])
    });
}

// Create 3D Cylindrical Edges + Traveling Pulse Packets
const edgeObjects = [];
const pulseGeo = new THREE.SphereGeometry(0.16, 12, 12);

for (let i = 0; i < edgePairs.length; i++) {
    const [srcIdx, dstIdx] = edgePairs[i];
    const srcNode = nodeMeshes[srcIdx];
    const dstNode = nodeMeshes[dstIdx];

    const isPrimaryPath = (srcNode.def.role !== 'secondary' && dstNode.def.role !== 'secondary');
    const edgeColor = isPrimaryPath ? palette.accent : palette.vector;

    const edgeGeo = new THREE.CylinderGeometry(0.055, 0.055, 1, 8, 1);
    const edgeMat = new THREE.MeshBasicMaterial({
        color: edgeColor,
        transparent: true,
        opacity: isPrimaryPath ? 0.72 : 0.42
    });
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
    graphGroup.add(edgeMesh);

    const pulseMat = new THREE.MeshBasicMaterial({
        color: isPrimaryPath ? palette.neutral : palette.accent,
        transparent: true,
        opacity: 0.95
    });
    const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
    graphGroup.add(pulseMesh);

    edgeObjects.push({
        srcNode,
        dstNode,
        edgeMesh,
        edgeMat,
        pulseMesh,
        pulseMat,
        isPrimaryPath,
        hopIndex: srcNode.def.hop,
        phaseOffset: i * 0.17
    });
}

// Helper to orient cylinder between two 3D points
const upVec = new THREE.Vector3(0, 1, 0);
const dirVec = new THREE.Vector3();
const midVec = new THREE.Vector3();

function updateEdges(time, activeHopFloat) {
    for (let i = 0; i < edgeObjects.length; i++) {
        const edge = edgeObjects[i];
        const pA = edge.srcNode.mesh.position;
        const pB = edge.dstNode.mesh.position;

        dirVec.subVectors(pB, pA);
        const len = dirVec.length();
        midVec.addVectors(pA, pB).multiplyScalar(0.5);

        edge.edgeMesh.position.copy(midVec);
        edge.edgeMesh.scale.set(1, len, 1);
        edge.edgeMesh.quaternion.setFromUnitVectors(upVec, dirVec.clone().normalize());

        // Hop illumination wave
        const hopDist = Math.abs(edge.hopIndex - activeHopFloat);
        const hopBoost = Math.max(0, 1.0 - hopDist * 0.85);
        edge.edgeMat.opacity = (edge.isPrimaryPath ? 0.55 : 0.32) + hopBoost * 0.45;
        edge.edgeMesh.scale.x = 1 + hopBoost * 0.9;
        edge.edgeMesh.scale.z = 1 + hopBoost * 0.9;

        // Pulse traveling from source to target along the edge
        const t = (time * 0.95 + edge.phaseOffset) % 1.0;
        edge.pulseMesh.position.lerpVectors(pA, pB, t);
        const pulseScale = 0.75 + hopBoost * 0.95;
        edge.pulseMesh.scale.setScalar(pulseScale);
    }
}

// 2. Render Target & Custom GLSL Halftone Post-Processing Shader
let renderTarget = new THREE.WebGLRenderTarget(
    Math.floor(width * pixelRatio),
    Math.floor(height * pixelRatio),
    {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
    }
);

const postScene = new THREE.Scene();
const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const halftoneShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        tDiffuse: { value: renderTarget.texture },
        uResolution: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) },
        uPixelRatio: { value: pixelRatio },
        uTime: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
        }
    `,
    fragmentShader: `
        precision highp float;
        uniform sampler2D tDiffuse;
        uniform vec2 uResolution;
        uniform float uPixelRatio;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
            vec2 texel = 1.0 / uResolution;

            // Sample center + neighborhood for smooth 3D volumetric luminance halo
            vec4 colCenter = texture2D(tDiffuse, vUv);
            vec3 glow = colCenter.rgb * 0.4;
            glow += texture2D(tDiffuse, vUv + vec2(2.5, 0.0) * texel).rgb * 0.15;
            glow += texture2D(tDiffuse, vUv - vec2(2.5, 0.0) * texel).rgb * 0.15;
            glow += texture2D(tDiffuse, vUv + vec2(0.0, 2.5) * texel).rgb * 0.15;
            glow += texture2D(tDiffuse, vUv - vec2(0.0, 2.5) * texel).rgb * 0.15;

            // Perceived intensity of the 3D graph & halo at this pixel
            float intensity = max(max(glow.r, glow.g), glow.b);
            float luma = dot(glow, vec3(0.35, 0.45, 0.20));
            float energy = mix(luma, intensity, 0.65);

            // 45-degree rotated halftone dot-matrix screen coordinates
            float cellSpacing = 5.0 * uPixelRatio;
            float angle = 0.78539816339; // 45 deg
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            vec2 rotCoord = rot * gl_FragCoord.xy;
            vec2 cellUv = fract(rotCoord / cellSpacing) - 0.5;
            float dist = length(cellUv);

            // Halftone dot radius driven by 3D scene shading & pulse energy
            float radius = clamp(pow(energy, 0.72) * 0.78, 0.0, 0.68);
            float aa = 0.08;
            float halftoneDot = smoothstep(radius + aa, radius - aa, dist);

            // Passive background dot grid for Industrial Cyberpunk texture
            float bgDot = smoothstep(0.16, 0.08, dist);
            vec3 voidBg = vec3(0.0196, 0.0196, 0.0196); // #050505
            vec3 gridDotCol = vec3(0.075, 0.075, 0.075);
            vec3 baseCanvas = mix(voidBg, gridDotCol, bgDot * 0.65);

            // Quantize chromatic hue into portfolio palette (#ff3c00, #0088ff, #ff0033, #e0e0e0)
            vec3 normColor = glow / max(intensity, 0.001);
            vec3 cyberOrange = vec3(1.0, 0.235, 0.0);
            vec3 vectorBlue  = vec3(0.0, 0.533, 1.0);
            vec3 alertRed    = vec3(1.0, 0.0, 0.2);
            vec3 hotWhite    = vec3(0.95, 0.92, 0.88);

            // Determine dominant channel from 3D shaded scene
            vec3 targetHue = mix(cyberOrange, vectorBlue, step(normColor.r, normColor.b * 1.05));
            if (normColor.r > 0.7 && normColor.b > 0.15 && normColor.g < 0.15) {
                targetHue = alertRed;
            }
            vec3 dotColor = mix(targetHue, hotWhite, smoothstep(0.72, 1.0, energy) * 0.55);

            // Combine halftone shader dots with subtle crisp 3D core wireframe continuity
            vec3 rendered = mix(baseCanvas, dotColor, halftoneDot);
            rendered += colCenter.rgb * 0.28;

            // Subtle CRT scanline modulation
            float scanline = 0.94 + 0.06 * sin(gl_FragCoord.y * 3.14159 / uPixelRatio);
            rendered *= scanline;

            gl_FragColor = vec4(rendered, 1.0);
        }
    `,
    depthTest: false,
    depthWrite: false
});

const quadGeo = new THREE.PlaneGeometry(2, 2);
const quadMesh = new THREE.Mesh(quadGeo, halftoneShaderMaterial);
postScene.add(quadMesh);

// Pointer interaction for subtle 3D parallax tilt
const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
        pointer.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
});
container.addEventListener('mouseleave', () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
});

function handleResize() {
    const newW = Math.max(container.clientWidth, 1);
    const newH = Math.max(container.clientHeight, 1);
    const newPR = Math.min(window.devicePixelRatio || 1, 2);

    if (newW === width && newH === height && newPR === pixelRatio) return;

    width = newW;
    height = newH;
    pixelRatio = newPR;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);

    renderTarget.setSize(Math.floor(width * pixelRatio), Math.floor(height * pixelRatio));
    halftoneShaderMaterial.uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
    halftoneShaderMaterial.uniforms.uPixelRatio.value = pixelRatio;
}

window.addEventListener('resize', handleResize);
if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
}

let clockStart = performance.now();

function animate(now) {
    requestAnimationFrame(animate);

    const time = (now - clockStart) * 0.001;
    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;

    // 8-Hop illumination wave sweeping from Hop 0 to Hop 7
    const activeHopFloat = (time * 1.8) % 8.5;

    // 3D Orbital & Oscillatory Motion of the entire Graph
    graphGroup.rotation.y = Math.sin(time * 0.42) * 0.55 + pointer.x * 0.45;
    graphGroup.rotation.x = Math.cos(time * 0.31) * 0.22 - pointer.y * 0.3;
    graphGroup.rotation.z = Math.sin(time * 0.23) * 0.08;

    // Animate 3D Nodes & Hop Pulse Illumination
    for (let i = 0; i < nodeMeshes.length; i++) {
        const n = nodeMeshes[i];
        const hopDist = Math.abs(n.def.hop - activeHopFloat);
        const hopPulse = Math.max(0, 1.0 - hopDist * 0.9);

        // 3D harmonic node oscillation
        n.mesh.position.x = n.basePos.x + Math.sin(time * 1.5 + i * 0.7) * 0.08;
        n.mesh.position.y = n.basePos.y + Math.cos(time * 1.3 + i * 0.9) * 0.12;
        n.mesh.position.z = n.basePos.z + Math.sin(time * 1.1 + i * 1.1) * 0.14;

        const scale = 1.0 + hopPulse * 0.55;
        n.mesh.scale.setScalar(scale);

        n.mat.emissiveIntensity = 0.55 + hopPulse * 1.8;
        n.haloMat.opacity = 0.18 + hopPulse * 0.45;
    }

    updateEdges(time, activeHopFloat);

    halftoneShaderMaterial.uniforms.uTime.value = time;

    // Pass 1: Render 3D Graph Scene into Offscreen Target
    renderer.setRenderTarget(renderTarget);
    renderer.clear();
    renderer.render(scene, camera);

    // Pass 2: Render Halftone Shader Fullscreen Quad to Canvas
    renderer.setRenderTarget(null);
    renderer.render(postScene, postCamera);
}

requestAnimationFrame(animate);
