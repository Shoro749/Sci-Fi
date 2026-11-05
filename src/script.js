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

const canvas = document.querySelector('canvas.webgl');
const { scene, camera, renderer } = createScene();
const environment = createEnvironment();
const artifact = createArtifact();

scene.add(environment, artifact);
const timer = new Timer();

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener('resize', handleResize);

async function start() {
    const lights = addLighting(scene);
    const controls = createControls(camera, canvas);
    const physics = await createPhysicsSystem({ environment });
    const animation = createAnimationSystem({ artifact, environment, lights });
    createInteractionSystem({ camera, canvas, scene, environment, physics });

    function tick() {
        timer.update();
        const deltaTime = timer.getDelta();
        const elapsedTime = timer.getElapsed();
        animation.update(deltaTime, elapsedTime);
        physics.update(deltaTime);
        controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    }

    window.addEventListener('beforeunload', () => physics.dispose(), { once: true });
    tick();
}

start();