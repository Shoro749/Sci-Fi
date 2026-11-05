import * as THREE from 'three';

function makeMaterial(options) {
  return new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.7, ...options });
}

export function createArtifact() {
  const artifact = new THREE.Group();
  artifact.position.y = 4.2;

  const darkMetal = makeMaterial({ color: 0x111b27, emissive: 0x06121b, emissiveIntensity: 0.5 });
  const cyanMetal = makeMaterial({ color: 0x1bb7c8, emissive: 0x006a78, emissiveIntensity: 1.4, roughness: 0.18 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x8cffff });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x4cefff, transmission: 0.45, transparent: true, opacity: 0.78, roughness: 0.12, metalness: 0.1, emissive: 0x007e96, emissiveIntensity: 1.6 });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 2), glass);
  core.scale.set(0.82, 1.3, 0.82);
  core.rotation.set(0.3, 0.2, -0.2);
  artifact.add(core);

  const innerCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.54, 1), glow);
  innerCore.scale.set(0.7, 1.45, 0.7);
  innerCore.rotation.z = Math.PI / 4;
  artifact.add(innerCore);

  const ringGeometry = new THREE.TorusGeometry(1.5, 0.075, 12, 64);
  for (let index = 0; index < 3; index += 1) {
    const ring = new THREE.Mesh(ringGeometry, index === 1 ? cyanMetal : darkMetal);
    ring.rotation.x = Math.PI / 2 + index * 0.45;
    ring.rotation.z = index * 1.7;
    ring.scale.setScalar(1 - index * 0.13);
    artifact.add(ring);
  }

  const spikeGeometry = new THREE.ConeGeometry(0.16, 1.2, 6);
  for (let index = 0; index < 8; index += 1) {
    const spike = new THREE.Mesh(spikeGeometry, index % 2 ? cyanMetal : darkMetal);
    const angle = (index / 8) * Math.PI * 2;
    spike.position.set(Math.cos(angle) * 0.82, Math.sin(index * 1.4) * 0.38, Math.sin(angle) * 0.82);
    spike.lookAt(spike.position.clone().multiplyScalar(2));
    artifact.add(spike);
  }

  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.35, 24, 16), new THREE.MeshBasicMaterial({ color: 0x27eaff, transparent: true, opacity: 0.075, side: THREE.DoubleSide }));
  artifact.add(halo);

  artifact.userData.animationParts = { core, innerCore, rings: artifact.children.slice(2, 5), halo, glowMaterial: glow, glassMaterial: glass };

  return artifact;
}
