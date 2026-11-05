import * as THREE from 'three';

const materials = {
  floor: new THREE.MeshStandardMaterial({ color: 0x111923, roughness: 0.62, metalness: 0.88 }),
  wall: new THREE.MeshStandardMaterial({ color: 0x172432, roughness: 0.56, metalness: 0.78 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x080d14, roughness: 0.72, metalness: 0.82 }),
  trim: new THREE.MeshStandardMaterial({ color: 0x273c4d, roughness: 0.34, metalness: 0.9 }),
  cyan: new THREE.MeshBasicMaterial({ color: 0x16d9ed }),
  purple: new THREE.MeshBasicMaterial({ color: 0x9b59ff }),
  amber: new THREE.MeshBasicMaterial({ color: 0xffb84d }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x47d8e8, transmission: 0.3, transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.2 }),
};

function mesh(geometry, material, position, scale = [1, 1, 1]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.scale.set(...scale);
  object.castShadow = material !== materials.cyan && material !== materials.purple && material !== materials.amber;
  object.receiveShadow = true;
  return object;
}

function addGlowStrip(parent, position, scale, material = materials.cyan, rotation = [0, 0, 0]) {
  const strip = mesh(new THREE.BoxGeometry(1, 0.025, 1), material, position, scale);
  strip.rotation.set(...rotation);
  parent.add(strip);
}

function addPanelWall(parent, z, side = 1) {
  parent.add(mesh(new THREE.BoxGeometry(24, 9, 0.35), materials.wall, [0, 4.5, z]));
  for (let index = -4; index <= 4; index += 1) {
    const x = index * 2.7;
    parent.add(mesh(new THREE.BoxGeometry(0.08, 7.6, 0.05), materials.trim, [x, 4.5, z - side * 0.2]));
    addGlowStrip(parent, [x + 0.65, 4.7, z - side * 0.22], [0.025, 1, 0.06], index % 3 === 0 ? materials.purple : materials.cyan);
  }
  for (const height of [1.4, 4.1, 7.0]) {
    parent.add(mesh(new THREE.BoxGeometry(23, 0.08, 0.08), materials.trim, [0, height, z - side * 0.24]));
  }
}

function addColumn(parent, x, z) {
  const column = new THREE.Group();
  column.position.set(x, 0, z);
  column.add(mesh(new THREE.BoxGeometry(0.8, 8.5, 0.8), materials.dark, [0, 4.25, 0]));
  column.add(mesh(new THREE.BoxGeometry(1.02, 0.12, 1.02), materials.trim, [0, 1, 0]));
  column.add(mesh(new THREE.BoxGeometry(1.02, 0.12, 1.02), materials.trim, [0, 7.6, 0]));
  for (const y of [2.4, 4.2, 6]) addGlowStrip(column, [0, y, -0.42], [0.06, 0.75, 0.1], materials.cyan);
  parent.add(column);
}

function addContainer(parent, position, scale, accent = materials.amber) {
  const container = new THREE.Group();
  container.position.set(...position);
  container.userData.interactive = true;
  container.userData.label = 'Cargo container';
  container.userData.physics = {
    halfExtents: [scale[0] / 2, scale[1] / 2, scale[2] / 2],
    mass: Math.max(1.5, scale[0] * scale[1] * scale[2] * 0.4),
    friction: 0.78,
    restitution: 0.18,
  };
  container.add(mesh(new THREE.BoxGeometry(1, 1, 1), materials.dark, [0, scale[1] / 2, 0], scale));
  container.add(mesh(new THREE.BoxGeometry(1.03, 0.07, 0.08), materials.trim, [0, scale[1] * 0.7, scale[2] / 2 + 0.02], [scale[0], 1, 1]));
  addGlowStrip(container, [0, scale[1] * 0.42, scale[2] / 2 + 0.035], [scale[0] * 0.55, 0.05, 0.04], accent);
  parent.add(container);
}

function addServerRack(parent, x, z) {
  const rack = new THREE.Group();
  rack.position.set(x, 0, z);
  rack.userData.staticCollider = { halfExtents: [0.9, 2.4, 0.425], center: [0, 2.4, 0] };
  rack.add(mesh(new THREE.BoxGeometry(1.8, 4.8, 0.85), materials.dark, [0, 2.4, 0]));
  for (let index = 0; index < 6; index += 1) {
    rack.add(mesh(new THREE.BoxGeometry(1.45, 0.42, 0.04), materials.trim, [0, 0.65 + index * 0.64, -0.45]));
    addGlowStrip(rack, [-0.5, 0.65 + index * 0.64, -0.48], [0.035, 0.16, 0.03], index % 2 ? materials.cyan : materials.purple);
  }
  parent.add(rack);
}

