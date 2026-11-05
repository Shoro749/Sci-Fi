import * as THREE from 'three';
import { Timer } from 'three/src/core/Timer.js';
import { createScene } from './scene.js';
import { createEnvironment } from './environment.js';
import { createArtifact } from './artifact.js';
import { addLighting } from './lighting.js';
import { createControls } from './controls.js';
import { createAnimationSystem } from './animation.js';
import { createInteractionSystem } from './interaction.js';
import { createPhysicsSystem } from './physics.js';
import { createPostProcessing } from './postprocessing.js';
import { createDustField, updateDustField } from './atmosphere.js';

const canvas = document.querySelector('canvas.webgl');
const { scene, camera, renderer } = createScene();
const environment = createEnvironment();
const artifact = createArtifact();
const dust = createDustField();

scene.add(environment, artifact, dust);
const timer = new Timer();
const interfaceElement = document.querySelector('.interface');
const uiToggle = document.querySelector('[data-ui-toggle]');
let postProcessing;

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    if (postProcessing) postProcessing.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);

async function start() {
    const lights = addLighting(scene);
    const controls = createControls(camera, canvas);
    postProcessing = createPostProcessing(renderer, scene, camera);
    const physics = await createPhysicsSystem({ environment });
    const animation = createAnimationSystem({ artifact, environment, lights });
    createInteractionSystem({ camera, canvas, scene, environment, physics });
    let isRunning = true;
    let animationFrameId = 0;

    function tick() {
        if (!isRunning) return;
        timer.update();
        const deltaTime = timer.getDelta();
        const elapsedTime = timer.getElapsed();
        animation.update(deltaTime, elapsedTime);
        updateDustField(dust, elapsedTime);
        physics.update(deltaTime);
        controls.update();
        postProcessing.composer.render();
        animationFrameId = window.requestAnimationFrame(tick);
    }

    window.addEventListener('beforeunload', () => {
        isRunning = false;
        window.cancelAnimationFrame(animationFrameId);
        physics.dispose();
        postProcessing.dispose();
        dust.geometry.dispose();
        dust.material.dispose();
    }, { once: true });

    function toggleInterface() {
        interfaceElement.classList.toggle('is-hidden');
        uiToggle.setAttribute('aria-pressed', String(!interfaceElement.classList.contains('is-hidden')));
    }

    uiToggle.addEventListener('click', toggleInterface);
    window.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'h') toggleInterface();
    });
    tick();
}

start();