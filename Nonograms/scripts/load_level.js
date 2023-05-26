import {loadLevels} from "./levels.js";
import {generateCrosswordNumbers} from "./field_generation.js"
import {init} from "./logic.js";


const levels = loadLevels();
let level;

export function loadLevel(level) {
	const levels = loadLevels();
	const levelData = levels.get(level);
	if (levelData === undefined) {
		window.location.href = "/404.html";
	} else {
		generateCrosswordNumbers(levels.get(level));
	}
}
export function getCurrentLevelData() {
	return levels.get(level)
}


export function loadGame() {
	const searchParams = new URLSearchParams(location.search);
	level = searchParams.get('level');
	loadLevel(level);
}
window.addEventListener('load',
	() => loadGame());


init();