function addPipe(parent, points, radius = 0.08, material = materials.trim) {
  const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  const pipe = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, radius, 8, false), material);
  pipe.castShadow = true;
  parent.add(pipe);
}

export function createEnvironment() {
  const environment = new THREE.Group();
  environment.userData.pulseLights = [];
  environment.userData.rotatingElements = [];
  const floor = mesh(new THREE.BoxGeometry(24, 0.35, 18), materials.floor, [0, -0.18, 0]);
  environment.add(floor);

  for (let x = -10; x <= 10; x += 2) addGlowStrip(environment, [x, 0.01, 0], [0.018, 1, 8.2], x % 4 === 0 ? materials.cyan : materials.trim);
  for (let z = -7; z <= 7; z += 2) addGlowStrip(environment, [0, 0.02, z], [11, 1, 0.018], materials.trim);

  addPanelWall(environment, -9, 1);
  addPanelWall(environment, 9, -1);
  for (const x of [-11.8, 11.8]) addColumn(environment, x, 0);
  for (const z of [-8.7, 8.7]) addColumn(environment, 0, z);

  environment.add(mesh(new THREE.BoxGeometry(24, 0.25, 18), materials.dark, [0, 9.1, 0]));
  for (let x = -10; x <= 10; x += 4) {
    environment.add(mesh(new THREE.BoxGeometry(0.35, 0.45, 17), materials.trim, [x, 8.8, 0]));
    addGlowStrip(environment, [x + 0.2, 8.55, 0], [0.06, 1, 7], materials.purple);
  }
  for (const z of [-6, 0, 6]) environment.add(mesh(new THREE.BoxGeometry(23, 0.3, 0.35), materials.trim, [0, 8.7, z]));

  const platform = new THREE.Group();
  platform.add(mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.55, 48), materials.dark, [0, 0.28, 0]));
  platform.add(mesh(new THREE.CylinderGeometry(2.75, 2.85, 0.22, 48), materials.trim, [0, 0.66, 0]));
  platform.add(mesh(new THREE.CylinderGeometry(2.35, 2.35, 0.1, 48), materials.cyan, [0, 0.82, 0]));
  platform.add(mesh(new THREE.CylinderGeometry(2.16, 2.16, 0.12, 48), materials.dark, [0, 0.88, 0]));
  for (let index = 0; index < 8; index += 1) {
    const angle = index * Math.PI / 4;
    addGlowStrip(platform, [Math.cos(angle) * 1.45, 0.96, Math.sin(angle) * 1.45], [0.06, 0.55, 0.16], index % 2 ? materials.cyan : materials.purple, [0, -angle, 0]);
  }
  environment.userData.rotatingElements.push(platform);
  environment.add(platform);

  addContainer(environment, [-8, 0, -5.8], [2.6, 2.1, 2.3]);
  addContainer(environment, [8, 0, -5.8], [2, 3.4, 2]);
  addContainer(environment, [-8.8, 0, 5.4], [3, 1.6, 2.1], materials.cyan);
  addContainer(environment, [8.8, 0, 5.6], [1.8, 1.4, 2.8], materials.purple);

  addServerRack(environment, -9.5, -1.7);
  addServerRack(environment, 9.5, -1.7);
  addServerRack(environment, 7.5, -7.5);

  addPipe(environment, [[-10.8, 6.8, -8.7], [-8, 6.8, -8.7], [-6, 5.5, -8.7], [-6, 2.5, -8.7]], 0.12, materials.trim);
  addPipe(environment, [[10.8, 6.2, 8.7], [8, 6.2, 8.7], [6.8, 5.2, 7.2], [6.8, 2.2, 7.2]], 0.1, materials.cyan);
  addPipe(environment, [[-11, 1.2, 8.7], [-9, 1.2, 8.7], [-7.4, 2.1, 7], [-6, 2.1, 7]], 0.08, materials.purple);

  environment.traverse((object) => {
    if (object.isMesh && object.material.type === 'MeshBasicMaterial' && object.position.y > 0.5) {
      environment.userData.pulseLights.push(object);
    }
  });

  return environment;
}
