// // powerAdjuster.js

/**
 * PowerAdjuster displays a vertical bar whose fill height
 * reflects how far the cue stick is pulled back.
 */
class PowerAdjuster {
    /**
     * @param {number} x       Top‐left x of the meter
     * @param {number} y       Top‐left y of the meter
     * @param {number} w       Width of the meter
     * @param {number} h       Height of the meter
     * @param {number} maxPull The pull distance that maps to 100% power
     */
    constructor(x, y, w, h, maxPull) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.maxPull = maxPull > 0 ? maxPull : 1;
        this.power = 0;  // normalized [0..1]
    }

    /**
     * Call each frame with the current drag/pull distance.
     * @param {number} pullDist  Actual pull‐back distance from cue start
     */
    update(pullDist) {
        // constrain to [0,1]
        this.power = constrain(pullDist / this.maxPull, 0, 1);
    }

    /**
     * Draws the meter: an outline plus a filled rect from bottom up.
     */
    show() {
        push();
        // 1) Outline of the power meeter/adjuster
        noFill();
        stroke(255);
        rect(this.x - 30, this.y - 20, this.w, this.h, 5);

        // 2) Fill of the power meter
        rectMode(CORNER);
        noStroke();
        fill(0, 200, 0, 150);
        let fillH = this.power * this.h;
        rect(
            this.x - 30,
            (this.y + this.h) - 20,
            this.w,
            -1 * fillH
        );
        pop();
    }

    /**
     * Returns the normalized power [0..1].
     */
    getValue() {
        return this.power;
    }
}















// // powerAdjuster.js

// /**
//  * PowerAdjuster displays a vertical bar whose fill height
//  * reflects how far the cue stick is pulled back.
//  */
// class PowerAdjuster {
//   /**
//    * @param {number} x       Top-left x of the meter
//    * @param {number} y       Top-left y of the meter
//    * @param {number} w       Width of the meter
//    * @param {number} h       Height of the meter
//    * @param {number} maxPull The pull distance that maps to 100% power
//    */
//   constructor(x, y, w, h, maxPull) {
//     this.x = x;
//     this.y = y;
//     this.w = w;
//     this.h = h;
//     this.maxPull = maxPull;
//     this.power = 0;  // normalized [0..1]
//   }

//   /**
//    * Call each frame with the current drag/pull distance.
//    * @param {number} pullDist  Actual pull-back distance from cue start
//    */
//   update(pullDist) {
//     // constrain to [0,1]
//     this.power = constrain(pullDist / this.maxPull, 0, 1);
//   }

//   /**
//    * Returns the normalized power [0..1].
//    */
//   getValue() {
//     return this.power;
//   }

//   /**
//    * Draws the pill-shaped meter outline & fill,
//    * corner-aligned so nothing bleeds—just like PowerMeter.
//    */
//   show() {
//     push();
//       rectMode(CORNER);

//       // 1) Pill bounds & corner radius (copied from your PowerMeter)
//       const mX = this.x - 40;
//       const mY = this.y + 250;
//       const mW = this.w + 15;
//       const mH = this.h - 180;
//       const r  = 20;

//       // 2) Compute fill height & vertical offset
//       const fillH = constrain(this.power * mH, 0, mH);
//       const fillY = mY + (mH - fillH);

//       // 3) Draw the colored fill (only top corners rounded)
//       noStroke();
//       fill(0, 200, 0, 150);
//       rect(
//         mX,       // x
//         fillY,    // y
//         mW,       // width
//         fillH,    // height
//         r, r, 0, 0 // round only top-left & top-right
//       );

//       // 4) Draw the crisp white outline (all corners rounded)
//       noFill();
//       stroke(255);
//       strokeWeight(2);
//       rect(mX, mY, mW, mH, r);

//     pop();
//   }
// }
























//the one i want to make



// powerAdjuster.js

/**
 * PowerAdjuster displays a vertical bar whose fill height
 * reflects how far the cue stick is pulled back.
 */
// class PowerAdjuster {
//     /**
//      * @param {number} x       Top-left x of the meter
//      * @param {number} y       Top-left y of the meter
//      * @param {number} w       Width of the meter
//      * @param {number} h       Height of the meter
//      * @param {number} maxPull The pull distance that maps to 100% power
//      */
//     constructor(x, y, w, h, maxPull) {
//         this.x = x;
//         this.y = y;
//         this.w = w;
//         this.h = h;
//         this.maxPull = maxPull;
//         this.power = 0;  // normalized [0..1]
//     }

