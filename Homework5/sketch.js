let ices = [];
let selectedIce = null;

let pressStart = 0;
let startMouseX = 0;
let startMouseY = 0;

let isDragging = false;

// HEAT
let heatX;
let heatY;
let heatSize = 150;

// 自动生成冰块
let lastSpawnTime = 0;
let spawnInterval = 2500;


function setup() {
  createCanvas(windowWidth, windowHeight);

  heatX = width * 0.82;
  heatY = height * 0.78;

  // 初始冰块
  ices.push(new Ice(180, 220, 90, -0.12));
  ices.push(new Ice(340, 330, 105, 0.08));
  ices.push(new Ice(510, 210, 82, -0.05));
  ices.push(new Ice(660, 350, 100, 0.12));
  ices.push(new Ice(800, 210, 75, -0.10));
  ices.push(new Ice(250, 470, 80, 0.06));
  ices.push(new Ice(540, 480, 92, -0.08));

  lastSpawnTime = millis();
}


function draw() {
  background(237, 244, 244);

  drawBackground();
  drawHeat();

  // 自动生成新冰块
  if (
    millis() - lastSpawnTime > spawnInterval &&
    ices.length < 8
  ) {
    spawnNewIce();
    lastSpawnTime = millis();
  }

  // 更新冰块
  for (let ice of ices) {
    ice.update();
    ice.display();
  }

  // 删除已经完全消失的冰块
  ices = ices.filter(ice => !ice.finished);

  // 检查长按
  checkLongPress();
}


// =====================================
// BACKGROUND
// =====================================

function drawBackground() {
  noStroke();

  // 下方桌面
  fill(215, 226, 226);

  rect(
    0,
    height * 0.62,
    width,
    height * 0.38
  );

  // 标题
  fill(55);

  textAlign(LEFT);

  textStyle(BOLD);

  textSize(25);

  text(
    "DELETE, DELETE, DELETE",
    45,
    55
  );

  textStyle(NORMAL);

  textSize(13);

  fill(105);

  text(
    "How many ways can ice disappear?",
    46,
    80
  );
}


// =====================================
// HEAT
// =====================================

function drawHeat() {
  push();

  noStroke();

  // 热源外层
  for (
    let r = heatSize;
    r > 30;
    r -= 15
  ) {

    let alphaValue = map(
      r,
      heatSize,
      30,
      10,
      55
    );

    fill(
      225,
      120,
      80,
      alphaValue
    );

    circle(
      heatX,
      heatY,
      r
    );
  }

  // 热源中心
  fill(
    215,
    100,
    65,
    180
  );

  circle(
    heatX,
    heatY,
    65
  );

  fill(255);

  textAlign(
    CENTER,
    CENTER
  );

  textSize(11);

  textStyle(NORMAL);

  text(
    "HEAT",
    heatX,
    heatY
  );

  pop();
}


// =====================================
// ICE
// =====================================

class Ice {

  constructor(
    x,
    y,
    size,
    angle
  ) {

    this.x = x;
    this.y = y;

    this.size = size;
    this.originalSize = size;

    this.angle = angle;

    this.alpha = 220;

    this.melting = false;
    this.breaking = false;

    this.breakAmount = 0;

    this.finished = false;

    this.waterSize = 0;

    this.offsetX = 0;
    this.offsetY = 0;
  }


  update() {

    // -----------------------------
    // TAP：碎裂
    // -----------------------------

    if (this.breaking) {

      this.breakAmount += 2.3;

      this.alpha -= 13;

      if (this.alpha <= 0) {
        this.finished = true;
      }
    }


    // -----------------------------
    // HOLD / HEAT：融化
    // -----------------------------

    if (
      this.melting &&
      !this.breaking
    ) {

      this.size -= 0.45;

      this.alpha -= 1.4;

      this.waterSize += 0.8;

      if (
        this.size <= 5 ||
        this.alpha <= 0
      ) {
        this.finished = true;
      }
    }


    // -----------------------------
    // HEAT 条件
    // -----------------------------

    if (!this.breaking) {

      let distanceToHeat = dist(
        this.x,
        this.y,
        heatX,
        heatY
      );

      if (
        distanceToHeat <
        heatSize / 2 + this.size / 3
      ) {

        this.melting = true;
      }
    }
  }


