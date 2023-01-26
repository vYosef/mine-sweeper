'use strict'

function setEndGameModal() {
    // console.log('hi')
    var elEndGameModal = document.querySelector('.end-game-modal')
    var elEndGameSpan = elEndGameModal.querySelector('span')
    // console.log(endGameModal)
    if (!gGame.isOn) {
        elEndGameModal.style.display = 'block'
        // console.log(gGame.flagCount, gLevel.mines, gGame.flagCount !== gLevel.mines)
        if (gGame.flagCount === 0) elEndGameSpan.innerText = 'you win'
        else elEndGameSpan.innerText= 'you lose'
    }
    else elEndGameModal.style.display = 'none'
}// displays the end game modal with correct text

function setSmileyButton() {
    var elSmiletBtn = document.querySelector('.smiley-button')
    if (gGame.isOn) elSmiletBtn.innerText = SMILEY
    else if (gGame.flagCount === 0) elSmiletBtn.innerText = VICTORYSMILEY
    else elSmiletBtn.innerText = SADSMILEY
}// determines wich smiley icon is displayed

function darkModeToggle(elBtn) {
    var elBody = document.querySelector('body')
    var allText = document.querySelector('*')
    elBody.classList.toggle('dark-mode')
    allText.classList.toggle('dark-mode-text')
    elBtn.innerText = elBtn.innerText === 'Dark Mode' ? 'Regular Lighting' : 'Dark Mode'
}// toggles the dark mode on and off

function flashRed() {
    var elSpan = document.querySelector('.life-counter')
    elSpan.classList.toggle('red') 
    setTimeout(() => {elSpan.classList.toggle('red')}, 300)
}// indicates the player stepped on a mine