// Matter.js 需要用到的功能
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

let engine;
let world;

// 会运动的图形
let objects = [];

// 固定的平衡杆
let platforms = [];

function setup() {
  createCanvas(800, 700);

  // 创建物理世界
  engine = Engine.create();
  world = engine.world;

  // 重力
  engine.gravity.y = 1;

  // -------------------------
  // 1. 创建会掉下来的图形
  // -------------------------

  // 红色圆
  let ball1 = Bodies.circle(220, 80, 35, {
    restitution: 0.8,
    friction: 0.05,
    density: 0.002
  });

  // 蓝色圆
  let ball2 = Bodies.circle(400, 50, 50, {
    restitution: 0.5,
    friction: 0.1,
    density: 0.004
  });

// 最小的圆
let ball3 = Bodies.circle(580, 100, 25, {
  restitution: 0.25,
  friction: 0.15,
  frictionAir: 0.025,
  density: 0.002
});
// 红色方块
let box1 = Bodies.rectangle(320, 20, 65, 65, {
  restitution: 0.4,
  friction: 0.2,
  density: 0.003,
  angle: 0.3
});

// 长方形
let box2 = Bodies.rectangle(430, 20, 110, 35, {
  restitution: 0.4,
  friction: 0.1,
  density: 0.002,
  angle: -0.4
});
 objects.push(ball1, ball2, ball3, box1, box2);


  // -------------------------
  // 2. 创建倾斜的固定杆
  // -------------------------

  let platform1 = Bodies.rectangle(
    250, 300,
    300, 20,
    {
      isStatic: true,
      angle: 0.15
    }
  );

  let platform2 = Bodies.rectangle(
    550, 450,
    300, 20,
    {
      isStatic: true,
      angle: -0.18
    }
  );

  // 最下面的地面
  let ground = Bodies.rectangle(
    400, 680,
    800, 40,
    {
      isStatic: true
    }
  );

  platforms.push(platform1, platform2, ground);


  // 全部加入物理世界
 World.add(world, [
  ball1,
  ball2,
  ball3,
  box1,
  box2,
  platform1,
  platform2,
  ground
]);
}

function draw() {
  background(242, 239, 235);

  // 更新物理世界
  Engine.update(engine);

  stroke(45);
  strokeWeight(2);


  // ① 大圆 —— 深酒红
  fill(125, 45, 55);
  circle(
    objects[0].position.x,
    objects[0].position.y,
    70
  );


  // ② 大圆 —— 灰粉色
  fill(181, 105, 110);
  circle(
    objects[1].position.x,
    objects[1].position.y,
    100
  );


  // ③ 小圆 —— 暗红色
  fill(150, 60, 65);
  circle(
    objects[2].position.x,
    objects[2].position.y,
    50
  );


  // ④ 正方形
  push();
  translate(
    objects[3].position.x,
    objects[3].position.y
  );
  rotate(objects[3].angle);

  rectMode(CENTER);
  fill(105, 50, 58);
  rect(0, 0, 65, 65);
  pop();


  // ⑤ 长方形
  push();
  translate(
    objects[4].position.x,
    objects[4].position.y
  );
  rotate(objects[4].angle);

  rectMode(CENTER);
  fill(195, 125, 125);
  rect(0, 0, 110, 35);
  pop();


  // -------------------------
  // 固定结构
  // -------------------------

  fill(38);
  noStroke();

  for (let p of platforms) {

    push();

    translate(
      p.position.x,
      p.position.y
    );

    rotate(p.angle);

    rectMode(CENTER);

    if (p === platforms[2]) {
      rect(0, 0, 800, 40);
    } else {
      rect(0, 0, 300, 20);
    }

       pop();
  }
}