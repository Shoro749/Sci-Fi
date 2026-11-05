# AGENTS.md — SCI-FI ARTIFACT ROOM

## 1. Project Overview

This is a Three.js 3D environment project built with Vite and vanilla JavaScript.

The project concept is SCI-FI ARTIFACT ROOM: a futuristic research laboratory containing a mysterious floating energy artifact.

The goal is to create a visually polished, interactive 3D scene that demonstrates:
- 3D primitives and complex models.
- Custom materials and lighting.
- Shadows.
- Animation.
- Physics simulation.
- High-quality rendering and post-processing.
- Custom GLSL shaders.

The project is also an educational assignment. Code should be understandable, maintainable, and reasonably simple rather than unnecessarily complicated.

## 2. Technology Constraints

Use the existing project setup.

- Three.js — 3D rendering.
- Vite — development server and build tool.
- Vanilla JavaScript with ES Modules.
- HTML and standard CSS for the interface.
- GLSL for custom shaders.

Rules:
- Do not use React, Vue, Angular, or other frontend frameworks.
- Do not use Tailwind CSS.
- Do not introduce unnecessary dependencies.
- Prefer Three.js built-in functionality when possible.
- Use the existing installed versions of dependencies.
- Do not replace the build system or modify project configuration without a good reason.

If an additional library is necessary, explain why it is needed and request approval before installing it.

## 3. Development Principles

Follow these principles throughout the project:

1. Inspect the existing code before making changes.
2. Reuse existing implementations instead of duplicating functionality.
3. Preserve working features.
4. Avoid rewriting entire files when a smaller modification is sufficient.
5. Keep responsibilities separated between modules.
6. Use descriptive variable and function names.
7. Avoid unnecessary abstractions and overengineering.
8. Keep code readable and explain non-obvious solutions.
9. Do not create placeholder functionality and report it as completed.
10. Do not silently ignore errors.

## 4. Project Architecture

Keep the project modular.

Suggested responsibilities:

- `script.js` — application initialization and animation loop.
- `scene/` — scene, camera, renderer, and lighting.
- `objects/` — room, artifact, containers, and environment objects.
- `animation/` — object animations and animation management.
- `physics/` — physics world and synchronization with Three.js.
- `shaders/` — custom GLSL shaders and ShaderMaterial implementations.
- `ui/` — HTML interface and interaction logic.
- `styles/` — CSS.

This is a guideline, not a requirement to create every module immediately.

Adapt the structure to the actual project and avoid creating unnecessary files.

## 5. Three.js Guidelines

- Use BufferGeometry-based primitives and appropriate materials.
- Prefer MeshStandardMaterial and MeshPhysicalMaterial for realistic surfaces.
- Use emissive materials for glowing elements.
- Use ShaderMaterial only when custom shader behavior is required.
- Properly configure castShadow and receiveShadow.
- Use reusable geometries and materials for repeated objects.
- Dispose of geometries, materials, textures, and render targets when they are no longer needed.
- Avoid creating new Three.js objects inside the animation loop unnecessarily.

Use deltaTime or elapsedTime for frame-rate-independent animation.

## 6. Visual Design

Maintain a consistent Dark Sci-Fi aesthetic.

Visual direction:
- Dark metallic surfaces.
- Cyan and turquoise energy effects.
- Blue and purple neon accents.
- Futuristic architectural details.
- High contrast between dark surroundings and luminous objects.
- Atmospheric and cinematic lighting.

The central artifact must remain the visual focal point.

Avoid:
- Excessive random decorative objects.
- Unnecessary bright colors.
- Flat, uniformly lit environments.
- Repetitive primitive arrangements without visual detail.
- Excessive bloom that destroys object details.

Every new object should contribute to the composition or atmosphere.

## 7. Physics Guidelines

When implementing physics:

- Use a dedicated physics engine when realistic collision simulation is required.
- Keep physics simulation separate from rendering logic.
- Use a fixed timestep where appropriate.
- Synchronize Three.js object transforms with physics bodies.
- Prevent objects from passing through floors and walls.
- Avoid creating physics bodies every frame.
- Clean up physics resources when objects are removed.

Prefer realistic and controlled low-gravity behavior over chaotic movement.

## 8. Shader Guidelines

Custom shaders must contain actual GLSL code.

When implementing ShaderMaterial:
- Separate vertex and fragment shaders into understandable modules.
- Use uniforms for configurable parameters.
- Update time-dependent uniforms in the animation loop.
- Keep shader calculations reasonably optimized.
- Handle transparency and depth correctly.

Do not replace a requested custom shader with a standard material or a static texture.

## 9. Agent Workflow

Before implementing a task:

1. Read the relevant existing files.
2. Understand how the current functionality works.
3. Identify which files need modification.
4. Explain the planned changes briefly.
5. Implement only what is necessary for the current task.

After implementation:

1. Check for syntax and runtime errors.
2. Run the existing project build command if available.
3. Verify that existing functionality still works.
4. Report any problems that could not be resolved.

Never claim that something works without actually verifying it.

## 10. Permissions and Safety

The agent may:
- Read and analyze project files.
- Create new source files.
- Modify existing source files when necessary.
- Refactor small sections of code.
- Run existing development and build commands.

The agent must request approval before:
- Installing new dependencies.
- Removing existing dependencies.
- Deleting important files or directories.
- Replacing major parts of the architecture.
- Rewriting existing working systems.
- Changing package.json or build configuration in a significant way.
- Performing Git commits, pushes, or destructive Git operations.

Never:
- Delete the user's existing work without permission.
- Modify node_modules manually.
- Hardcode secrets or credentials.
- Hide build errors or warnings.

## 11. Communication

The user is learning Three.js and wants to understand the implementation.

When completing a task, provide a concise explanation containing:

1. What was implemented.
2. Which files were created or modified.
3. How the implementation works.
4. Important technical decisions and why they were made.
5. How to test the result.
6. Any known limitations or unfinished functionality.

Explain unfamiliar Three.js concepts when they are introduced.

Avoid unnecessary theory, but do not hide important implementation details.

The user should be able to understand and maintain the resulting code.