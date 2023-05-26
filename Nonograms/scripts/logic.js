import {getCurrentLevelData, loadLevel} from "./load_level.js";
import {showWinWindow} from "./win_window.js";
import {loadLevels} from "./levels.js";

let timerId;

export function init(){
    const about = document.getElementById('btn-about');
    about.onclick = () => {
        location.href = 'about.html';
    };
    const reset = document.getElementById('btn-reset');
    reset.onclick = () => {
        location.reload();
    }
    const tip = document.getElementById('btn-tip');
    tip.onclick = () => giveTip()
    const anotherBtn = document.getElementById('another-level');
    anotherBtn.onclick = () => loadAnotherLevel();
    const timer = document.getElementById('timer')
    let time = 1
    timerId = setInterval(() => timer.textContent = `Прошло: ${time++} c`, 1000);
}

function loadAnotherLevel() {
    const keys = Array.from(loadLevels().keys());
    const n = Math.round(Math.random() * keys.length);
    const searchParams = new URLSearchParams(location.search);
    const thisLevel = searchParams.get('level');
    if (keys[n] === thisLevel) loadAnotherLevel();
    else window.location.href = `../html/game.html?level=${keys[n]}`;
}

function giveTip() {
    const data = getCurrentLevelData();
    let tipped = false;
    let x = Math.round(Math.random() * data[0].length);
    let y = Math.round(Math.random() * data.length);
    const cell = document.getElementById(`cell_${x}_${y}`)
    if (data[y][x] === '#') {
        if (cell.className !== 'cell-filled') {
            cell.className = 'cell-filled';
            tipped = true;
        }
    } else {
        if (cell.className !== 'cell-point') {
            cell.className = 'cell-point';
            cell.textContent = '·';
            tipped = true;
        }
    }
    if (!tipped) giveTip();
}
export function clickOnCell(cell){
    cell.textContent = '';
    switch (cell.className) {
        case 'cell-empty':
            cell.className = 'cell-filled';
            break;
        case 'cell-filled':
            cell.className = 'cell-point';
            cell.textContent = '·';
            break;
        default:
            cell.className = 'cell-empty';
    }
    if(checkVictory(getCurrentLevelData())){
        //alert('Вы выиграли!');
        clearInterval(timerId);
        showWinWindow();
    }

}

function checkVictory(crosswordData) {
    const table = document.getElementById('crossword-field');
    let win = true;
    for (let i = 0; i < crosswordData.length; i++) {
        for (let j = 0; j < crosswordData[0].length; j++) {
            const cell = document.getElementById(`cell_${j}_${i}`)
            if (crosswordData[i][j] === '#') {
                if (cell.className !== 'cell-filled') {
                    win = false;
                    break;
                }
            } else {
                if (cell.className === 'cell-filled') {
                    win = false;
                    break;
                }
            }
        }
        if (win === false) break;
    }
    return win
}