class Ball {
  constructor(x, y, r, color, label = null) {
    this.r = r;
    this.color = color;
    this.label = label || color; // Use color as label if not provided
    this.body = Matter.Bodies.circle(x, y, r, {
      restitution: 0.9,
      friction: 0,
      frictionAir: 0.01,
      label: this.label,
    });

    Matter.World.add(world, this.body);
    this.isPotted = false;
  }


  //show the ball on the canvas 
  show() {
    let pos = this.body.position;
    push();
    translate(pos.x, pos.y);

    //apply the shiny gradient effect for the balls 
    this.drawShinyBall(0, 0, this.r, this.color);

    pop();
  }

  drawShinyBall(x, y, r, baseColor) {
    const lightColor = color(255);  // white color for the highlight
    const ballColor = color(baseColor);  // The ball's base color
    const edgeColor = color(lerpColor(ballColor, color(0), 0.4));  // Darkened edge color
    
    // Create a gradient effect for a shiny look: from light to dark
    for (let i = r; i > 0; i--) {
      let inter = map(i, 0, r, 0, 1);
      let c = lerpColor(lightColor, ballColor, inter);  // Gradually darken as we move outward

      // Blend between light and dark edges
      let finalColor = lerpColor(c, edgeColor, 0.5);  // Darker edges at the ball's border

      // Draw the ball with the gradient effect
      fill(finalColor);
      noStroke();
      ellipse(x, y, i * 2, i * 2);  // Draw the ball with gradient
    }
  }
  // Check if the ball is inside any of the pockets
  isInPocket(pockets) {
    let pos = this.body.position;
    for (let pocket of pockets) {
      let d = dist(pos.x, pos.y, pocket.x, pocket.y);
      if (d < pocket.radius) return true; // the ball is in thee pocket 
    }
    return false; // the ball is not in the pocket
  }

  //remove the ball from the world (mark as potted)
  remove() {
    Matter.World.remove(world, this.body);
    this.isPotted = true;
  }
}