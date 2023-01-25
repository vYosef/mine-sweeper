const MINE = '*'
const EMPTY = ' '

var gBoard

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = { 
    isOn: true, 
    shownCount: 0, 
    markedCount: 0, 
    secsPassed: 0 
}

function onInit() {
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    // console.log(gBoard)
    renderBoard(gBoard)
    // console.log(gBoard[2][1])
    // console.log(countNegs(gBoard, 1, 2))
} //starts the game

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        var row = []
        for (var j = 0; j < gLevel.size; j++) {
            row.push({ 
                minesAroundCount: 0, 
                isShown: false, 
                isMine: false, 
                isMarked: false 
            })
        }
        board.push(row)
    }
    var randIArr = []
    var randJArr = []
    for(var i = 0; i < gLevel.size; i++) {
        randIArr.push(i)
        randJArr.push(i)
    }
    for(var i = 0; i < gLevel.mines; i++) {
        randI = getRandNum(randIArr)
        randJ = getRandNum(randJArr)
        console.log(randI, randJ)
        console.log(board)
        board[randI][randJ].isMine = true
    }
    // board[1][1].isMine = true
    // board[2][2].isMine = true
    return board
}//sets the game board
// && board[i][j].isShown
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += "<tr>"
        for (var j = 0; j < board[0].length; j++) {
        var mine = board[i][j].isMine && board[i][j].isShown ? MINE : EMPTY
        var NegMinecountShows = board[i][j].isShown && !gBoard[i][j].isMine? board[i][j].minesAroundCount : EMPTY
        strHTML += `<td onClick="onCellClicked(this, ${i}, ${j})">${mine}${NegMinecountShows}</td>`
      }
      strHTML += "</tr>"
    }
    var gameBoard = document.querySelector('tbody')
    gameBoard.innerHTML = strHTML
}//creates the game DOM

function setMinesNegsCount(board) {
    var cellNegCount = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            cellNegCount = countNegs(board, i, j)
            board[i][j].minesAroundCount = cellNegCount
        }
    }
}//sets each cells mine count by checking around it

function countNegs(board, rowIdx, colIdx) {
    var negCount = 0
    for(var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for(var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (j === colIdx && i === rowIdx) continue
            if (board[i][j].isMine) negCount++
        }
    }
    return negCount
}//neighbor loop for specific cell

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isMine) gGame.isOn = false
    gBoard[i][j].isShown = true
    renderBoard(gBoard)
}// handles cell clicks

function onCellMarked(elCell) {

}// handles cell right clicks

function checkGameOver() {

} //Game ends when all mines are marked, and all the other cells are shown

function expandShown(board, elCell, i, j) {

} //opens multipli cells on click if there no mines in the neighbors


// ${mine}${board[i][j].minesAroundCount}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandNum(arr) {
    var randNum = getRandomIntInclusive(0, arr.length - 1)
    var numArr = arr.splice(randNum, 1)
    return numArr[0]
}