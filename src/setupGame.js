let board;
let millisecond;
let sec = 0;
let blockSize;
let rows = 20;
let columns = 15;
let state;
let lose;
let score;
let searchKeeper;
let searchBoard;
let level;
let completed;
let colors = 3;
let paused = false;
let started = false;

function setup() {
  w = 400;
  createCanvas(w, w * (rows / columns));
  blockSize = width / columns;
  board = [];
  searchBoard = [];
  state = 0;
  lose = 0;
  score = 0;
  level = 5;
  searchKeeper = 0;
  init();
  drawBoard();
}

function draw() {
  if (!paused && started) {
    secon = floor((level * millis()) / 1000);
    if (secon - sec > 0) {
      sec = secon;
      advanceState();
    }
    if (lose != 0) {
      noLoop();
      textSize(48);
      stroke(0);
      strokeWeight(4);
      fill(300);
      textAlign(CENTER);
      text("Game over", width / 2, 150);
    } else if (completed >= rows * ((level + 5) / 5)) {
    init();
    level += 5;
    if (level / 5 % 5 == 0 && colors < 6) {
      colors++;
    }
  } 
  } else if (started) {
    textSize(24);
    stroke(0);
    strokeWeight(4);
    fill(255);
    textAlign(CENTER);
    text("Paused", width / 2, 150);
  } else {
    textSize(24);
    stroke(0);
    strokeWeight(4);
    fill(255);
    textAlign(CENTER);
    text("Space to START", width / 2, 150);
  }
}

function keyPressed() {
  switch (key) {
    case " ":
      if (!started) {
        started = true;
        drawBoard();
        return false;
      } else {
        paused = !paused;
        drawBoard();
        return false;
      }
  }
}

function mousePressed() {
  if (lose == 0 && !paused && started) {
    if (mouseY < (rows - 1) * blockSize) {
      search(floor(mouseY / blockSize), floor(mouseX / blockSize));
      if (searchKeeper >= 3) {
        del(floor(mouseY / blockSize), floor(mouseX / blockSize));
        score += ((level / 5) * (searchKeeper - 2) * (searchKeeper - 1)) / 2;
        collapse();
        drawBoard();
      }
    }
  }
}

function init() {
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    searchBoard[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i][j] = 0;
      searchBoard[i][j] = 0;
    }
  }
  completed = 0;
  for (let i = rows - 2; i > rows - 5; i--) {
    for (let j = 0; j < columns; j++) {
      board[i][j] = floor(1 + random(1) * colors);
    }
  }
}

function advanceState() {
  if (state == columns) {
    state = 0;
    advanceRow();
    drawBoard();
    completed++;
    print(completed);
  } else {
    board[rows - 1][state] = floor(1 + random(1) * colors);
    strokeWeight(2);
    stroke(255);
    drawRect(rows - 1, state, board[rows - 1][state]);
    state++;
  }
}

function advanceRow() {
  for (let j = 0; j < columns; j++) {
    lose += board[0][j];
  }
  for (let k = 0; k < rows - 1; k++) {
    board[k] = board[k + 1].slice();
  }
  for (let j = 0; j < columns; j++) {
    board[rows - 1][j] = 0;
  }
}

function drawBoard() {
  background(0);
  stroke(255);
  strokeWeight(2)
  line(0, (rows - 1) * blockSize, width, (rows - 1) * blockSize);
  strokeWeight(2);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (board[i][j] != 0) {
        drawRect(i, j, board[i][j]);
      }
    }
  }
  textSize(24);
  stroke(0);
  fill(255);
  textAlign(LEFT);
  text("Level: " + level / 5, 10, 30);
  textAlign(RIGHT);
  text("Score: " + score, width - 10, 30);
}

function drawRect(j, i, k) {
  switch (k) {
    case 1:
      fill(60, 179, 113);
      break;
    case 2:
      fill(106, 90, 205);
      break;
    case 3:
      fill(255, 165, 0);
      break;
    default:
      fill(200);
  }
  rect(i * blockSize, j * blockSize, blockSize, blockSize);
}
function search(i, j) {
  searchKeeper = 0;
  for (let k = 0; k < rows; k++) {
    searchBoard[k] = board[k].slice();
  }
  searchDel(i, j);
}

function searchDel(i, j) {
  if (searchBoard[i][j] != 0) {
    searchKeeper++;
    old = searchBoard[i][j];
    searchBoard[i][j] = 0;
    if (i > 0 && searchBoard[i - 1][j] == old) {
      searchDel(i - 1, j);
    }
    if (i < rows - 2 && searchBoard[i + 1][j] == old) {
      searchDel(i + 1, j);
    }
    if (j > 0 && searchBoard[i][j - 1] == old) {
      searchDel(i, j - 1);
    }
    if (j < columns - 1 && searchBoard[i][j + 1] == old) {
      searchDel(i, j + 1);
    }
  }
}

function del(i, j) {
  if (board[i][j] != 0) {
    old = board[i][j];
    board[i][j] = 0;
    if (i > 0 && board[i - 1][j] == old) {
      del(i - 1, j);
    }
    if (i < rows - 2 && board[i + 1][j] == old) {
      del(i + 1, j);
    }
    if (j > 0 && board[i][j - 1] == old) {
      del(i, j - 1);
    }
    if (j < columns - 1 && board[i][j + 1] == old) {
      del(i, j + 1);
    }
  }
}

function collapse() {
  for (var i = rows - 3; i >= 0; i--) {
    for (var j = 0; j < columns; j++) {
      var k = i;
      while (board[k + 1][j] == 0 && board[k][j] != 0 && k < rows - 2) {
        board[k + 1][j] = board[k][j];
        board[k][j] = 0;
        k++;
      }
    }
  }
}