//     /**
//      * Call each frame with the current drag/pull distance.
//      * @param {number} pullDist  Actual pull-back distance from cue start
//      */

//     update(pullDist) {
//         // constrain to [0,1]
//         // this.power = constrain(pullDist / this.maxPull, 0, 1);
//         // **Reset to zero** if no pull (mouse released)
//         if (pullDist <= 0) {
//             this.power = 0;
//         } else {
//             this.power = constrain(pullDist / this.maxPull, 0, 1);
//         }

//     }

//     /**
//      * Returns the normalized power [0..1].
//      */
//     getValue() {
//         return this.power;
//     }

//     /**
//      * Draws the pill-shaped meter outline & fill,
//      * corner-aligned so nothing bleeds—just like PowerMeter.
//      * Early exit when power is zero ensures no persistent green bar.
//      */
//     show() {
//         // If no pull, don’t draw anything
//         if (this.power <= 0) {
//             console.log("PowerAdjuster: No power, not drawing.");
//             return
//         }
//         else {
//             console.log("PowerAdjuster: Drawing with power:", this.power);
//             push();
//             rectMode(CORNER);

//             // Pill bounds & corner radius (as in original PowerMeter)
//             const mX = this.x - 40;
//             const mY = this.y + 250;
//             const mW = this.w + 15;
//             const mH = this.h - 180;
//             const r = 10;

//             // Compute clamped fill
//             const fillH = constrain(this.power * mH, 0, mH);
//             const fillY = mY + (mH - fillH);

//             // Draw the green fill — only round top corners
//             noStroke();
//             fill(0, 200, 0, 150);
//             rect(
//                 mX,      // x
//                 fillY,   // y
//                 mW,      // width
//                 fillH,   // height
//                 r, r, 0, 0  // round only top-left & top-right
//             );

//             // Draw the white outline — all corners rounded
//             noFill();
//             stroke(255);
//             strokeWeight(2);
//             rect(mX, mY, mW, mH, r);
//             pop();

//         }


//     }
// }



//usable




// powerAdjuster.js

/**
 * PowerAdjuster displays a vertical bar whose fill height
 * reflects how far the cue stick is pulled back.
 */
// class PowerAdjuster {
//     /**
//      * @param {number} x       Top-left x of the meter
//      * @param {number} y       Top-left y of the meter
//      * @param {number} w       Width of the meter
//      * @param {number} h       Height of the meter
//      * @param {number} maxPull The pull distance that maps to 100% power
//      */
//     constructor(x, y, w, h, maxPull) {
//         this.x = x;
//         this.y = y;
//         this.w = w;
//         this.h = h;
//         this.maxPull = maxPull;
//         this.power = 0;    // normalized [0..1]
//     }

//     /**
//      * Call every frame with the current pull-back distance.
//      */
//     update(pullDist) {
//         // **Reset to zero** if no pull (mouse released)
//         if (pullDist <= 0) {
//             this.power = 0;
//         } else {
//             this.power = constrain(pullDist / this.maxPull, 0, 1);
//         }
//     }

//     /**
//      * Read out 0…1 for scaling your cue force.
//      */
//     getValue() {
//         return this.power;
//     }

//     /**
//      * Draws the meter outline (always) and the fill (only when power > 0).
//      * Outline is the simple rounded rect from your original, fill is top-corner-rounded.
//      */
//     show() {
//         push();
//         // 1) Draw your simple white outline exactly as before
//         noFill();
//         stroke(255);
//         strokeWeight(2);
//         rect(this.x - 20, this.y + 200, this.w, this.h, 5);

//         // 2) If we have any power, draw the fill—round only top corners
//         if (this.power > 0) {
//             const fillH = constrain(this.power * this.h, 5, this.h) - 70;
//             const fillY = (this.y + 200) + (this.h - fillH);

//             noStroke();
//             fill(0, 200, 0, 150);
//             // fill(30);
//             rect(
//                 this.x - 20,        // x
//                 fillY - 100,         // y
//                 this.w,        // width
//                 fillH      // height
//                 // only top-left & top-right rounded
//             );
//         }
//         pop();
//     }
// }







