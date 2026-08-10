// Matter.js aliases
let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies;

// Game variables
let engine, world;
let balls = [];
let cueBall;
let cue;
let cuePlacementMessage = true;
let tableWidth = 900;
let tableHeight = 450;
let ballRadius;
let pocketRadius;
let tableX, tableY;
let D_radius;
let pockets = [];
let ballManager; // Manages ball potting rules
let cueHit; // Manages cue-ball collision detection
let backgroundimg;
let tableimg1, tableimg2, tableimg3;

// Sounds
let pocketSound, cueHitSound, stickHitSound;

// Power meter variables
let powerAdjuster;
let meterX, meterY, meterW, meterH, maxPull;

//loadding images and sounds
function preload() {
  backgroundimg = loadImage('background.jpg');
  tableimg1 = loadImage('golden.jpg');
  tableimg2 = loadImage('blue.jpg');
  tableimg3 = loadImage('golden2.png');
  pocketSound = loadSound('./cuesound/pockets.wav');
  cueHitSound = loadSound('./cuesound/cuehitsball.wav');
  stickHitSound = loadSound('./cuesound/stickhitsball.wav');
}

function setup() {
  createCanvas(1100, 700);

  //create physics engine
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 0;
  Engine.run(engine);

  // Play sound on collision with balls,cushions
  Matter.Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs;
    for (let pair of pairs) {
      if (!cueHitSound.isPlaying()) {
        cueHitSound.play(); // Play sound when any bodies collide
      }
    }
  });

  // Table and ball dimensions
  tableX = (width - tableWidth) / 2;
  tableY = (height - tableHeight) / 2;
  ballRadius = tableWidth / 72;
  pocketRadius = ballRadius * 2.2;
  D_radius = 2 * ballRadius * 3;

  // Set up pockets, walls, and balls
  setupPockets();
  setupBoundaries();
  setupBalls(1);

  // Table walls (invisible walls for collision)
  tableBorders = [
    { x: tableX, y: tableY, width: tableWidth, height: 20 },
    { x: tableX, y: tableY + tableHeight - 20, width: tableWidth, height: 20 },
    { x: tableX, y: tableY, width: 20, height: tableHeight },
    { x: tableX + tableWidth - 20, y: tableY, width: 20, height: tableHeight }
  ];

  // Initialize managers
  ballManager = new BallManager(balls, pockets, pocketRadius);
  cueHit = new CueHit(cueBall, balls, pockets, tableBorders);

  // Setup power adjuster (the vertical meter) //my extension
  meterW = 20;
  meterH = tableHeight;
  meterX = tableX - meterW - 10;
  meterY = tableY;
  maxPull = 150;
  powerAdjuster = new PowerAdjuster(meterX, meterY, meterW, meterH, maxPull);

  // Sound volumes
  stickHitSound.setVolume(0.07);
  pocketSound.setVolume(0.8);
  cueHitSound.setVolume(0.6);
}

function draw() {
  // Draw the background and table
  image(backgroundimg, 0, 0, width, height);
  push();
  drawTable();
  pop();

  // Draw balls and cue
  for (let b of balls) b.show();
  if (cueBall) cueBall.show();
  if (cue) {
    cue.show();
    cue.keyControl();
  }

  //Update thee power meter
  let pullDist = 0;
  if (cue && cue.isAiming && cue.start) {
    pullDist = dist(cue.start.x, cue.start.y, mouseX, mouseY);
  }
  powerAdjuster.update(pullDist);
  powerAdjuster.show();

  //update the game logic
  ballManager.update();
  cueHit.update();

  //display the instructions when the cue ball is potted
  if (cuePlacementMessage) {
    fill(255);
    textSize(20);
    textAlign(CENTER);
    text("Click inside the D zone to shoot", width / 4, 60);
    console.log("Cue ball is potted. Click in the Dzone.");
  }

  // show the error if 2 colored balls are potted consecutively 
  if (ballManager.getColorBoolean()) {
    fill(255);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Error! Two colored balls potted together without a red ball!", width / 2, tableY + tableHeight + 70);
  }

  // Show cue ball marker
  if (cueBall) {
    fill(255, 255, 0);
    let pos = cueBall.body.position;
    ellipse(pos.x, pos.y, 5);
  }

  // Check if any balls are potted
  checkPockets();
}

// define the pocket positions
function setupPockets() {
  pockets = [
    [tableX, tableY],
    [tableX + tableWidth / 2, tableY],
    [tableX + tableWidth, tableY],
    [tableX, tableY + tableHeight],
    [tableX + tableWidth / 2, tableY + tableHeight],
    [tableX + tableWidth, tableY + tableHeight]
  ];
}

// Defining the table borders here
function setupBoundaries() {
  let options = { isStatic: true, restitution: 1.1 };
  World.add(world, [
    Bodies.rectangle(width / 2, tableY - 10, tableWidth, 20, options),
    Bodies.rectangle(width / 2, tableY + tableHeight + 10, tableWidth, 20, options),
    Bodies.rectangle(tableX - 10, height / 2, 20, tableHeight, options),
    Bodies.rectangle(tableX + tableWidth + 10, height / 2, 20, tableHeight, options)
  ]);
}

