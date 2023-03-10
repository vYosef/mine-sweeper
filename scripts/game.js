'use strict'

//various global const variables:
const MINE = '✳️'
const EMPTY = ' '
const MARKED = '#'

const HINT = '✴️'

const SMILEY = '😊'
const SADSMILEY = '😞'
const VICTORYSMILEY = '😎'

// global objects and data structure
var gLevel = {
    size: 4,
    mines: 2,
    manualMode: false,
    safeClickIsOn: false,
    safeClicks: 3,
    megaHints: 1,
    megaHintIsOn: false,
    megaHint1: null,
    megaHint2: null
}

var gGame = { 
    isOn: false, 
    isClicked: false, 
    shownCount: 0, 
    markedCount: 0, 
    secsPassed: 0 ,
    flagCount: gLevel.mines,
    lives: 3,
    hints: 3,
    hintIsActive: false
}

// global variables:
var gBoard
var gInterval
var gTimer = document.querySelector('.timer') 

var gflagCounter =  document.querySelector('.flagged-mine-counter') 

localStorage.easyScore = Infinity
localStorage.mediumScore = Infinity
localStorage.hardScore = Infinity

function onInit() {
    gGame.isOn = true
    setSmileyButton()
    setEndGameModal()
    renderScore()
    gGame.isClicked = false
    gGame.shownCount = 0, 
    gGame.markedCount = 0, 
    gGame.secsPassed = 0 
    resetMines()
    gGame.flagCount = gLevel.mines
    gGame.lives = 3
    gGame.hints = 3
    gLevel.safeClicks = 3
    gLevel.megaHints = 1
    gLevel.megaHint1 = null
    gLevel.megaHint2 = null
    renderLifeCounter()
    renderHints()
    renderSafeSpan()
    clearInterval(gInterval)
    renderTimer()
    renderflagCounter()
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
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
    return board
}//sets the game board

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
    if (gBoard[i][j].isShown) return
    if (gLevel.megaHintIsOn) {
        if (gLevel.megaHint1 === null) {
            gLevel.megaHint1 = {i, j}
            console.log(gLevel.megaHint1)
            return
        }
        if (gLevel.megaHint1 !== null) {
            gLevel.megaHint2 = {i, j}
            console.log(gLevel.megaHint2)
            if (gLevel.megaHint2.i < gLevel.megaHint1.i || gLevel.megaHint2.j < gLevel.megaHint1.j
                || gLevel.megaHint2.i === gLevel.megaHint1.i && gLevel.megaHint2.j === gLevel.megaHint1.j) return
            for(var k = gLevel.megaHint1.i; k < gLevel.megaHint2.i; k++) {
                for(var l = gLevel.megaHint1.j; l < gLevel.megaHint2.j; l++) {
                    if(gBoard[k][l].isShown) {
                        gBoard[k][l].isRevealed = true
                    }
                    gBoard[k][l].isShown = true
                }
            }
            renderBoard(gBoard)
            setTimeout(() => {
                for(var k = gLevel.megaHint1.i; k < gLevel.megaHint2.i; k++) {
                    for(var l = gLevel.megaHint1.j; l < gLevel.megaHint2.j; l++) {
                        if(gBoard[k][l].isRevealed) continue
                        gBoard[k][l].isShown = false
                    }
                }
                renderBoard(gBoard)
                gLevel.megaHints--
            }, 2000);
            gLevel.megaHintIsOn = false
        }
        return
    }
    if (gLevel.safeClickIsOn) {
        gLevel.safeClicks--
        var safeCellCount = 0
        var randI = 0
        var randJ = 0      
        while(safeCellCount < 1) {
            randI = getRandomIntInclusive(0, gBoard.length - 1)
            randJ = getRandomIntInclusive(0, gBoard[0].length - 1)
            if (gBoard[randI][randJ].isMine) continue
            if (gBoard[randI][randJ].isShown) gBoard[randI][randJ].alreadyRevealed = true
            if (gBoard[randI][randJ].isMarked) continue
            gBoard[randI][randJ].isShown = true
            safeCellCount++
            console.log(safeCellCount)
        }
        renderBoard(gBoard)
        setTimeout(() => {
            if (gBoard[randI][randJ].alreadyRevealed) return
            gBoard[randI][randJ].isShown = false
            renderBoard(gBoard)
        }, 2000);
        gLevel.safeClickIsOn = false
        renderSafeSpan()
        return
    }
    if (gLevel.manualMode) {
        if (gBoard[i][j].isMine) return
        gBoard[i][j].isMine = true
        gLevel.mines++
        gBoard[i][j].isShown = true
        renderBoard(gBoard)
        setTimeout(() =>{
            gBoard[i][j].isShown = false
            renderBoard(gBoard)
        }, 1000)
        return
    }
    if (!gGame.isClicked) {
        placeMines(gBoard, i, j)
        startTimer()
        // console.log(gGame.isClicked)
        gGame.isClicked = true
    }
    if (gGame.hintIsActive) {
        var elHintBtn = document.querySelector('.hint-button')
        // console.log(gGame.hints)
        // gBoard[i][j].isShown = true
        expandShown(gBoard, elCell, i, j, true)
        renderBoard(gBoard)
        setTimeout(() => {
            expandShown(gBoard, elCell, i, j, false)
            // gBoard[i][j].isShown = false
            renderBoard(gBoard)
        }, 1000);
        gGame.hintIsActive = false
        elHintBtn.classList.toggle('non-clickable')
        renderHints(gGame.hints)
        // console.log(gGame.hintIsActive)
        return
    }
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    if (gBoard[i][j].isMine) {
        gGame.lives--
        gBoard[i][j].isShown = false
        renderLifeCounter()
        flashRed(elCell)
        if (gGame.lives === 0) {
            gGame.isOn = false
            renderLifeCounter()
            loseGame()
        }
        return
    }
    var negCount = countNegs(gBoard, i, j)
    if (negCount !== 0 && !gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true
        if (gGame.shownCount < gBoard.length ** 2 - gLevel.mines) gGame.shownCount++
        renderBoard(gBoard)
    } else {
        expandShown(gBoard, elCell,i, j, true)
    }
    renderLifeCounter()
}// handles cell clicks and all relevant events

