const solvePuzzle = require('./solver');

// Esempio di clues (puoi cambiarli con altri test)
const clues = [
  0, 0, 1, 2, 0, 0,  // top
  0, 2, 0, 0, 0, 0,  // right
  0, 3, 0, 0, 0, 0,  // bottom
  0, 1, 0, 0, 0, 0   // left
];

const result = solvePuzzle(clues);
console.log("Solved puzzle:");
console.log(result.map(row => row.join(" ")).join("\n"));