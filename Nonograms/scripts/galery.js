import {loadLevels} from "./levels.js";




let counter = 0;
const keys = Array.from(loadLevels().keys());

export function loadCurrentLevel(){
    let key = keys[counter];
    document.getElementById('current-level').textContent = key;
}

loadCurrentLevel()
document.getElementById('left-btn').onclick = () => {
    if (counter > 0) counter--;
    loadCurrentLevel();
}
document.getElementById('right-btn').onclick = () => {
    if (counter < keys.length - 1) counter++;
    loadCurrentLevel();
}
document.getElementById('btn-play').onclick = () => {
    window.location.href = `../html/game.html?level=${keys[counter]}`;
}
document.getElementById('btn-back').onclick = () => {
    window.history.back();
}