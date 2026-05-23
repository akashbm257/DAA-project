const rows = 20;
const cols = 20;
const gridElement = document.getElementById("grid");

let grid = [];
let startNode = null;
let endNode = null;
let mode = "wall";

// Create Grid
for (let r = 0; r < rows; r++) {
  let row = [];

  for (let c = 0; c < cols; c++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = r;
    cell.dataset.col = c;

    gridElement.appendChild(cell);

    const node = {
      row: r,
      col: c,
      distance: Infinity,
      isWall: false,
      visited: false,
      previous: null,
      element: cell,
    };

    row.push(node);

    cell.addEventListener("click", () => handleCellClick(node));
  }

  grid.push(row);
}

// Button Modes

document.getElementById("startBtn").onclick = () => {
  mode = "start";
};

document.getElementById("endBtn").onclick = () => {
  mode = "end";
};

document.getElementById("wallBtn").onclick = () => {
  mode = "wall";
};

// Reset Grid

document.getElementById("resetBtn").onclick = () => {
  location.reload();
};

// Handle Click
function handleCellClick(node) {
  if (mode === "start") {
    if (startNode) {
      startNode.element.classList.remove("start");
    }

    startNode = node;
    node.element.classList.add("start");
  }

  else if (mode === "end") {
    if (endNode) {
      endNode.element.classList.remove("end");
    }

    endNode = node;
    node.element.classList.add("end");
  }

  else if (mode === "wall") {
    if (node !== startNode && node !== endNode) {
      node.isWall = !node.isWall;
      node.element.classList.toggle("wall");
    }
  }
}

// Visualize Button

document.getElementById("visualizeBtn").onclick = async () => {
  if (!startNode || !endNode) {
    alert("Please select start and end nodes");
    return;
  }

  await dijkstra(startNode, endNode);
};

// Dijkstra Algorithm

async function dijkstra(start, end) {
  start.distance = 0;

  const unvisited = [];

  for (let row of grid) {
    for (let node of row) {
      unvisited.push(node);
    }
  }

  while (unvisited.length > 0) {
    unvisited.sort((a, b) => a.distance - b.distance);

    const closest = unvisited.shift();

    if (closest.isWall) continue;

    if (closest.distance === Infinity) break;

    closest.visited = true;

    if (closest !== start && closest !== end) {
      closest.element.classList.add("visited");
    }

    await sleep(20);

    if (closest === end) {
      drawPath(end);
      return;
    }

    const neighbors = getNeighbors(closest);

    for (let neighbor of neighbors) {
      if (!neighbor.visited && !neighbor.isWall) {
        let newDistance = closest.distance + 1;

        if (newDistance < neighbor.distance) {
          neighbor.distance = newDistance;
          neighbor.previous = closest;
        }
      }
    }
  }
}

// Get Neighbors
function getNeighbors(node) {
  const neighbors = [];
  const { row, col } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);

  return neighbors;
}

// Draw Final Path
async function drawPath(endNode) {
  let current = endNode.previous;

  while (current && current !== startNode) {
    current.element.classList.remove("visited");
    current.element.classList.add("path");

    current = current.previous;

    await sleep(40);
  }
}

// Delay Function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}