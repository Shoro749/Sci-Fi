export function createAnimationSystem({ artifact, environment, lights }) {
  const { core, innerCore, rings, halo, glowMaterial, glassMaterial } = artifact.userData.animationParts;

  function update(deltaTime, elapsedTime) {
    const lift = Math.sin(elapsedTime * 1.4);
    artifact.position.y = 4.2 + lift * 0.08;
    artifact.rotation.y += deltaTime * 0.18;
    core.rotation.y += deltaTime * 0.35;
    innerCore.rotation.y -= deltaTime * 0.8;
    innerCore.rotation.x = Math.sin(elapsedTime * 0.8) * 0.12;
    rings.forEach((ring, index) => {
      ring.rotation.y += deltaTime * (index % 2 ? -0.24 : 0.16);
      ring.rotation.z += deltaTime * 0.08;
    });

    const pulse = 1 + (Math.sin(elapsedTime * 2.8) + 1) * 0.18;
    glowMaterial.color.setRGB(0.55 * pulse, 1, 1);
    glassMaterial.emissiveIntensity = 1.2 + pulse * 0.45;
    halo.material.opacity = 0.055 + pulse * 0.025;
    lights.artifactLight.position.y = artifact.position.y;
    lights.artifactLight.intensity = 14 + pulse * 5;

    environment.userData.pulseLights.forEach((light, index) => {
      light.scale.x = 0.82 + (Math.sin(elapsedTime * 3 + index * 0.7) + 1) * 0.09;
    });
    environment.userData.rotatingElements.forEach((element) => { element.rotation.y += deltaTime * 0.12; });
  }

  return { update };
}