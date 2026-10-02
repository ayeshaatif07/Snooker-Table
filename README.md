# Snooker Table

An interactive snooker game built with [p5.js](https://p5js.org/), [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) and the [Matter.js](https://brm.io/matter-js/) physics engine.

## Features

- Three game modes with different ball arrangements.
- Realistic ball physics: collisions and cushion bounces.
- Mouse and keyboard controls.
- Power adjuster: a vertical meter that shows how hard the shot will be.
- Sound effects for collisions, pockets and powerful shots.
- Cue ball placement inside the "D" zone after the cue ball is potted.
- Foul detection when two coloured balls are potted in a row without a red in between.
- Coloured balls return to their spots when potted while reds remain.
- Console logging of the gameplay (which balls the cue ball hits, cushion hits and potted balls).

## Game Modes

| Key | Mode |
|-----|------|
| `1` | Classic setup: red balls in a triangle plus the six coloured balls on their spots |
| `2` | Random placement of the 15 red balls |
| `3` | Random placement of the 15 red balls and all six coloured balls |

Switching modes resets the table.

## Controls

| Input | Action |
|-------|--------|
| Mouse press on the cue ball, drag, release | Aim and shoot. The ball goes in the opposite direction of the drag, and a longer drag means a stronger shot |
| Arrow keys | Nudge the cue ball |
| Click inside the D zone | Place the cue ball after it has been potted |
| `1`, `2`, `3` | Switch game mode |

## Rules Implemented

- Potted red balls are removed from the table.
- Potted coloured balls are returned to their spots while red balls remain, and removed permanently once all reds are gone.
- Potting the cue ball removes it, and you place it again in the D zone.
- Potting two coloured balls consecutively without a red ball between them shows an error message.

## Project Structure

| File | Purpose |
|------|---------|
| `index.html` | Loads the libraries and scripts |
| `sketch.js` | Setup, drawing loop, ball setup for each mode, input handling and pocket detection |
| `ball.js` | `Ball` class: physics body and shaded drawing |
| `table.js` | Draws the table |
| `cue.js` | `Cue` class: aiming, shooting and keyboard control |
| `BallManager.js` | Tracks potted balls and the consecutive-colour foul |
| `CueHit.js` | Detects and logs cue ball hits on balls and cushions |
| `powerAdjuster.js` | `PowerAdjuster` class: the power meter |
| `libraries/` | p5.js, p5.sound and Matter.js |
| `cuesound/` | Sound effects |
| `*.jpg`, `*.png` | Background and table images |

## Run Locally

The game loads images and sounds, so serve it from a local web server:

```bash
git clone https://github.com/ayeshaatif07/Snooker-Table.git
cd Snooker-Table
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser. Press `Ctrl+C` in the terminal to stop the server.

## Author and Credits

- **Author:** Ayesha Atif
- **Coursework:** Graphics – Midterm
- Built with [p5.js](https://p5js.org/), p5.sound and [Matter.js](https://brm.io/matter-js/)
