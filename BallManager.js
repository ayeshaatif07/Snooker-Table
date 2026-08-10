class BallManager {
  constructor(ballArray, pocketArray, pocketRadius) {
    this.balls = ballArray;
    this.pockets = pocketArray;
    this.pocketRadius = pocketRadius;
    // this.pottedColoredBalls = new Set();
    this.errorShown = false;
    this.coloredNames = ["black", "green", "pink", "brown", "blue", "yellow"];
    this.sequence = []; // Track the order of potted balls
    this.twoColoredBallsMessage = false; // Flag for error message
    // this.errorTimestamp = 0; // Store the timestamp when the error was shown
    this.redBallsRemaining = this.balls.filter(ball => ball.label === "red").length; // Track remaining red balls
  }

  update() {
    let pottedThisTurn = []; // Track the potted balls for this turn

    // Loop over the balls and check if they are potted
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];
      const pos = ball.body.position;

      // Check if any ball is potted
      for (let [x, y] of this.pockets) {
        let d = dist(pos.x, pos.y, x, y);
        if (d < this.pocketRadius + ball.r * 0.2) {
          //iff the ball is a colored ball and its potted
          if (this.coloredNames.includes(ball.label)) {
            // If all red balls are potted, remove the colored ball permanently
            if (this.redBallsRemaining <= 0) {
              this.removeBall(ball);
            } else {
              // Add the potted colored ball to the sequence and allow it to reappear
              this.sequence.push(ball.label);
              pottedThisTurn.push(ball.label); // Track the colored balls potted this turn
              console.log(`Potted: ${ball.label}`);
            }
          } else if (ball.label === "red") {
            // Decrement the count of red balls remaining
            this.redBallsRemaining--;

            // Reset the sequence if a red ball is potted
            console.log("Red ball potted, resetting error and sequence.");
            this.sequence = []; // Reset sequence after red ball
            this.twoColoredBallsMessage = false; // Reset the error flag after red ball
          }
        }
      }
    }

    // Check if two colored balls are potted consecutively without any red ball in between
    if (this.sequence.length >= 2) {
      const lastTwoBalls = this.sequence.slice(-2);
      if (this.coloredNames.includes(lastTwoBalls[0]) && this.coloredNames.includes(lastTwoBalls[1])) {
        this.twoColoredBallsMessage = true;
        console.log("Error: Two colored balls potted consecutively without a red ball.");
      }
    }
  }

  removeBall(ball) {
    // Logic to permanently remove the ball from the table or world
    const index = this.balls.indexOf(ball);
    if (index > -1) {
      this.balls.splice(index, 1);
      console.log(`${ball.label} has been permanently potted and removed from the table.`);
    }
  }
 
  getColorBoolean(){
    return this.twoColoredBallsMessage;
  }
}