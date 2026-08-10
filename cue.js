class Cue {
  constructor(cueBall) {
    this.cueBall = cueBall;
    this.isAiming = false;
    this.start = null;
    this.maxForce = 0.010;  // Reduced force to prevent overshooting
    this.rotationAngle = 0;
  }

  show() {
    if (!this.cueBall || this.cueBall.body.isSleeping) return;

    const pos = this.cueBall.body.position;
    let aimVec;

    if (this.isAiming && this.start) {
      aimVec = createVector(this.start.x - mouseX, this.start.y - mouseY);
      aimVec.setMag(60);  // Maximum aiming distance

      // Constrain the aim vector to prevent the cue from going off the table
      const tableWidthHalf = tableWidth / 2;
      const tableHeightHalf = tableHeight / 2;

      // Limit the aiming vector to ensure it stays within the table's boundaries
      if (pos.x + aimVec.x < tableX || pos.x + aimVec.x > tableX + tableWidth) {
        aimVec.x = constrain(aimVec.x, -(pos.x - tableX), (tableX + tableWidth) - pos.x);
      }

      if (pos.y + aimVec.y < tableY || pos.y + aimVec.y > tableY + tableHeight) {
        aimVec.y = constrain(aimVec.y, -(pos.y - tableY), (tableY + tableHeight) - pos.y);
      }

      // Draw the cue stick (constrained aim vector)
      stroke(60);
      strokeWeight(6);
      line(pos.x, pos.y, pos.x + aimVec.x, pos.y + aimVec.y);
    }
  }

  mousePressed() {
    if (!this.cueBall) return;
    const pos = this.cueBall.body.position;
    let d = dist(mouseX, mouseY, pos.x, pos.y);
    if (d < this.cueBall.r * 2.5) {
      this.isAiming = true;
      this.start = createVector(mouseX, mouseY);
    }
  }

  mouseReleased() {
    if (!this.isAiming || !this.start || !this.cueBall) return;
    const end = createVector(mouseX, mouseY);
    let force = p5.Vector.sub(this.start, end).mult(0.0015);

    // Cap the force to prevent the cue ball from overshooting the table
    if (force.mag() > this.maxForce) {
      force.setMag(this.maxForce);
      stickHitSound.play();
    }

    Matter.Body.applyForce(this.cueBall.body, this.cueBall.body.position, {
      x: force.x,
      y: force.y
    });

    this.isAiming = false;
    this.start = null;
  }

  keyControl() {
    if (!this.cueBall) return;
    const forceAmount = 0.001;  // Reduced keyboard force

    const pos = this.cueBall.body.position;

    // Move cue ball with keyboard controls
    if (keyIsDown(LEFT_ARROW)) {
      Matter.Body.applyForce(this.cueBall.body, pos, { x: -forceAmount, y: 0 });
    }
    if (keyIsDown(RIGHT_ARROW)) {
      Matter.Body.applyForce(this.cueBall.body, pos, { x: forceAmount, y: 0 });
    }
    if (keyIsDown(UP_ARROW)) {
      Matter.Body.applyForce(this.cueBall.body, pos, { x: 0, y: -forceAmount });
    }
    if (keyIsDown(DOWN_ARROW)) {
      Matter.Body.applyForce(this.cueBall.body, pos, { x: 0, y: forceAmount });
    }
  }
}