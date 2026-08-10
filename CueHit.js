class CueHit {
    constructor(cueBall, balls, pockets, tableBorders) {
      this.cueBall = cueBall;
      this.balls = balls;  // All the balls (including the coloured and red)
      this.pockets = pockets;  // Pockets positions
      this.tableBorders = tableBorders;  //table boundaries (edges)
      this.hitBalls = new Map();  //track the balls that have been hit by the cue ball by using Map to store the last hit position
      this.hitBorders = false;  // Flag to track if the cue ball has hit the table borders
    }
  
    //check for collisions and each event is handled separately shown in the console log
    update() {
      //check if the cue ball is hitting any red ball or colored ball
      for (let ball of this.balls) {
        let distance = dist(this.cueBall.body.position.x, this.cueBall.body.position.y, ball.body.position.x, ball.body.position.y);
        // If the cue ball is within touching distance of the ball
        if (distance <= this.cueBall.r + ball.r) {
          // Log when cue ball hits a ball, and ensure it logs even if it's touched before
          if (!this.hitBalls.has(ball.label)) {
            console.log(`Cue ball hit the ${ball.label} ball`);
            this.hitBalls.set(ball.label, ball.body.position);  // Record the last hit position
          } else {
            // If the ball is already in the hitBalls map, check if it's still touching the cue ball
            let previousPosition = this.hitBalls.get(ball.label);
            if (previousPosition && dist(previousPosition.x, previousPosition.y, ball.body.position.x, ball.body.position.y) > 1) {
              console.log(`Cue ball hit the ${ball.label} ball again`);
              this.hitBalls.set(ball.label, ball.body.position);  // Update the position of the ball being hit
            }
          }
        }
      }
  
      //chheck if the cue ball hits any of the table cushions (boundaries)
      let hitCushion = false;
      for (let border of this.tableBorders) {
        // Check for distance to the top, bottom, left and right borders
        let distance = this.calculateDistanceToBorder(border);
  
        //if the distance is within the cue balls radius + the thickness of the border than  it is considered a hit
        if (distance <= this.cueBall.r) {
          hitCushion = true;
          // Log when cue ball hits a cushion, only once
          if (!this.hitBorders) {
            console.log(`Cue ball hit the cushion`);
            this.hitBorders = true;  //set flag to true to prevent multiple logs
          }
        }
      }
  
      //reset hitBorders flag once cue ball has moved away from cushions
      if (!hitCushion) {
        this.hitBorders = false;
      }
    }
  
    //calculate distance from the cue ball to the nearest border
    calculateDistanceToBorder(border) {
      let dx = Math.max(border.x - this.cueBall.body.position.x, 0, this.cueBall.body.position.x - (border.x + border.width));
      let dy = Math.max(border.y - this.cueBall.body.position.y, 0, this.cueBall.body.position.y - (border.y + border.height));
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    //reset the hit status for balls after a shot (can be called in the game loop after each shot)
    resetHitBalls() {
      this.hitBalls.clear();  //reset the map of hit balls
    }
  }