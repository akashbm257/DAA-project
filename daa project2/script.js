const rows = 20;
const cols = 25;

const gridElement = document.getElementById("grid");

let grid = [];
let startNode = null;
let endNode = null;
let currentMode = "wall";

// Create Grid
for (let r = 0; r < rows; r++) {

  let currentRow = [];

  for (let c = 0; c < cols; c++) {

    const cell = document.createElement("div");
    cell.classList.add("cell");

    gridElement.appendChild(cell);

    const node = {
      row: r,
      col: c,
      distance: Infinity,
      visited: false,
      isWall: false,
      previousNode: null,
      element: cell
    };

    currentRow.push(node);

    cell.addEventListener("click", () => {
      handleCellClick(node);
    });
  }

  grid.push(currentRow);
}

// Modes

document.getElementById("startBtn").onclick = () => {
  currentMode = "start";
};

document.getElementById("endBtn").onclick = () => {
  currentMode = "end";
};

document.getElementById("wallBtn").onclick = () => {
  currentMode = "wall";
};

// Clear

document.getElementById("clearBtn").onclick = () => {
  location.reload();
};

// Handle Click
function handleCellClick(node) {

  if (currentMode === "start") {

    if (startNode) {
      startNode.element.classList.remove("start");
    }

    startNode = node;
    node.element.classList.add("start");
  }

  else if (currentMode === "end") {

    if (endNode) {
      endNode.element.classList.remove("end");
    }

    endNode = node;
    node.element.classList.add("end");
  }

  else if (currentMode === "wall") {

    if (node !== startNode && node !== endNode) {
      node.isWall = !node.isWall;
      node.element.classList.toggle("wall");
    }
  }
}

// Visualize

document.getElementById("visualizeBtn").onclick = async () => {

  if (!startNode || !endNode) {
    alert("Select Start and End Nodes");
    return;
  }

  await dijkstra(startNode, endNode);
};

// Dijkstra Algorithm

async function dijkstra(start, end) {

  start.distance = 0;

  const unvisitedNodes = [];

  for (let row of grid) {
    for (let node of row) {
      unvisitedNodes.push(node);
    }
  }

  while (unvisitedNodes.length) {

    unvisitedNodes.sort((a, b) => a.distance - b.distance);

    const closestNode = unvisitedNodes.shift();

    if (closestNode.isWall) continue;

    if (closestNode.distance === Infinity) return;

    closestNode.visited = true;

    if (closestNode !== start && closestNode !== end) {
      closestNode.element.classList.add("visited");
    }

    await sleep(15);

    if (closestNode === end) {
      await drawShortestPath(end);
      return;
    }

    const neighbors = getNeighbors(closestNode);

    for (let neighbor of neighbors) {

      if (!neighbor.visited && !neighbor.isWall) {

        const distance = closestNode.distance + 1;

        if (distance < neighbor.distance) {
          neighbor.distance = distance;
          neighbor.previousNode = closestNode;
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

// Draw Path
async function drawShortestPath(endNode) {

  let currentNode = endNode.previousNode;

  while (currentNode && currentNode !== startNode) {

    currentNode.element.classList.remove("visited");
    currentNode.element.classList.add("path");

    currentNode = currentNode.previousNode;

    await sleep(40);
  }
}

// Delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}