var size = 4;
var htmlElements;
var cells;
var score;

function generateField() {
  if (htmlElements) return;
  htmlElements = [];
  var table = document.getElementById('field');
  for (var y = 0; y < size; y++) {
    var tableRow = document.createElement('tr');
    var trElements = [];
    for (var x = 0; x < size; x++) {
      var tableData = document.createElement('td');
      tableData.setAttribute('class', 'cell');
      tableRow.appendChild(tableData);
      trElements.push(tableData);
    }
    htmlElements.push(trElements);
    table.appendChild(tableRow);
  }
  console.log(htmlElements);
}

function generateCells() {
  cells = [];
  for (var x = 0; x < size; x++) {
    cells.push(new Array(size).fill(0));
  }
}

function generateInEmptyCell() {
  var x, y;
  while (true) {
    x = Math.floor(Math.random() * size);
    y = Math.floor(Math.random() * size);
    if (cells[x][y] == 0) {
      cells[x][y] = Math.random() >= 0.8 ? 4 : 2;
      break;
    }
  }
}

function show() {
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      var tableData = htmlElements[x][y];
      var sc = document.getElementById('score');
      console.log(score);
      sc.innerHTML = '<br>' + String(score);
      var v = cells[x][y];
      tableData.innerHTML = v == 0 ? '' : String(v);
      tableData.setAttribute('style', 'background-color: rgb(250 235 215 / ' + (100 - ((v/128)*100)) + '%)');
    }
  }
}

function shift(array, size) {
  function removeEmptyCells(arr) {
    return arr.filter(e => e != 0);
  }

  array = removeEmptyCells(array);
  if (array.length > 0) {
    for (var i = 0; i < array.length - 1; i++) {
      if (array[i] == array[i + 1]) {
        array[i] *= 2;
        array[i + 1] = 0;
      }
    }
  }
  array = removeEmptyCells(array);
  while (array.length < size) {
    array.push(0);
  }
  return array;
}

function shiftLeft() {
  var altered = false;
  for (var y = 0; y < size; y++) {
    var current = Array.from(cells[y]);
    cells[y] = shift(cells[y], size);
    altered = altered || (cells[y].join(',') != current.join(','));
  }
  return altered;
}

function swap(x1, y1, x2, y2) {
  var temp = cells[y1][x1];
  cells[y1][x1] = cells[y2][x2];
  cells[y2][x2] = temp;
}

function reflect() {
  for (var y = 0; y < size; y++) {
    for (var leftX = 0, rightX = size - 1; leftX < rightX; leftX++, rightX--) {
      swap(leftX, y, rightX, y);
    }
  }
}

function interchange() {
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < y; x++) {
      swap(x, y, y, x);
    }
  }
}

function slideLeft() {
  return shiftLeft();
}

function slideRight() {
  reflect();
  var altered = slideLeft();
  reflect();
  return altered;
}

function slideUp() {
  interchange();
  var altered = slideLeft();
  interchange();
  return altered;
}

function slideDown() {
  interchange();
  var altered = slideRight();
  interchange();
  return altered;
}

function isGameOver() {
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      if (cells[x][y] == 0) {
        return false;
      }
    }
  }
  return true;
}
function isGameWon() {
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      if (cells[x][y] == 128) {
        return true;
      }
    }
  }
  return false;
}
const handleKeyEvent = (event) => {
  var clicked;
  switch (event.code) {
    case 'ArrowUp': clicked = slideUp(); break;
    case 'ArrowDown': clicked = slideDown(); break;
    case 'ArrowLeft': clicked = slideLeft(); break;
    case 'ArrowRight': clicked = slideRight(); break;
    default: return;
  }
  if (clicked) {
    score++;
    generateInEmptyCell();
    show();
  }
  if (isGameOver()) {
    setTimeout(function () {
      alert('Game Over');
      init();
    }, 1000);
  }
  if (isGameWon()) {
    setTimeout(function () {
      alert('Game Won');
      init();
    }, 1000);
  }
}


function init() {
  score = 0;
  generateField();
  generateCells();
  generateInEmptyCell();
  generateInEmptyCell();
  generateInEmptyCell();
  console.log(cells);
  show();
  document.querySelector("body").addEventListener('keydown', handleKeyEvent);

}

init();