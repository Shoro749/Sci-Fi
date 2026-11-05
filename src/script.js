import * as THREE from 'three';
import { Timer } from 'three/src/core/Timer.js';
import { createScene } from './scene.js';
import { createEnvironment } from './environment.js';
import { createArtifact } from './artifact.js';
import { addLighting } from './lighting.js';
import { createControls } from './controls.js';

const canvas = document.querySelector('canvas.webgl');
const { scene, camera, renderer } = createScene();
const environment = createEnvironment();
const artifact = createArtifact();

scene.add(environment, artifact);
addLighting(scene);
const controls = createControls(camera, canvas);
const timer = new Timer();

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', handleResize);

function tick() {
    timer.update();
    const elapsedTime = timer.getElapsed();
    artifact.rotation.y = elapsedTime * 0.18;
    artifact.position.y = 4.2 + Math.sin(elapsedTime * 1.4) * 0.08;
    artifact.children[0].rotation.y = elapsedTime * 0.35;
    artifact.children[1].rotation.y = -elapsedTime * 0.8;
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();