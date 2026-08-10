function drawTable() {
  noStroke();
  
  // Draw the outer frame with a type of wood gradient
  for (let i = 0; i < 30; i++) {
    let woodShade = lerpColor(color(51, 27, 14), color(130, 70, 30), i / 30);
    fill(woodShade);
    rectMode(CENTER);
    rect(width / 2, height / 2, tableWidth + 60 - i, tableHeight + 60 - i, 15);
  }

  //add table bumpers with golden image texture for a more appealling look
  noStroke();
    
  // Apply the golden image to the bumpers
  let bumperW = 8;
  imageMode(CENTER);
  image(tableimg1, width / 2, tableY - bumperW / 2, tableWidth, bumperW); // top bumper
  image(tableimg1, width / 2, tableY + tableHeight + bumperW / 2, tableWidth, bumperW); // bottom bumper
  image(tableimg1, tableX - bumperW / 2, height / 2, bumperW, tableHeight); // left bumper
  image(tableimg1, tableX + tableWidth + bumperW / 2, height / 2, bumperW, tableHeight); // right bumper

  image(tableimg2 ,width / 2, height / 2, tableWidth, tableHeight);

  //draw pockets with subtle bevel
  let pocketR = ballRadius * 1.5;
  for (let [x, y] of pockets) {
    let borderWidth = 5; // Thickness of the golden border
    let borderRadius = pocketR + borderWidth / 2; // Border size
    strokeWeight(0); // Disable stroke for the inner pocket
    noFill();
    imageMode(CENTER)
    image(tableimg3, x, y, borderRadius * 2.2, borderRadius * 2.2);
    // noStroke();
    fill(20);
    ellipse(x, y, pocketR * 2);
  }

  // Draw D-line and arc od the Dzone
  stroke(255);
  strokeWeight(2);
  let lineX = tableX + tableWidth * 0.25;
  line(lineX, tableY, lineX, tableY + tableHeight);

  noFill();
  arc(lineX, height / 2, tableHeight / 2.8, tableHeight / 2.8, HALF_PI, -HALF_PI);

}