function loseGame() {
    gGame.isOn = false
    clearInterval(gInterval)
    setEndGameModal()
    setSmileyButton()
    renderBoard(gBoard)
}//calls various functions when game is lost

function onCellMarked(elCell, i , j) {
    console.log('hi')
    // console.log(gBoard[i][j])
    if (gBoard[i][j].isShown) return
    // gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    if(!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        gGame.flagCount--
        renderflagCounter()
        // console.log(gGame.markedCount)
    } else {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        gGame.flagCount++
        renderflagCounter()
        // console.log(gGame.markedCount)
    }
    renderBoard(gBoard)
}// handles cell right clicks

function checkGameOver() {
    if (gGame.markedCount === gLevel.mines 
        && gGame.shownCount === (gBoard.length ** 2 - gLevel.mines)) {
            clearInterval(gInterval)
            gGame.isOn = false
            // console.log('you win')
            setEndGameModal()
            setSmileyButton()
            if (gLevel.size === 4 && gGame.secsPassed < localStorage.easyScore) localStorage.easyScore = gGame.secsPassed
            if (gLevel.size === 8 && gGame.secsPassed < localStorage.mediumScore) localStorage.mediumScore = gGame.secsPassed
            if (gLevel.size === 12 && gGame.secsPassed < localStorage.hardScore) localStorage.hardScore = gGame.secsPassed
    } else {
        return
    }
} //Game ends in victory when all mines are marked, and all the other cells are shown

function expandShown(board, elCell, i, j , isShowCells) {
    var toggleCells = isShowCells ? true : false
    for(var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= board.length) continue
        for(var l = j - 1; l <= j + 1; l++) {
            if (l < 0 || l >= board[0].length) continue
            if (gBoard[k][l].isMarked) onCellMarked(elCell, k, l)
            board[k][l].isShown = toggleCells
            if (gBoard[k][l].isShown && toggleCells === false) gBoard[k][l].isShown = true
            countShownCells(board)
        }
    }
    renderBoard(gBoard)
} //opens multiple cells on click if there no mines in the neighbors

function countShownCells(board) {
    var count = 0
    for(var i = 0; i< board.length; i++) {
        for(var j = 0; j < board[0].length; j++) {
            if (board[i][j].isShown) count++
        }
    }
    gGame.shownCount = count
}//returns a count of revealed cells around each cell in the board

function giveHint(elBtn) {
    if (gGame.hints === 0) return
    gGame.hints--
    renderHints()
    gGame.hintIsActive = true
    elBtn.classList.toggle('non-clickable')
}//activates the global variable allowing the player to get a hint

function megaHint(elBtn) {
    if (gLevel.megaHints === 0) return
    if (!gGame.isClicked) {
        elBtn.innerText = 'press a cell first'
        setTimeout(() => {
            elBtn.innerText = 'mega hint'
        }, 1000);
        return
    }
    gLevel.megaHintIsOn = true
}// activates the mega hint for the level








