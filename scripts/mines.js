// 'use strict'

function resetMines() {
    if (gLevel.size === 4) gLevel.mines = 2
    if (gLevel.size === 8) gLevel.mines = 14
    if (gLevel.size === 12) gLevel.mines = 32
}// resets the gLevel variable according to difficulty

function placeMines(board, rowIdx, colIdx) {
    // console.log(rowIdx, colIdx)
    var mineCount = 0
    var randI = 0
    var randJ= 0
    while (mineCount < gLevel.mines) {
        randI = getRandomIntInclusive(0, board.length - 1)
        randJ = getRandomIntInclusive(0, board[0].length - 1)
        if (randI === rowIdx && randJ === colIdx) continue
        if (board[randI][randJ].isMine) mineCount--
        board[randI][randJ].isMine = true
        mineCount++
    }
    setMinesNegsCount(board)
}// places andom mines on the board when called

function setMinesNegsCount(board) {
    var cellNegCount = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            cellNegCount = countNegs(board, i, j)
            board[i][j].minesAroundCount = cellNegCount
        }
    }
}//sets each cells mine count by checking around it

function placeMinesManually(elBtn) {
    if (!gLevel.manualMode){
        gLevel.manualMode = true
        elBtn.innerText = 'set mines'
        onInit()
        gGame.isClicked = true
        gLevel.mines = 0
        gGame.flagCount = gLevel.mines
        renderflagCounter()
        return
    }
    else {
        gLevel.manualMode = false
        elBtn.innerText = 'manual mine placement'
        // console.log(gLevel.manualMode)
        // gLevel.mines = 
        // console.log(gLevel.mines)
        gGame.flagCount = gLevel.mines
        renderflagCounter()
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        return
    }
}//allows the player to set mines manually, also updates global variables neede for it

function mineExterminator() {
    var elExterBtn = document.querySelector('.mine-exterminator')
    if (gLevel.mines < 3) {
        elExterBtn.innerText = 'doesnt work on easy mode'
        setTimeout(() => {
            elExterBtn.innerText = 'mine exterminator'
        }, 1000);
        return
    }
    if (!gGame.isClicked) {
        elExterBtn.innerText = 'press a cell first'
        setTimeout(() => {
            elExterBtn.innerText = 'mine exterminator'
        }, 1000);
        return
    }
    gLevel.mines -= 3
    gGame.flagCount = gLevel.mines
    var removedMineCount = 0
    while(removedMineCount < 3) {
        randI = getRandomIntInclusive(0, gBoard.length - 1)
        randJ = getRandomIntInclusive(0, gBoard[0].length - 1)
        if (gBoard[randI][randJ].isMine) gBoard[randI][randJ].isMine = false
        else continue
        removedMineCount++
    }
    renderflagCounter()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
}//removes 3 random mines and updates various global variables, doesnt work on easy mode