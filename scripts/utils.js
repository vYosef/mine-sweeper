// function createMat(ROWS, COLS) {
//     var mat = []
//     for (var i = 0; i < ROWS; i++) {
//         var row = []
//         for (var j = 0; j < COLS; j++) {
//             row.push('')
//         }
//         mat.push(row)
//     }
//     return mat
// }

// function getRandomIntInclusive(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
// }

// function getTime() {
//     return new Date().toString().split(" ")[4];
// }

// function renderBoard1(mat, selector) {
//     var strHTML = "<table><tbody>";
//     for (var i = 0; i < mat.length; i++) {
//       strHTML += "<tr>";
//       for (var j = 0; j < mat[0].length; j++) {
//         const cell = mat[i][j];
//         const className = `cell cell-${i}-${j}`;
  
//         strHTML += `<td class="${className}">${cell}</td>`;
//       }
//       strHTML += "</tr>";
//     }
//     strHTML += "</tbody></table>";
  
//     const elContainer = document.querySelector(selector);
//     elContainer.innerHTML = strHTML;
//   }
  
//   // location is an object like this - { i: 2, j: 7 }
//   function renderCell(location, value) {
//     // Select the elCell and set the value
//     const elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
//     elCell.innerHTML = value;
//   }
  
//   function getRandomIntInclusive(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }
  
//   function getRandomColor() {
//     var letters = "0123456789ABCDEF";
//     var color = "#";
//     for (var i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 14)];
//     }
//     return color;
//   }
  
//   function getEmptyCell(board) {
//     var emptyCellArr = [];
//     for (var i = 0; i < board.length; i++) {
//       for (var j = 0; j < board[0].length; j++) {
//         if (board[i][j] === EMPTY) emptyCellArr.push({ i, j });
//       }
//     }
//     if (emptyCellArr.length === 0) return
//     var randNum = getRandomIntInclusive(0, emptyCellArr.length - 1);
//     return emptyCellArr[randNum];
//   }

// function countNegs(board, rowIdx, colIdx) {
//     var negCount = 0
//     for(var i = rowIdx - 1; i < rowIdx + 1; i++) {
//         if (i < 0 || i >= board.length) continue
//         for(var j = colIdx - 1; j < colIdx + 1; j++) {
//             if (j < 0 || j >= board[0].length) continue
//             if (board[i][j].gameElement === BALL) negCount++
//         }
//     }
//     return negCount
// }

