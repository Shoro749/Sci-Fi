import * as THREE from 'three';

export function addLighting(scene) {
  const hemisphere = new THREE.HemisphereLight(0x9bd6ff, 0x182532, 1.55);
  scene.add(hemisphere);

  const keyLight = new THREE.DirectionalLight(0xb9dbff, 2.1);
  keyLight.position.set(6, 14, 8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.left = -18;
  keyLight.shadow.camera.right = 18;
  keyLight.shadow.camera.top = 18;
  keyLight.shadow.camera.bottom = -18;
  keyLight.shadow.bias = -0.0004;
  scene.add(keyLight);

  const artifactLight = new THREE.PointLight(0x35eaff, 24, 15, 2);
  artifactLight.position.set(0, 4.2, 0);
  artifactLight.castShadow = true;
  artifactLight.shadow.mapSize.set(1024, 1024);
  scene.add(artifactLight);

  const magentaLight = new THREE.PointLight(0xa34dff, 4.5, 16, 2);
  magentaLight.position.set(-7, 5, -7);
  scene.add(magentaLight);

  const cyanLight = new THREE.PointLight(0x00bcd4, 5.5, 15, 2);
  cyanLight.position.set(7, 4, 5);
  scene.add(cyanLight);

  const ceilingFill = new THREE.PointLight(0x5caeff, 5, 22, 2);
  ceilingFill.position.set(-4, 8.1, 1.5);
  scene.add(ceilingFill);

  const equipmentFill = new THREE.PointLight(0x2cc9df, 4, 10, 2);
  equipmentFill.position.set(8, 3.2, -4.5);
  scene.add(equipmentFill);

  const rearFill = new THREE.PointLight(0x3157c9, 3.5, 16, 2);
  rearFill.position.set(-7, 4.5, 6.5);
  scene.add(rearFill);

  const cameraFill = new THREE.DirectionalLight(0x6da9df, 2.5);
  cameraFill.position.set(13, 10, 15);
  cameraFill.target.position.set(0, 3, 0);
  scene.add(cameraFill, cameraFill.target);

  return { artifactLight, magentaLight, cyanLight, ceilingFill, equipmentFill, rearFill, cameraFill };
}
