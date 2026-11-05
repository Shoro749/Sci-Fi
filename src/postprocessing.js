import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export function createPostProcessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.38,
    0.34,
    0.9,
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  function resize(width, height) {
    composer.setSize(width, height);
    bloomPass.setSize(width, height);
  }

  function dispose() {
    composer.dispose();
  }

  return { composer, resize, dispose };
}
