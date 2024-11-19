const gridSize = 4;
const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
let grid = [];
let score = 0;

function initGame() {
	grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
	score = 0;
	scoreDisplay.textContent = score;
	renderGrid();
	spawnTile();
	spawnTile();
}

function renderGrid() {
	gridContainer.innerHTML = '';
	grid.forEach(row => {
		row.forEach(cell => {
			const cellDiv = document.createElement('div');
			cellDiv.className = `grid-cell tile-${cell}`;
			cellDiv.textContent = cell !== 0 ? cell : '';
			gridContainer.appendChild(cellDiv);
		});
	});
}

function spawnTile() {
	const emptyCells = [];
	grid.forEach((row, rIndex) => {
		row.forEach((cell, cIndex) => {
			if (cell === 0)
				emptyCells.push({ rIndex, cIndex });
		});
	});

	if (emptyCells.length > 0) {
		const { rIndex, cIndex } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
		grid[rIndex][cIndex] = Math.random() < 0.9 ? 2 : 4;
	}

	if (checkGameOver()) {
		return;
	}

	renderGrid();
}

function slideRow(row) {
	const filteredRow = row.filter(cell => cell !== 0); // Eliminar ceros
	const newRow = [];

	while (filteredRow.length > 0) {
		if (filteredRow.length > 1 && filteredRow[0] === filteredRow[1]) {
			newRow.push(filteredRow[0] * 2);
			score += filteredRow[0] * 2;
			filteredRow.splice(0, 2);
		}
		else {
			newRow.push(filteredRow.shift());
		}
	}

	while (newRow.length < gridSize) newRow.push(0); // Rellenar con ceros
	return newRow;
}

function slideGrid(direction) {
	let rotated = false;
	let flipped = false;

	if (direction === 'up' || direction === 'down') {
		grid = transposeGrid(grid);
		rotated = true;
	}

	if (direction === 'right' || direction === 'down') {
		grid = grid.map(row => row.reverse());
		flipped = true;
	}

	let newGrid = grid.map(slideRow);

	if (flipped) {
		newGrid.forEach((row, i) => newGrid[i] = row.reverse());
	}

	if (rotated) {
		newGrid = transposeGrid(newGrid);
	}

	if (JSON.stringify(grid) !== JSON.stringify(newGrid)) {
		grid = newGrid;
		spawnTile();
	}
	renderGrid();
	scoreDisplay.textContent = score;
}

function transposeGrid(matrix) {
	return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function checkGameOver() {
	for (let row of grid) {
		if (row.includes(0)) {
			return false;
		}
	}

	for (let r = 0; r < gridSize; r++) {
		for (let c = 0; c < gridSize; c++) {
			if (
				(r > 0 && grid[r][c] === grid[r - 1][c]) ||
				(r < gridSize - 1 && grid[r][c] === grid[r + 1][c]) ||
				(c > 0 && grid[r][c] === grid[r][c - 1]) ||
				(c < gridSize - 1 && grid[r][c] === grid[r][c + 1])
			) {
				return false;
			}
		}
	}

	alert("Game Over! Your score: " + score);
	initGame();
	return true;
}

function checkWin() {
	for (let row of grid) {
		if (row.includes(2048)) {
			if (confirm("You've won! Continue playing?")) {
				return false;
			}
			else {
				initGame();
				return true;
			}
		}
	}
	return false;
}

function handleKey(e) {
	switch (e.key) {
		case 'ArrowUp':
			slideGrid('up');
			break;
		case 'ArrowDown':
			slideGrid('down');
			break;
		case 'ArrowLeft':
			slideGrid('left');
			break;
		case 'ArrowRight':
			slideGrid('right');
			break;
	}
}

restartBtn.addEventListener('click', initGame);
document.addEventListener('keydown', handleKey);

initGame();
