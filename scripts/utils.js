'use strict'

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += "<tr>"
        for (var j = 0; j < board[0].length; j++) {
            var mine =  board[i][j].isMine && !gGame.isOn || board[i][j].isMine && board[i][j].isShown && gGame.hintIsActive || board[i][j].isMine && board[i][j].isShown && gLevel.manualMode ? MINE : EMPTY
            var negMinecountShows = board[i][j].isShown && !gBoard[i][j].isMine && gBoard[i][j].minesAroundCount !== 0 ? board[i][j].minesAroundCount : EMPTY
            var mark = board[i][j].isMarked && gGame.isOn ? MARKED : EMPTY
            var color = board[i][j].minesAroundCount === 0 && board[i][j].isShown ? 'zero-cell' : 'non-zero-cell'
            strHTML += `<td class="${color}" onClick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellMarked(this, ${i}, ${j});return false;">${mine}${negMinecountShows}${mark}</td>`
      }
      strHTML += "</tr>"
    }
    var elGameBoard = document.querySelector('tbody')
    elGameBoard.innerHTML = strHTML
    renderHints()
    checkGameOver()
}//creates the game DOM

function renderHints() {
    var elHint = document.querySelector('.hints')
    elHint.innerText = gGame.hints
    return
}// renders the amount of remainnig hints to the DOM

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}// gets random number

function getRandNum(arr) {
    var randNum = getRandomIntInclusive(0, arr.length - 1)
    var numArr = arr.splice(randNum, 1)
    return numArr[0]
}// gets random color

function renderTimer() {
    gTimer.innerText = gGame.secsPassed
}//renders the game time into the DOM

function startTimer() {
    var sec = 1;
    gInterval = setInterval(function(){
        gGame.secsPassed=''+sec;
        gTimer.innerText = gGame.secsPassed
        sec++;
    }, 1000);
}//runs the game timer

function renderflagCounter() {
    gflagCounter.innerText = gGame.flagCount
}// renders the flag counter to the DOM

function renderLifeCounter() {
    var elLifeCounter = document.querySelector('.life-counter')
    elLifeCounter.innerText = gGame.lives
}// renders the amount of remainnig lives to the DOM

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
}// remakes the board and restarts the game according to the chosen difficulty level