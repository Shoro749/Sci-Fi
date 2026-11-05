import RAPIER from '@dimforge/rapier3d-compat';

const FIXED_STEP = 1 / 60;
const MAX_FRAME_DELTA = 0.1;

function addFixedBox(world, halfExtents, position, options = {}) {
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(...position));
  const collider = RAPIER.ColliderDesc.cuboid(...halfExtents)
    .setFriction(options.friction ?? 0.8)
    .setRestitution(options.restitution ?? 0.12);
  world.createCollider(collider, body);
  return body;
}

export async function createPhysicsSystem({ environment }) {
  await RAPIER.init();
  const world = new RAPIER.World({ x: 0, y: -3.2, z: 0 });
  world.integrationParameters.dt = FIXED_STEP;
  const dynamicBodies = new Map();

  addFixedBox(world, [12, 0.175, 9], [0, -0.175, 0]);
  addFixedBox(world, [12, 0.35, 0.175], [0, 8.75, -9]);
  addFixedBox(world, [12, 0.35, 0.175], [0, 8.75, 9]);
  addFixedBox(world, [0.175, 4.5, 9], [-12, 4.5, 0]);
  addFixedBox(world, [0.175, 4.5, 9], [12, 4.5, 0]);

  environment.traverse((object) => {
    if (!object.userData.staticCollider) return;
    const { halfExtents, center } = object.userData.staticCollider;
    addFixedBox(world, halfExtents, [
      object.position.x + center[0],
      object.position.y + center[1],
      object.position.z + center[2],
    ]);
  });

  environment.traverse((object) => {
    if (!object.userData.physics) return;
    const { halfExtents, mass, friction, restitution } = object.userData.physics;
    const body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(object.position.x, halfExtents[1], object.position.z)
        .setAdditionalMass(mass)
        .setLinearDamping(1.15)
        .setAngularDamping(1.8)
        .setCanSleep(true),
    );
    const collider = RAPIER.ColliderDesc.cuboid(...halfExtents)
      .setFriction(friction)
      .setRestitution(restitution)
      .setDensity(1);
    world.createCollider(collider, body);
    dynamicBodies.set(object, body);
  });

  let accumulator = 0;

  function applyImpulse(object, impulse) {
    const body = dynamicBodies.get(object);
    if (!body) return;
    body.wakeUp();
    body.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);
  }

  function update(deltaTime) {
    accumulator = Math.min(accumulator + Math.min(deltaTime, MAX_FRAME_DELTA), 0.25);
    while (accumulator >= FIXED_STEP) {
      world.step();
      accumulator -= FIXED_STEP;
    }
    dynamicBodies.forEach((body, object) => {
      const translation = body.translation();
      const rotation = body.rotation();
      object.position.set(translation.x, translation.y, translation.z);
      object.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    });
  }

  function dispose() {
    dynamicBodies.clear();
    world.free();
  }

  return { update, applyImpulse, dispose, world };
}