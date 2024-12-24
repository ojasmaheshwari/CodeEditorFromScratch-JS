import {editor} from "./DOMElements.js";
import {highlight} from "./SyntaxHighlighting.js";
import {getCaretPosition, setCaret} from "./Caret.js";

function main() {
	highlight(editor);
	editor.addEventListener("keydown", (e) => {
		if (e.which === 9) {
			console.log(editor.innerHTML);
			const pos = getCaretPosition(editor) + 4;
			const range = window.getSelection().getRangeAt(0);
			range.deleteContents();
			range.insertNode(document.createTextNode("    "));
			highlight(editor);
			setCaret(pos, editor);
			e.preventDefault();
		}
	});
	editor.addEventListener("keyup", (e) => {
		if (e.keyCode >= 0x30 || e.keyCode == 0x20 || e.keyCode == 8) {
			const pos = getCaretPosition(editor);
			highlight(editor);
			setCaret(pos, editor);
		}
	});
}

main();
