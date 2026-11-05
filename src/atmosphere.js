import * as THREE from 'three';

export function createDustField() {
  const positions = new Float32Array(180 * 3);
  const colors = new Float32Array(180 * 3);
  const color = new THREE.Color();

  for (let index = 0; index < 180; index += 1) {
    const offset = index * 3;
    const angle = index * 2.39996;
    const radius = 2.5 + (index % 17) * 0.62;
    positions[offset] = Math.cos(angle) * radius;
    positions[offset + 1] = 0.8 + (index % 29) * 0.28;
    positions[offset + 2] = Math.sin(angle) * radius * 0.72;
    color.set(index % 5 === 0 ? 0x7deeff : 0x8ba9c7);
    color.toArray(colors, offset);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const dust = new THREE.Points(geometry, material);
  dust.userData.baseY = dust.position.y;
  return dust;
}

export function updateDustField(dust, elapsedTime) {
  dust.rotation.y = elapsedTime * 0.012;
  dust.position.y = Math.sin(elapsedTime * 0.18) * 0.08;
}
