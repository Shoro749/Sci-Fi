import * as THREE from 'three';

const vertexShader = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;
uniform float uTime;

void main() {
  vUv = uv;
  vec3 displaced = position;
  float wave = sin(position.y * 5.0 - uTime * 2.2 + position.x * 2.0) * 0.025;
  displaced += normalize(position) * wave;

  vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
  vWorldPosition = worldPosition.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const fragmentShader = `
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;
varying vec2 vUv;
uniform float uTime;

void main() {
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float fresnel = pow(1.0 - abs(dot(normalize(vWorldNormal), viewDirection)), 2.6);
  float scanPosition = vWorldPosition.y * 4.0 - uTime * 1.8;
  float scanBand = smoothstep(0.35, 0.48, sin(scanPosition) * 0.5 + 0.5);
  float scanDetail = smoothstep(0.58, 0.78, sin(scanPosition * 3.0 + vWorldPosition.x * 2.0) * 0.5 + 0.5);

  float radius = length(vWorldPosition.xz);
  float wave = sin(radius * 7.0 - uTime * 2.6 + vWorldPosition.y * 2.0) * 0.5 + 0.5;
  float energyWave = smoothstep(0.72, 0.96, wave);
  float pulse = 0.82 + sin(uTime * 2.0) * 0.12;

  vec3 cyan = vec3(0.08, 0.78, 1.0);
  vec3 turquoise = vec3(0.08, 1.0, 0.82);
  vec3 color = mix(cyan, turquoise, clamp(scanDetail + energyWave * 0.35, 0.0, 1.0));
  float edgeGlow = fresnel * 1.7;
  float intensity = (0.18 + scanBand * 0.36 + energyWave * 0.28 + edgeGlow) * pulse;
  float alpha = clamp(0.08 + scanBand * 0.13 + energyWave * 0.1 + fresnel * 0.42, 0.0, 0.72);

  gl_FragColor = vec4(color * intensity, alpha);
}
`;

export function createHolographicField() {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  const geometry = new THREE.SphereGeometry(2.55, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.86);
  const field = new THREE.Mesh(geometry, material);
  field.position.y = 0.15;
  field.scale.set(1, 1.08, 1);
  field.userData.shaderMaterial = material;
  return field;
}
