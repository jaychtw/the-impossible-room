# Asset provenance and continuity

All illustrations and character designs were generated specifically for this project with OpenAI's image generation tool. No reference images from third parties, stock assets, external fonts, character likenesses, or copied franchise designs are used. Supplied design text is preserved in `handoff/`.

The five original PNG source files in `assets/source/` are retained for editing. Runtime artwork is local WebP. The complete runtime asset set is measured by `npm run test:assets`; there are no runtime image-generation or external network dependencies.

## Production process

1. Generate a cinematic 16:9 walnut study with amber lamplight, teal rain-light, closed oak door and a coherent interior brass slide bolt.
2. Extract the 250×250 source region at `(390,315)` and refine it as a high-resolution macro, preserving its framing, plate, screws, receiver and diagonal scratch.
3. Composite that refined source back into the study using only an edge feather. The complete brass assembly stays opaque. Derive both `door.webp` and `bolt.webp` from this shared composition; remove the entire door rectangle from `study-background.webp` before adding the sprite in the renderer.
4. Generate companion hallway and exterior views with the study as a visual reference. Correct the hallway so it has **no exterior bolt**, and frost the exterior window glass. The fire-safety access plate remains a discrete four-screw panel beside the door.
5. Correct the study glass to match the frosted exterior and set the clock hands to 9:07. Derive note and clock inspection crops from the final study.
6. Generate a five-panel original character sheet: Ari neutral/curious/realization, Mina neutral/supportive. Crop each panel, preserving clothing, facial design, and lighting.
7. Derive panel, report, hinge and cover close-ups directly from their final scene sources. Reveals use those same scenes and objects.

`scripts/build-art.mjs` encodes the crop coordinates and normalized sprite mapping. `scripts/check-art.mjs` compares the brass plate pixels against the macro, checks the door was removed from the background, checks every asset, and enforces a 3 MiB runtime artwork budget.

## Limits

Original AI-generated art is not a claim of exclusive copyright or trademark clearance. It has no intentionally incorporated third-party characters. Cross-scene architecture is illustrative rather than a surveyed 3D reconstruction. Shared-source crops provide stronger local continuity than independent re-generation. The wind and light experiments are authored demonstrations, not physical simulations. Notebook descriptions supply precise observations where surface marks are small at panorama scale. Handwritten note text is a localized HTML layer over the matching paper crop; report and maintenance text are localized interface layers.
