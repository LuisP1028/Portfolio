<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body, html {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #000;
}

canvas {
    width: 100%;
    height: 100vh;
    display: block;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>

<script type="importmap">
{
    "imports": {
        "three": "https://unpkg.com/three@0.162.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.162.0/examples/jsm/",
        "lil-gui": "https://unpkg.com/lil-gui@0.19.1/dist/lil-gui.esm.js"
    }
}
</script>

<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { GUI } from 'lil-gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
composer.addPass(renderPass);
composer.addPass(bloomPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.minDistance = 5;
controls.maxDistance = 30;

camera.position.set(15, 10, 15);
controls.update();

const params = {
    waveSpeed: 1.0,
    waveHeight: 1.2,
    particleSize: 0.05,
    bloomIntensity: 1.5,
    bloomRadius: 0.4,
    mouseInfluence: 0.5
};

const gui = new GUI();
gui.add(params, 'waveSpeed', 0.1, 3.0).name('Wave Speed');
gui.add(params, 'waveHeight', 0.1, 3.0).name('Wave Height');
gui.add(params, 'particleSize', 0.01, 0.2).name('Particle Size');
gui.add(params, 'bloomIntensity', 0, 3.0).onChange((value) => {
    bloomPass.strength = value;
}).name('Bloom Intensity');
gui.add(params, 'mouseInfluence', 0, 2.0).name('Mouse Influence');

const mouse = new THREE.Vector2();
const mouseTarget = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouseTarget.lerp(mouse, 0.1);
});

const particleCount = 150000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const initialPositions = new Float32Array(particleCount * 3);

const gridSize = Math.sqrt(particleCount);
const spacing = 0.2;

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const x = (i % gridSize - gridSize / 2) * spacing;
    const z = (Math.floor(i / gridSize) - gridSize / 2) * spacing;

    positions[i3] = x;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = z;

    initialPositions[i3] = x;
    initialPositions[i3 + 1] = 0;
    initialPositions[i3 + 2] = z;

    const color = new THREE.Color();
    const distance = Math.sqrt(x * x + z * z);
    const hue = (distance * 0.1) % 1;
    color.setHSL(hue, 0.8, 0.6);

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: params.particleSize,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const points = new THREE.Points(geometry, material);
scene.add(points);

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01 * params.waveSpeed;

    const positions = points.geometry.attributes.position.array;
    const colors = points.geometry.attributes.color.array;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = initialPositions[i3];
        const z = initialPositions[i3 + 2];

        const distance = Math.sqrt(x * x + z * z);
        const angle = Math.atan2(z, x);

        const wave1 = Math.sin(x * 0.5 + time) * 0.5;
        const wave2 = Math.cos(z * 0.5 + time) * 0.5;
        const wave3 = Math.sin(distance - time) * 0.5;
        const wave4 = Math.sin(angle * 5 + distance - time) * 0.3;
        const wave5 = Math.cos(distance * 0.5 - time * 2) * Math.exp(-distance * 0.1) * 0.5;

        const mouseDistance = Math.sqrt(
            Math.pow(x / (gridSize * spacing) - mouseTarget.x, 2) +
            Math.pow(z / (gridSize * spacing) - mouseTarget.y, 2)
        );
        const mouseInfluence = Math.exp(-mouseDistance * 5) * params.mouseInfluence;

        positions[i3] = x + Math.sin(time) * mouseInfluence * 0.5;
        positions[i3 + 1] = (wave1 + wave2 + wave3 + wave4 + wave5) * params.waveHeight + mouseInfluence;
        positions[i3 + 2] = z + Math.cos(time) * mouseInfluence * 0.5;

        const color = new THREE.Color();
        const hue = (distance * 0.1 + time * 0.1 + mouseInfluence * 0.2) % 1;
        const saturation = 0.8 + mouseInfluence * 0.2;
        const lightness = 0.5 + Math.sin(time + distance * 0.5) * 0.2 + mouseInfluence * 0.3;
        color.setHSL(hue, saturation, lightness);

        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    material.size = params.particleSize;

    controls.update();
    composer.render();
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
});

animate();
</script>