// settingg up balls depending on game modes
function setupBalls(mode) {
  for (let b of balls) b.remove();
  balls = [];

  let cy = tableY + tableHeight / 2;
  let triangleStartX = tableX + tableWidth * 0.7;
  let triangleStartY = cy;
  let spacing = ballRadius * 2 + 0.5;

  // classic red triangle shaped red balls + coloured balls
  if (mode === 1) {
    let rows = 5;
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i <= r; i++) {
        let x = triangleStartX + r * spacing;
        let y = triangleStartY - r * spacing / 2 + i * spacing;
        let redBall = new Ball(x, y, ballRadius, 'red');
        balls.push(redBall);
      }
    }

    balls.push(new Ball(triangleStartX - spacing * 1.2, triangleStartY, ballRadius, 'pink'));
    balls.push(new Ball(triangleStartX + spacing * 5.5, triangleStartY, ballRadius, 'black'));
    balls.push(new Ball(tableX + tableWidth * 0.5, cy, ballRadius, 'blue'));

    let lineX = tableX + tableWidth * 0.25;
    balls.push(new Ball(lineX, cy, ballRadius, 'brown'));
    balls.push(new Ball(lineX, cy - D_radius, ballRadius, 'green'));
    balls.push(new Ball(lineX, cy + D_radius, ballRadius, 'yellow'));
  }

  // Random red balls 
  if (mode === 2 || mode === 3) {
    for (let i = 0; i < 15; i++) {
      let x = random(tableX + 100, tableX + tableWidth - 100);
      let y = random(tableY + 50, tableY + tableHeight - 50);
      balls.push(new Ball(x, y, ballRadius, 'red'));
    }
    // or random red and colored  balls
    if (mode === 3) {
      let colours = ['blue', 'pink', 'black', 'green', 'yellow', 'brown'];
      for (let c of colours) {
        let x = random(tableX + 100, tableX + tableWidth - 100);
        let y = random(tableY + 50, tableY + tableHeight - 50);
        balls.push(new Ball(x, y, ballRadius, c));
      }
    }
  }

  //create cue ball and cue
  cueBall = new Ball(tableX + tableWidth * 0.20, cy, ballRadius, 'white', "cue");
  cue = new Cue(cueBall);
  cuePlacementMessage = false;
}

// Press 1, 2, or 3 to switch game modes
function keyPressed() {
  if (key === '1') setupBalls(1);
  if (key === '2') setupBalls(2);
  if (key === '3') setupBalls(3);
}

// mouse pressed function
function mousePressed() {
  const centerX = tableX + tableWidth * 0.25;
  const centerY = tableY + tableHeight / 2;
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const distFromD = Math.hypot(dx, dy);

  if (!cueBall && distFromD <= D_radius) {
    cueBall = new Ball(mouseX, mouseY, ballRadius, 'white', 'cue');
    cue = new Cue(cueBall);
    cuePlacementMessage = false;
    return;
  }

  if (cue && cueBall) {
    cue.mousePressed();
  }
}

// mouse release functions
function mouseReleased() {
  if (cue) {
    cue.mouseReleased();
    cueHit.resetHitBalls();
  }
}

function checkPockets() {
  // Combine all balls and the cue ball into one array for checking
  let allBalls = [...balls];
  if (cueBall) allBalls.push(cueBall);
  // Loop through all balls in reverse order
  for (let i = allBalls.length - 1; i >= 0; i--) {
    let b = allBalls[i];
    // skip if the ball is null or its body is missing
    if (!b || !b.body) continue;
    let pos = b.body.position;
    //check this ball against all pocket positions
    for (let p of pockets) {
      let d = dist(pos.x, pos.y, p[0], p[1]);
      if (d < pocketRadius + ballRadius * 0.2) {
        pocketSound.play();   //pocket sound effect
        if (b.label === "cue") {
          World.remove(world, b.body); //removing from physics world
          cueBall = null;                
          cue = null;                  
          cuePlacementMessage = true;  
        } else if (b.label === "red") {
          b.remove();                            
          balls.splice(balls.indexOf(b), 1);   
        // Handle colored balls by repositioning
        } else {
          //deefining the default resspot positions for colored balls
          const spot = {
            pink:   [tableX + tableWidth * 0.7 - pocketRadius * 1.2, tableY + tableHeight / 2],
            black:  [tableX + tableWidth * 0.7 + pocketRadius * 5.5, tableY + tableHeight / 2],
            blue:   [tableX + tableWidth * 0.5, tableY + tableHeight / 2],
            brown:  [tableX + tableWidth * 0.25, tableY + tableHeight / 2],
            green:  [tableX + tableWidth * 0.25, tableY + tableHeight / 2 - D_radius],
            yellow: [tableX + tableWidth * 0.25, tableY + tableHeight / 2 + D_radius],
          }[b.label];
          // Reposition the ball if a valid spot is found
          if (spot) {
            Matter.Body.setPosition(b.body, { x: spot[0], y: spot[1] });   
            Matter.Body.setVelocity(b.body, { x: 0, y: 0 });               
          }
        }
        break;
      }
    }
  }
}