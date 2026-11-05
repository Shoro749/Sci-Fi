import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 3.5, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 7;
  controls.maxDistance = 25;
  controls.minPolarAngle = 0.3;
  controls.maxPolarAngle = Math.PI / 2 - 0.04;
  controls.enablePan = false;
  return controls;
}
