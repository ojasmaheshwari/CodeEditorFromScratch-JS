import {editor} from "./DOMElements.js";
import {CreateEditor} from "./editor.js";
import {lexer} from "./Lexer.js";

function main() {
	CreateEditor(editor);
	lexer();
}

main();
