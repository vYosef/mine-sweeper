const MINE = '*'
const EMPTY = ' '
const MARKED = '!'

const SMILEY = '😊'
const SADSMILEY = '😞'
const VICTORYSMILEY = '😎'

var gBoard

var gLevel = {
    size: 4,
    mines: 2
}

var gGame = { 
    isOn: false, 
    isClicked: false, 
    shownCount: 0, 
    markedCount: 0, 
    secsPassed: 0 ,
    flagCount: gLevel.mines,
    lives: 3
}

var gInterval
var gTimer = document.querySelector('.timer') 

var gflagCounter =  document.querySelector('.flagged-mine-counter') 

function onInit() {
    gGame.isOn = true
    setSmileyButton()
    setEndGameModal()
    gGame.isClicked = false
    gGame.shownCount = 0, 
    gGame.markedCount = 0, 
    gGame.secsPassed = 0 
    gGame.flagCount = gLevel.mines
    gGame.lives = 3
    renderLifeCounter()
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
    
    // board[1][1].isMine = true
    // board[2][2].isMine = true
    return board
}//sets the game board
// && board[i][j].isShown
// && !gBoard[i][j].isMine
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += "<tr>"
        for (var j = 0; j < board[0].length; j++) {
        var mine = board[i][j].isMine && board[i][j].isShown && gGame.lives === 0 || board[i][j].isMine && !gGame.isOn ? MINE : EMPTY
        var negMinecountShows = board[i][j].isShown && !gBoard[i][j].isMine && gBoard[i][j].minesAroundCount !== 0 ? board[i][j].minesAroundCount : EMPTY
        var mark = board[i][j].isMarked ? MARKED : EMPTY
        var color = board[i][j].minesAroundCount === 0 && board[i][j].isShown ? 'zero-cell' : 'non-zero-cell'
        strHTML += `<td class="${color}" onClick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j});return false;">${mine}${negMinecountShows}${mark}</td>`
      }
      strHTML += "</tr>"
    }
    var elGameBoard = document.querySelector('tbody')
    elGameBoard.innerHTML = strHTML
    checkGameOver()
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
    if (!gGame.isClicked) {
        placeMines(gBoard, i, j)
        startTimer()
        // console.log(gGame.isClicked)
        gGame.isClicked = true
    }
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    if (gBoard[i][j].isMine) {
        gGame.lives--
        gBoard[i][j].isShown = false
        renderLifeCounter()
        flashRed()
        if (gGame.lives === 0) {
            renderLifeCounter()
            loseGame()
        }
        return
    }
    var negCount = countNegs(gBoard, i, j)
    if (negCount !== 0) {
        gBoard[i][j].isShown = true
        gGame.shownCount++
        renderBoard(gBoard)
    } else {
        expandShown(gBoard, elCell,i, j)
    }
    renderLifeCounter()
    // console.log(gGame)
    // expandShown(gBoard, elCell, i, j)
    // gBoard[i][j].isShown = true
    // renderBoard(gBoard)
}// handles cell clicks

function loseGame() {
    gGame.isOn = false
    clearInterval(gInterval)
    // console.log('you lose')
    setEndGameModal()
    setSmileyButton()
}

function onCellMarked(elCell, i , j) {
    // console.log('hi')
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
    // console.log(gGame)
    // console.log('markedCount', gGame.markedCount)
    // console.log('mines', gLevel.mines)
    // console.log('shownCount', gGame.shownCount)
    // console.log(gBoard.length ** 2 - gLevel.mines)
    if (gGame.markedCount === gLevel.mines 
        && gGame.shownCount === (gBoard.length ** 2 - gLevel.mines)) {
            clearInterval(gInterval)
            gGame.isOn = false
            console.log('you win')
            setEndGameModal()
            setSmileyButton()
    } else {
        return
    }
} //Game ends when all mines are marked, and all the other cells are shown

function expandShown(board, elCell, i, j) {
    for(var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= board.length) continue
        for(var l = j - 1; l <= j + 1; l++) {
            if (l < 0 || l >= board[0].length) continue
            board[k][l].isShown = true
            countShownCells(board)
        }
    }
    renderBoard(gBoard)
} //opens multiple cells on click if there no mines in the neighbors

function setDifficulty(elBtn) {
    if (elBtn.innerText === 'easy') {
        gLevel.size = 4
        gLevel.mines = 2
        onInit()
    }
    if (elBtn.innerText === 'medium') {
        gLevel.size = 8
        gLevel.mines = 14
        onInit()
    }
    if (elBtn.innerText === 'hard') {
        gLevel.size = 12
        gLevel.mines = 32
        onInit()
    }
}

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
    // renderBoard(board)
}

function countShownCells(board) {
    var count = 0
    for(var i = 0; i< board.length; i++) {
        for(var j = 0; j < board[0].length; j++) {
            if (board[i][j].isShown) count++
        }
    }
    gGame.shownCount = count
}

function setEndGameModal() {
    // console.log('hi')
    var elEndGameModal = document.querySelector('.end-game-modal')
    var elEndGameSpan = elEndGameModal.querySelector('span')
    // console.log(endGameModal)
    if (!gGame.isOn) {
        elEndGameModal.style.display = 'block'
        console.log(gGame.flagCount, gLevel.mines, gGame.flagCount !== gLevel.mines)
        if (gGame.flagCount === 0) elEndGameSpan.innerText = 'you win'
        else elEndGameSpan.innerText= 'you lose'
    }
    else elEndGameModal.style.display = 'none'
}

function renderflagCounter() {
    gflagCounter.innerText = gGame.flagCount
}

function renderLifeCounter() {
    var elLifeCounter = document.querySelector('.life-counter')
    elLifeCounter.innerText = gGame.lives
}

function setSmileyButton() {
    var elSmiletBtn = document.querySelector('.smiley-button')
    if (gGame.isOn) elSmiletBtn.innerText = SMILEY
    else if (gGame.flagCount === 0) elSmiletBtn.innerText = VICTORYSMILEY
    else elSmiletBtn.innerText = SADSMILEY
}

function flashRed() {
    var elSpan = document.querySelector('.life-counter')
    elSpan.classList.toggle('red') 
    setTimeout(() => {elSpan.classList.toggle('red')}, 300)
}

function darkModeToggle(elBtn) {
    var elBody = document.querySelector('body')
    var allText = document.querySelector('*')
    elBody.classList.toggle('dark-mode')
    allText.classList.toggle('dark-mode-text')
    elBtn.innerText = elBtn.innerText === 'Dark Mode' ? 'Regular Lighting' : 'Dark Mode'
}

function renderTimer() {
    gTimer.innerText = gGame.secsPassed
}

function startTimer() {
    var sec = 1;
    gInterval = setInterval(function(){
        gGame.secsPassed=''+sec;
        gTimer.innerText = gGame.secsPassed
        sec++;
    }, 1000);
}





function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandNum(arr) {
    var randNum = getRandomIntInclusive(0, arr.length - 1)
    var numArr = arr.splice(randNum, 1)
    return numArr[0]
}
