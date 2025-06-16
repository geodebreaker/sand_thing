let SIZE;
let grid;
const T = {
  air: 0,
  sand: 1,
  water: 2,
  wall: 3,
};
let brush = T.sand;

let acc = 0;
let tickspeed = 0.1;

function setup() {
  createCanvas(innerWidth, innerHeight);
  resizeGrid(25);
}

function resizeGrid(ns) {
  SIZE = ns;
  grid = [];
  for (let i = 0; i < SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < SIZE; j++)
      grid[i][j] = 0;
  }
  grid[3][6] = T.sand;
}

function draw() {
  background(220);
  let cw = width / SIZE;
  let ch = height / SIZE;

  if (mouseIsPressed) {
    let cw = width / SIZE;
    let ch = height / SIZE;
    let x = Math.floor(mouseX / cw);
    let y = Math.floor(mouseY / ch);
    grid[x][y] = state;
  }

  acc += deltaTime / 1e3;
  if (acc > tickspeed) {
    tick();
    acc = acc % tickspeed;
  }

  grid.forEach((col, i) => {
    col.forEach((cell, j) => {
      noFill();
      stroke(180);
      strokeWeight(1);
      rect(i * cw, j * ch, cw, ch);
      if (cell) {
        if (cell == T.sand) fill(255, 255, 0);
        if (cell == T.water) fill(0, 0, 255);
        if (cell == T.wall) fill(128, 128, 128);
        noStroke();
        rect(i * cw, j * ch, cw, ch);
      }
    });
  });

  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(18);
  text('brush: ' + Object.entries(T).find(x => x[1] == brush)?.[0] +
    '\n' + Object.entries(T).map(x => '[' + (x[1] + 1) + '] ' + x[0]).join('\n'), 5, 20);
}

function tick() {
  let ng = grid.map(x => x.slice());
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++) {
    if (grid[i][j] == T.sand) if (!checkSquare(i, j + 1) || grid[i]?.[j + 1] == T.water) {
      swapSquares(i, j, i, j + 1, ng);
    } else {
      let p = [
        !checkSquare(i - 1, j + 1) || grid[i - 1]?.[j + 1] == T.water,
        !checkSquare(i + 1, j + 1) || grid[i + 1]?.[j + 1] == T.water
      ];
      let a = Math.random() > 0.5 ? 1 : 0;
      let b = 1 - a;
      if (p[a]) swapSquares(i, j, i + (a ? 1 : -1), j + 1, ng);
      else if (p[b]) swapSquares(i, j, i + (b ? 1 : -1), j + 1, ng);
    }

    if (grid[i][j] == T.water) if (!checkSquare(i, j + 1)) {
      swapSquares(i, j, i, j + 1, ng);
    } else {
      let p1 = [!checkSquare(i - 1, j + 1), !checkSquare(i + 1, j + 1)];
      let p2 = [!checkSquare(i - 1, j), !checkSquare(i + 1, j)];
      let a = Math.random() > 0.5 ? 1 : 0;
      let b = 1 - a;
      if (p1[a]) swapSquares(i, j, i + (a ? 1 : -1), j + 1, ng);
      else if (p1[b]) swapSquares(i, j, i + (b ? 1 : -1), j + 1, ng);
      else if (p2[a]) swapSquares(i, j, i + (a ? 1 : -1), j, ng);
      else if (p2[b]) swapSquares(i, j, i + (b ? 1 : -1), j, ng);
    }
  }
  grid = ng;
}

function checkSquare(x, y) {
  return !(
    x < SIZE && x >= 0 &&
    y < SIZE && y >= 0 &&
    grid[x][y] == T.air
  );
}

function swapSquares(x1, y1, x2, y2, ng = grid) {
  [ng[x1][y1], ng[x2][y2]] = [ng[x2][y2], ng[x1][y1]];
}

let state = T.air;

function mousePressed() {
  let cw = width / SIZE;
  let ch = height / SIZE;
  let x = Math.floor(mouseX / cw);
  let y = Math.floor(mouseY / ch);
  state = grid[x][y] != brush ? brush : T.air;
  grid[x][y] = state;
}

window.onresize = () => {
  resizeCanvas(innerWidth, innerHeight);
}

function keyPressed() {
  if (Object.entries(T).find(x => x[1] == parseInt(key) - 1))
    brush = parseInt(key) - 1;
}