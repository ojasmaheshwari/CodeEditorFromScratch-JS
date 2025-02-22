import {highlight} from "../components/SyntaxHighlighting.js";
import {getCaretPosition, setCaret} from "../components/Caret.js";
import {Completion, SuggestionEngineInit} from "../components/Completion.js";
import DOMElements from "../global/DOMElements.js";
import {OnePunchhhhhhhhhhhhh} from "../secrets/VeryImportantFileDoNotTouchPleaseContainsSecretToUniverse.js";
import {g, placeholderCode} from "../global/Globals.js";
import {debounce, isAlphaNumeric} from "../core/Utility.js";

export function getCodeFromEditor(editor) {
	let code = "";
	for (const node of editor.children) {
		if (node.nodeName === 'DIV' || node.nodeName === 'BR') {
			code += node.innerText + '\n';
		}
	}
	return code;
}

export function getRecentKeywordRange() {
	const sel = window.getSelection();
	const range = sel.getRangeAt(0);
	const textNode = range.startContainer;
	const textContent = textNode.textContent;

	console.log(textContent);

	// Find the start and end of the word using regex
	const wordStart = textContent.slice(0, range.startOffset).search(/\b\w+$/);
	const wordEnd = textContent.slice(range.startOffset).search(/\W/);
	const start = wordStart === -1 ? 0 : wordStart;
	const end = wordEnd === -1 ? textContent.length : range.startOffset + wordEnd;

	// Create a new range for the full word
	const toReplaceKeywordRange = document.createRange();
	toReplaceKeywordRange.setStart(textNode, start);
	toReplaceKeywordRange.setEnd(textNode, end);

	return toReplaceKeywordRange;
}

export function getRecentKeyword() {
	const recentKeyword = getRecentKeywordRange().toString();
	return recentKeyword;
}

export function saveCodeToStorage(code) {
	localStorage.setItem(g.EDITOR_LOCALSTORAGE_KEY, code);
}

function handleTabs(editor) {
	const {suggestionContainer} = DOMElements;

	editor.addEventListener("keydown", (e) => {
		if (e.key === "Tab") {
			if (suggestionContainer.dataset.active === "true") {
				// Do not do anything if suggestionContainer is displayed i.e. let browser perform its original behavior
			}
			else {
				const pos = getCaretPosition(editor) + 4;
				const range = window.getSelection().getRangeAt(0);
				range.deleteContents();
				range.insertNode(document.createTextNode("    "));
				highlight(editor);
				setCaret(pos, editor);
				e.preventDefault();
			}
		}
		else if (e.ctrlKey && e.key === "O") {
			e.preventDefault();
			OnePunchhhhhhhhhhhhh(editor);
		}
	});
}

function handleKeyPresses(editor) {
	const {suggestionContainer} = DOMElements;

	highlight(editor);

	const debouncedSave = debounce(() => {
		const code = getCodeFromEditor(editor);
		saveCodeToStorage(code);
	}, g.saveDebounceInterval);

	editor.addEventListener("keyup", (e) => {
		e.preventDefault();
		if (e.key === "Escape") {
			if (suggestionContainer.dataset.active === "true") {
				suggestionContainer.innerHTML = "";
				suggestionContainer.dataset.active = "false";
			}
		}
		else if (isAlphaNumeric(e.key)) {
			const pos = getCaretPosition(editor);
			highlight(editor, e);
			setCaret(pos, editor);
			debounce(() => Completion(editor), g.completionDebounceInterval)();
			debouncedSave();
		} else {
			if (suggestionContainer.dataset.active === "true") {
				suggestionContainer.innerHTML = "";
				suggestionContainer.dataset.active = "false";
			}
		}
	});

	editor.addEventListener("keydown", (e) => {
		if (e.key === "Backspace") {
			debouncedSave();
			if (window.getSelection().getRangeAt(0).startOffset === 0) {
				highlight(editor);
			}
		}
	});
}

export function insertCodeIntoEditor(editor, code) {
	const placeholderCodeLines = code.split('\n');
	for (const line of placeholderCodeLines) {
		editor.innerHTML += "<div>" + line.replace('<', '&lt').replace('>', '&gt').replace('\t', '    ') + "</div>";
	}
}

export function InitializeEditor(editor) {
	try {
		DOMElements.editor = editor;
		editor.classList.add("___editor___");
	} catch (error) {
		console.error("Not a valid DOM element as an argument to CreateEditor");
	}

	const suggestionContainer = document.createElement("div");
	suggestionContainer.id = "___suggestion-container___";
	suggestionContainer.dataset.active = "false";
	document.body.appendChild(suggestionContainer);

	DOMElements.suggestionContainer = suggestionContainer;

	// Apply general styles for suggestionContainer
	suggestionContainer.style.position = "absolute";
}

export function CreateEditor(defaultCode = placeholderCode) {
	const editor = DOMElements.editor;

	const savedCode = localStorage.getItem(g.EDITOR_LOCALSTORAGE_KEY);
	const codeToUse = savedCode || defaultCode;

	editor.innerText = "";
	insertCodeIntoEditor(editor, codeToUse);

	SuggestionEngineInit();
	handleTabs(editor);
	handleKeyPresses(editor);
}
