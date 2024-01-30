const matterContainer = document.querySelector("#matter-container");
const THICCNESS = 400;

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

// render balls
let rectangleSize = 50;
let numberOfRectangle = matterContainer.clientHeight / rectangleSize;

let rectangleFriction = 1;
let rectangleFrictionAir = 0.02;
let rectangleRestitution = 0;

for (let i = 0; i < numberOfRectangle; i++ ) {
  let circleA = Bodies.rectangle(matterContainer.clientWidth / 4*3, matterContainer.clientHeight - (rectangleSize * i) + rectangleSize/2, rectangleSize, rectangleSize, {
    friction: rectangleFriction,
    frictionAir: rectangleFrictionAir,
    restitution: rectangleRestitution
  });
  let circleB = Bodies.rectangle(matterContainer.clientWidth / 4*3 - rectangleSize, matterContainer.clientHeight - (rectangleSize * i) + rectangleSize/2, rectangleSize, rectangleSize, {
    friction: rectangleFriction,
    frictionAir: rectangleFrictionAir,
    restitution: rectangleRestitution
  });
  let circleC = Bodies.rectangle(matterContainer.clientWidth / 4*3 + rectangleSize, matterContainer.clientHeight - (rectangleSize * i) + rectangleSize/2, rectangleSize, rectangleSize, {
    friction: rectangleFriction,
    frictionAir: rectangleFrictionAir,
    restitution: rectangleRestitution
  });
  Composite.add(engine.world, [circleA, circleB, circleC]);
}

let circle = Bodies.circle(40, 40, 30, {
  friction: 0.1,
  frictionAir: 0.00001,
  restitution: 0.5
});
Composite.add(engine.world, circle);


var ground = Bodies.rectangle(
  matterContainer.clientWidth / 2,
  matterContainer.clientHeight + THICCNESS / 2,
  27184,
  THICCNESS,
  { isStatic: true }
);

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
Composite.add(engine.world, [ground, leftWall, rightWall]);

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
  Matter.Body.setPosition(
    ground,
    Matter.Vector.create(
      matterContainer.clientWidth / 2,
      matterContainer.clientHeight + THICCNESS / 2
    )
  );

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