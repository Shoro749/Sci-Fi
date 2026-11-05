import * as THREE from 'three';

export function addLighting(scene) {
  const hemisphere = new THREE.HemisphereLight(0x7dc7ff, 0x02030a, 0.5);
  scene.add(hemisphere);

  const keyLight = new THREE.DirectionalLight(0xb9dbff, 2.4);
  keyLight.position.set(6, 14, 8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -18;
  keyLight.shadow.camera.right = 18;
  keyLight.shadow.camera.top = 18;
  keyLight.shadow.camera.bottom = -18;
  keyLight.shadow.bias = -0.0004;
  scene.add(keyLight);

  const artifactLight = new THREE.PointLight(0x35eaff, 18, 12, 2);
  artifactLight.position.set(0, 4.2, 0);
  artifactLight.castShadow = true;
  artifactLight.shadow.mapSize.set(1024, 1024);
  scene.add(artifactLight);

  const magentaLight = new THREE.PointLight(0xa34dff, 8, 14, 2);
  magentaLight.position.set(-7, 5, -7);
  scene.add(magentaLight);

  const cyanLight = new THREE.PointLight(0x00bcd4, 7, 12, 2);
  cyanLight.position.set(7, 4, 5);
  scene.add(cyanLight);

  return { artifactLight, magentaLight, cyanLight };
}
