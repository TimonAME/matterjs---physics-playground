const matterContainer = document.querySelector("#matter-container");
const THICCNESS = 400;
const { Constraint } = Matter;

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: matterContainer,
  engine: engine,
  options: {
    width: matterContainer.clientWidth,
    height: matterContainer.clientHeight,
    background: "transparent",
    wireframes: false,
    showAngleIndicator: false
  }
});

// render rectangles
/*
let rectangleSize = 80;
let numberOfRectangle = matterContainer.clientHeight / rectangleSize;

let rectangleFriction = 1;
let rectangleFrictionAir = 0.02;
let rectangleRestitution = 0;

for (let i = 0; i < numberOfRectangle/4; i++ ) {
  let circleA = Bodies.rectangle(matterContainer.clientWidth / 4, matterContainer.clientHeight - (rectangleSize * i) + rectangleSize/2, rectangleSize, rectangleSize, {
    friction: rectangleFriction,
    frictionAir: rectangleFrictionAir,
    restitution: rectangleRestitution
  });
  let circleB = Bodies.rectangle(matterContainer.clientWidth / 4*3, matterContainer.clientHeight - (rectangleSize * i) + rectangleSize/2, rectangleSize, rectangleSize, {
    friction: rectangleFriction,
    frictionAir: rectangleFrictionAir,
    restitution: rectangleRestitution
  });
  Composite.add(engine.world, [circleA, circleB]);
}
*/
let box = Bodies.rectangle(50,50,200,20, {
  frictionAir: 2,
  density: 1,
});
Composite.add(engine.world, box);


// render balls
let numberOfBalls = 10000;
let ballSize = 15;
let delay = ballSize*2;

for (let i = 0; i < numberOfBalls; i++ ) {
  ((index) => {
    setTimeout(() => {
      let spawnpoint = Math.floor(Math.random() * matterContainer.clientWidth);
      let circle = Bodies.circle(spawnpoint, -100, ballSize, { //Math.abs(random)
        friction: 0.1,
        frictionAir: 0.201,
        restitution: 0.4,
        density: 0.0001
      });
      Composite.add(engine.world, circle);
    }, index * delay);
  })(i);
}

// Create the rotor as a single rectangle
let rotor = Bodies.rectangle(matterContainer.clientWidth / 2, matterContainer.clientHeight / 2, matterContainer.clientHeight - 10, 20);

// Add the rotor to the world
Composite.add(engine.world, rotor);

// Create a constraint to fix the rotor in place
let constraint = Constraint.create({
  pointA: { x: matterContainer.clientWidth / 2, y: matterContainer.clientHeight / 2 },
  bodyB: rotor,
  stiffness: 1
});

// Add the constraint to the world
Composite.add(engine.world, constraint);

// Rotate the rotor

setInterval(() => {
  Matter.Body.rotate(rotor, 0.02);
}, 10);


// Check for balls to remove every 60ms
setInterval(function() {
  let bodies = Composite.allBodies(engine.world);

  for (let i = 0; i < bodies.length; i++) {
    if (bodies[i].position.y > matterContainer.clientHeight) {
      // Remove the body when it falls off the screen
      Composite.remove(engine.world, bodies[i]);
    }
  }
}, 100);


/*
var ground = Bodies.rectangle(
  matterContainer.clientWidth / 2,
  matterContainer.clientHeight + THICCNESS / 2,
  27184,
  THICCNESS,
  { isStatic: true }
);
*/

let leftWall = Bodies.rectangle(
  0 - THICCNESS / 2,
  matterContainer.clientHeight / 2,
  THICCNESS,
  matterContainer.clientHeight * 5,
  {
    isStatic: true
  }
);

let rightWall = Bodies.rectangle(
  matterContainer.clientWidth + THICCNESS / 2,
  matterContainer.clientHeight / 2,
  THICCNESS,
  matterContainer.clientHeight * 5,
  { isStatic: true }
);

// add all of the bodies to the world
Composite.add(engine.world, [leftWall, rightWall]); //ground, 

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false
    }
  }
});

Composite.add(engine.world, mouseConstraint);

// allow scroll through the canvas
mouseConstraint.mouse.element.removeEventListener(
  "mousewheel",
  mouseConstraint.mouse.mousewheel
);
mouseConstraint.mouse.element.removeEventListener(
  "DOMMouseScroll",
  mouseConstraint.mouse.mousewheel
);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function handleResize(matterContainer) {
  // set canvas size to new values
  render.canvas.width = matterContainer.clientWidth;
  render.canvas.height = matterContainer.clientHeight;

  // reposition ground
  /*
  Matter.Body.setPosition(
    ground,
    Matter.Vector.create(
      matterContainer.clientWidth / 2,
      matterContainer.clientHeight + THICCNESS / 2
    )
  );
  */

  // reposition right wall
  Matter.Body.setPosition(
    rightWall,
    Matter.Vector.create(
      matterContainer.clientWidth + THICCNESS / 2,
      matterContainer.clientHeight / 2
    )
  );
}

window.addEventListener("resize", () => handleResize(matterContainer));