  display() {

    if (this.finished) {
      return;
    }


    // -----------------------------
    // 融化后的水
    // -----------------------------

    if (
      this.melting &&
      !this.breaking
    ) {

      noStroke();

      fill(
        120,
        190,
        210,
        min(this.alpha, 90)
      );

      ellipse(
        this.x,
        this.y +
        this.originalSize * 0.45,

        constrain(
          this.waterSize,
          10,
          this.originalSize * 1.3
        ),

        13
      );
    }


    push();

    translate(
      this.x,
      this.y
    );

    rotate(
      this.angle
    );

    rectMode(CENTER);


    // -----------------------------
    // 碎裂效果
    // -----------------------------

    if (this.breaking) {

      let gap =
        this.breakAmount;

      drawIcePiece(
        -gap,
        -gap,
        this.size * 0.40,
        this.alpha
      );

      drawIcePiece(
        gap,
        -gap * 0.6,
        this.size * 0.36,
        this.alpha
      );

      drawIcePiece(
        -gap * 0.6,
        gap,
        this.size * 0.34,
        this.alpha
      );

      drawIcePiece(
        gap,
        gap,
        this.size * 0.38,
        this.alpha
      );

    } else {

      // -----------------------------
      // 正常冰块
      // -----------------------------

      stroke(
        255,
        this.alpha
      );

      strokeWeight(3);

      fill(
        145,
        205,
        220,
        this.alpha
      );

      rect(
        0,
        0,
        this.size,
        this.size,
        11
      );


      // 高光
      noStroke();

      fill(
        255,
        255,
        255,
        this.alpha * 0.6
      );

      rect(
        -this.size * 0.17,
        -this.size * 0.22,

        this.size * 0.35,
        this.size * 0.07,

        4
      );

      rect(
        -this.size * 0.31,
        -this.size * 0.08,

        this.size * 0.07,
        this.size * 0.27,

        4
      );
    }

    pop();
  }


  contains(px, py) {

    return (
      px >
      this.x - this.size / 2 &&

      px <
      this.x + this.size / 2 &&

      py >
      this.y - this.size / 2 &&

      py <
      this.y + this.size / 2
    );
  }
}


// =====================================
// ICE PIECES
// =====================================

function drawIcePiece(
  x,
  y,
  size,
  alphaValue
) {

  stroke(
    255,
    alphaValue
  );

  strokeWeight(2);

  fill(
    120,
    185,
    205,
    alphaValue
  );

  rect(
    x,
    y,
    size,
    size,
    5
  );
}


// =====================================
// 自动生成新的冰块
// =====================================

function spawnNewIce() {

  let newX;
  let newY;

  let safePosition = false;

  // 尽量避免直接生成在 HEAT 里面
  while (!safePosition) {

    newX = random(
      100,
      width - 100
    );

    newY = random(
      140,
      height * 0.57
    );

    let d = dist(
      newX,
      newY,
      heatX,
      heatY
    );

    if (
      d >
      heatSize / 2 + 100
    ) {
      safePosition = true;
    }
  }

  let newSize = random(
    70,
    105
  );

  let newAngle = random(
    -0.15,
    0.15
  );

  ices.push(
    new Ice(
      newX,
      newY,
      newSize,
      newAngle
    )
  );
}


// =====================================
// MOUSE PRESSED
// =====================================

function mousePressed() {

  for (
    let i =
      ices.length - 1;

    i >= 0;

    i--
  ) {

    let ice =
      ices[i];

    if (
      !ice.finished &&
      !ice.breaking &&
      ice.contains(
        mouseX,
        mouseY
      )
    ) {

      selectedIce =
        ice;

      pressStart =
        millis();

      startMouseX =
        mouseX;

      startMouseY =
        mouseY;

      isDragging =
        false;

      ice.offsetX =
        mouseX -
        ice.x;

      ice.offsetY =
        mouseY -
        ice.y;

      break;
    }
  }

  return false;
}


// =====================================
// DRAG
// =====================================

function mouseDragged() {

  if (
    selectedIce &&
    !selectedIce.finished
  ) {

    let movedDistance =
      dist(
        mouseX,
        mouseY,
        startMouseX,
        startMouseY
      );

    // 移动超过 8px 才算拖动
    if (
      movedDistance > 8
    ) {
      isDragging = true;
    }


    if (isDragging) {

      selectedIce.x =
        mouseX -
        selectedIce.offsetX;

      selectedIce.y =
        mouseY -
        selectedIce.offsetY;


      selectedIce.x =
        constrain(
          selectedIce.x,

          selectedIce.size / 2,

          width -
          selectedIce.size / 2
        );


      selectedIce.y =
        constrain(
          selectedIce.y,

          selectedIce.size / 2,

          height -
          selectedIce.size / 2
        );
    }
  }

  return false;
}


// =====================================
// LONG PRESS
// =====================================

function checkLongPress() {

  if (
    selectedIce &&
    mouseIsPressed &&
    !isDragging &&
    !selectedIce.breaking
  ) {

    let pressTime =
      millis() -
      pressStart;


    // 长按超过 0.6 秒
    if (
      pressTime > 600
    ) {

      selectedIce.melting =
        true;
    }
  }
}


// =====================================
// RELEASE
// =====================================

function mouseReleased() {

  if (selectedIce) {

    let pressTime =
      millis() -
      pressStart;


    // -----------------------------
    // 短按 = TAP
    // -----------------------------

    if (
      !isDragging &&
      pressTime < 600 &&
      !selectedIce.melting
    ) {

      selectedIce.breaking =
        true;
    }
  }


  selectedIce = null;

  isDragging = false;

  return false;
}


// =====================================
// RESIZE
// =====================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  heatX =
    width * 0.82;

  heatY =
    height * 0.78;
}