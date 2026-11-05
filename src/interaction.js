import * as THREE from 'three';

export function createInteractionSystem({ camera, canvas, environment, physics }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const interactiveObjects = [];
  let hoveredObject = null;
  const tooltip = document.createElement('div');
  tooltip.className = 'interaction-tooltip';
  document.body.append(tooltip);

  environment.traverse((object) => {
    if (object.userData.interactive) interactiveObjects.push(object);
  });

  function setPointer(event) {
    const bounds = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  }

  function findHovered(event) {
    setPointer(event);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(interactiveObjects, true);
    return hits.length ? hits[0].object.parent : null;
  }

  function updateHover(event) {
    const nextObject = findHovered(event);
    if (hoveredObject && hoveredObject !== nextObject) hoveredObject.scale.setScalar(1);
    hoveredObject = nextObject;
    if (hoveredObject) {
      hoveredObject.scale.setScalar(1.035);
      tooltip.textContent = `${hoveredObject.userData.label} // CLICK TO IMPULSE`;
      tooltip.style.transform = `translate(${event.clientX + 14}px, ${event.clientY + 14}px)`;
      tooltip.classList.add('is-visible');
      canvas.style.cursor = 'pointer';
    } else {
      tooltip.classList.remove('is-visible');
      canvas.style.cursor = 'grab';
    }
  }

  canvas.addEventListener('pointermove', updateHover);
  canvas.addEventListener('pointerleave', () => {
    if (hoveredObject) hoveredObject.scale.setScalar(1);
    hoveredObject = null;
    tooltip.classList.remove('is-visible');
    canvas.style.cursor = 'grab';
  });
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    const object = findHovered(event);
    if (!object) return;
    const impulseDirection = new THREE.Vector3();
    camera.getWorldDirection(impulseDirection);
    physics.applyImpulse(object, impulseDirection.multiplyScalar(-2.2).setY(1.15));
  });

  return { update: () => {} };
}