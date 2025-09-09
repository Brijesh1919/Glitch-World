# Glitch World Only

This repo is an early scaffold for a 2D glitch-themed platformer. The project uses React + a simple HTML5 canvas renderer (level logic lives in `src/levels/_LevelBase.jsx`) so you can prototype mechanics fast.

Quick start
1. Install dependencies:

```bash
npm install
```
2. Run the dev server:

```bash
npm run dev
```
3. Open the game in your browser: http://localhost:5173/

Controls
- Move: Arrow keys or A/D
- Jump: ArrowUp / W / Space

Developer notes
- Progression is strictly sequential: you must complete Level 1 to unlock Level 2, then Level 3. During development I removed the console helpers that allowed skipping levels so players must progress normally.

Level guide
===========

Level 1 — Glitch Zone: Inverted Controls
- Objective: Reach the green exit gate on the right side of the level.
- Mechanics:
	- There is a GlitchZone area that randomly inverts left/right controls.
	- Spike trap around `x ≈ 400` kills on contact and respawns you.
- Tips to complete:
	1. Move to the right, jump over small gaps and the spike.
	2. If controls invert, pause and re-orient (the overlay shows the glitch region).
	3. Touch the green gate at the far right to go to Level 2.

Level 2 — Debug Room: Broken Power-ups
- Objective: Find and touch the real exit gate on the right.
- Mechanics:
	- The room contains a fake "Godmode" power-up (yellow block labeled GOD) that does nothing.
	- Jump input has an artificial delay (simulates lag) — this makes precise platforming harder.
	- There are platforms placed to test timing; the spike location is configurable (default `spikeX=320`).
- How to complete:
	1. Treat the yellow GOD block as a troll (it only displays a message). Don't rely on it.
	2. Time your jumps by holding direction briefly before jumping to account for the jump delay.
	3. Use the platforms to cross the room; avoid the spike at x≈320.
	4. Touch the (real) green gate on the right to progress to Level 3.

Level 3 — Gravity Hell: Welcome to the upside down
- Objective: Trigger the real gate while surviving the gravity mayhem.
- Mechanics:
	- Gravity flips every 10s (configurable). When gravity is inverted, the ceiling behaves like the floor.
	- A "safe zone" is actually a trap — stepping into it will kill you (troll).
	- There is at least one switch that flips gravity on touch (trollish interactive element).
- How to complete:
	1. Observe gravity direction before attempting large jumps (UI shows current gravity).
	2. Use platforms and the gravity switch to position yourself near the gate when gravity is favorable.
	3. The safe zone is labeled — avoid it. If you fall in, you'll respawn at the checkpoint.

Editing levels
- Levels are driven by `src/levels/_LevelBase.jsx`. The per-level config is passed from `src/levels/Level1.jsx`, `Level2.jsx`, `Level3.jsx` via the `behaviorConfig` object.
- To change the gate behavior (make it fake/real), update `fakeGate: true|false` in the level file.
- To place platforms, spikes, fake power-ups, switches, or safe zones, edit the arrays/objects inside the level's `behaviorConfig`.

Common issues and fixes
- Blank or unresponsive level after transition:
	- Refresh the page; open DevTools Console to check for `[LevelBase] mount` logs.
	- If you previously used console helpers like `window.setLevel`, note they were removed to keep progression sequential; you can re-enable them in `src/components/GameManager.jsx` for development.
- Repeated gate triggers or immediate re-transition: the game sets a short transition guard to prevent double-trigger; you can re-enable debug helpers if you need to skip levels while testing.

Where to go next
- Add a proper Game Over / transition animation (I can add this next).
- Add audio (Howler) and retro chiptune loops with random distortion.
- Replace the canvas engine with Pixi for shader postprocessing.

If you want, I can also add an on-screen debug panel with buttons (Skip Level, Restart Level, Toggle Fake Gate) so you can test without the console.

Additional Levels (4 -> 10)
---------------------------

Level 4 — Echo Chamber
- Objective: Cross the level while avoiding your ghost echo.
- Mechanics: Your movements are recorded and a ghost replicates them ~1s later. If the ghost collides with you, you die. Use timing to avoid crossing your own path.

Level 5 — Missing Textures
- Objective: Reach the exit by revealing platforms.
- Mechanics: Platforms are invisible by default. Touch the reveal switch in the lower-left to make them visible (or temporarily revealed). There is a fake power-up placed as a troll.

Level 6 — Clone Party
- Objective: Find the real exit among the clones.
- Mechanics: Several clone NPCs mimic movement and distract you. Multiple gates appear; only one is real. Touching a fake gate teleports you back or triggers a troll.

Level 7 — Delay Hell
- Objective: Survive inconsistent input latencies to reach the gate.
- Mechanics: Inputs (move/jump) get randomized delay between 100–500ms. Visual/audio indicators hint when the lag spikes.

Level 8 — Slide World
- Objective: Navigate icy platforms and stop at the gate.
- Mechanics: Surfaces are slippery. Reduced friction means you slide. Use walls and platforms to stop your momentum.

Level 9 — Reverse World
- Objective: Complete the mirrored gauntlet.
- Mechanics: The world is mirrored horizontally and controls may feel reversed. Visual cues (some gates or labels) remain normal to confuse perception.

Level 10 — Glitch Core
- Objective: Survive the chaos and reach a moving gate.
- Mechanics: Multiple previous glitches randomly toggle on/off. The exit gate moves periodically. Expect unpredictable behavior; stay alert.
