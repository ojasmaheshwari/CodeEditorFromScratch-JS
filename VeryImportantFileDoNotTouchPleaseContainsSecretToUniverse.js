// HAHA YOU FOUND THE EASTER EGG
// Since One Punch Man S3 is gonna release soon, HERES THE SURPRISEE
// NOW HIT "CTRL + shift + o" to activate ONE PUNCH MODE!

import {suggestionContainer} from "./DOMElements.js";
import {OPMModeSettings} from "./Globals.js";


export function OnePunchhhhhhhhhhhhh(editor) {
	document.body.classList.toggle("opm-background");
	editor.classList.toggle("opm-editor");
	suggestionContainer.classList.toggle("opm-suggestion-container");
	OPMModeSettings.active = true;
}
