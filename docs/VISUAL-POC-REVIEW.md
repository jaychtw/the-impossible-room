# P0 visual proof review

Reviewed in actual Chromium at desktop **1440×900** and emulated mobile **390×844**. English and Traditional Chinese screenshots are in `screenshots/`: `study-*`, `lens-*`, and `macro-*`. The viewport remains the stated size; device emulation is not physical-device testing.

## Assessment

- **Art direction:** original detailed painterly realism, wood grain, aged brass, rain, warm lamplight and cool storm illumination. This is a cinematic illustrated environment rather than schematic/vector substitute art. The degree of polish is visible in the retained screenshot evidence; creator taste remains a human acceptance question.
- **Geometry:** a horizontal brass slide enters its receiver on the right edge of a closed oak door. Four mounting screws and the scratch under the slide remain at the same normalized positions. The macro was integrated back into the room before deriving the interactive door sprite.
- **Alignment:** the door rectangle `(200,40,425,770)` maps to the room's 1672×941 coordinate system. Its background copy is removed, preventing doubled images. The interactive object remains aligned when the whole scene scales. Inspection opens the same authored bolt image.
- **Lighting / texture:** the same amber-lit brass and walnut serve scene and macro. Patch edges are feathered; the brass plate itself is unblended. No independent unrelated lock asset appears on inspection. The palette is deliberately low-key; the macro gives legibility without needing to infer clues from dark panorama pixels.
- **Magnification:** a synchronized duplicate of the actual room composition, including the separate door sprite, is transformed at **1.8×** under a brass-rimmed lens. Pointer and touch movement update the source coordinate. No clue art is fabricated only inside the lens. Moving the lens records nothing.
- **Mobile:** a 116 CSS px lens uses a 48 px touch offset. All object controls are at least 44×44 CSS px, and an explicit inspection list avoids pixel hunting. The high-resolution bolt opens in a vertically scrollable dialog, with the observation and record control below. Small screens intentionally prioritize the artwork above the copy.
- **Continuity corrections:** an exterior bolt mistakenly present in the first hallway painting was removed. Exterior glass was frosted to support the silhouette explanation. Study glass and clock display were corrected. Three exterior impact marks and the same hook/cloth appear in scene and inspection crops.

## Gate decision

The shared-source study / door / lens / macro pipeline supports proceeding with the one-case implementation. It demonstrates matching bolt geometry and authored detail at both scales. This is an implementation review backed by screenshots and a pixel-continuity check, not a claim of independent art-direction approval. No generic-art substitution is being used to waive the requested benchmark.

Remaining human acceptance: physical touch ergonomics, perceived darkness on ordinary phone screens, realism preference, and the satisfaction of the deliberately non-murder explanation. These require creator/player review; automated playthrough success does not establish them.
