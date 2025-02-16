import {lexer, getKeywordsFromLexemes, isSymbol} from "./Lexer.js";
import {fuzzySearch} from "./FuzzySearch.js";
import {getCodeFromEditor, getRecentKeyword, getRecentKeywordRange} from "./editor.js";
import {getCaretGlobalCoordinates, getCaretPosition, setCaret} from "./Caret.js";
import {editor, suggestionContainer} from "./DOMElements.js";
import {SuggestionNavigationProps} from "./SuggestionNavigation.js";
import {OPMModeSettings} from "./Globals.js";

let gCaretPos = 0;

function triggerKeywordReplace(replaceBy, pos) {
    const sel = window.getSelection();
    setCaret(pos, editor);
    const toReplaceKeywordRange = getRecentKeywordRange();

    // Replace the full word with the suggestion
    toReplaceKeywordRange.deleteContents();
    toReplaceKeywordRange.insertNode(document.createTextNode(replaceBy));

    // Update the caret position to the end of the inserted suggestion
    const updatedCaret = document.createRange();
    updatedCaret.setStart(toReplaceKeywordRange.endContainer, toReplaceKeywordRange.endOffset);
    updatedCaret.collapse();
    sel.removeAllRanges();
    sel.addRange(updatedCaret);

    suggestionContainer.innerHTML = "";
    suggestionContainer.dataset.active = "false";
}

/*
function triggerKeywordReplace(replaceBy, pos) {
	const code = getCodeFromEditor(editor);

	if (code[pos] === '\n') pos--;

	let keywordStartIdx, keywordEndIdx;

	for (keywordStartIdx = pos; keywordStartIdx >= 0 && !isSymbol(code[keywordStartIdx]) && code[keywordStartIdx] !== ' ' && code[keywordStartIdx] !== '\n' && code[keywordStartIdx] !== '\t'; keywordStartIdx--);
	for (keywordEndIdx = pos; keywordEndIdx < code.length && !isSymbol(code[keywordEndIdx]) && code[keywordEndIdx] !== ' ' && code[keywordEndIdx] !== '\n' && code[keywordEndIdx] !== '\t'; keywordEndIdx++);

	const newCode = code.slice(0, keywordStartIdx + 1) + replaceBy + code.slice(keywordEndIdx, code.length);
	editor.innerHTML = "";
	insertCodeIntoEditor(editor, newCode);
	// TODO: Don't really like this, should switch to toggalable suggestionContainer later
	suggestionContainer.innerHTML = "";
	highlight(editor);

	console.log(keywordStartIdx);
	setCaret(keywordStartIdx + replaceBy.length, editor);
}
*/

function handleSuggestionPress(e) {
	// triggerKeywordReplace(e.target.innerText, gCaretPos);
	triggerKeywordReplace(e.target.innerText, gCaretPos);
	e.preventDefault();
	e.stopPropagation();
}

function manageSuggestionFocus(e) {
	const focusedSuggestion = e.target;
	if (focusedSuggestion.classList.contains("first-dummy-suggestion")) {
		suggestionContainer.children[1].focus();
	} else if (focusedSuggestion.classList.contains("last-dummy-suggestion")) {
		suggestionContainer.children[1].focus();
	}
}

function handleSuggestionKeyEvents(e) {
	if (e.key === "Escape") {
		suggestionContainer.innerHTML = "";
		suggestionContainer.dataset.active = "false";

		// Set caret to the position before the suggestionContainer was open
		setCaret(getCaretPosition(editor), editor);
	}
}

export function SuggestionEngineInit() {
	suggestionContainer.addEventListener("focusin", manageSuggestionFocus);
	suggestionContainer.addEventListener("click", (e) => {handleSuggestionPress(e)});
	suggestionContainer.addEventListener("keydown", (e) => {handleSuggestionKeyEvents(e)})
}

export function Completion(editor) {
	const userTypedWord = getRecentKeyword(editor);
	suggestionContainer.innerHTML = "";
	if (userTypedWord === '' || !userTypedWord || userTypedWord === ' ' || userTypedWord === '\n' || userTypedWord === '\t') {
		suggestionContainer.dataset.active = "false";
		return;
	}

	const lexemes = lexer(getCodeFromEditor(editor));
	const keywords = getKeywordsFromLexemes(lexemes);
	const scoresData = fuzzySearch(keywords, userTypedWord);

	const caretCoords = getCaretGlobalCoordinates();
	const caretX = caretCoords.x, caretY = caretCoords.y;
	suggestionContainer.style.left = `${caretX}px`;
	suggestionContainer.style.top = `${caretY + 20}px`;
	suggestionContainer.dataset.active = "true";

	gCaretPos = getCaretPosition(editor);

	const firstDummyChoice = document.createElement('button');
	firstDummyChoice.classList.add('first-dummy-suggestion');
	suggestionContainer.appendChild(firstDummyChoice);

	for (let i = 0; i < scoresData.length; i++) {
		const data = scoresData[i];

		const suggestion = document.createElement('button');
		suggestion.classList.add('suggestion');
		if (OPMModeSettings.active) suggestion.classList.add('opm-suggestion');
		suggestion.innerText = data.token;
		suggestionContainer.appendChild(suggestion);
		document.body.appendChild(suggestionContainer);
	}

	SuggestionNavigationProps.currentSuggestionIndex = 0;
	SuggestionNavigationProps.firstSuggestionIndex = 0;
	SuggestionNavigationProps.lastSuggestionIndex = keywords.length - 1;

	const lastDummyChoice = document.createElement('button');
	lastDummyChoice.classList.add('last-dummy-suggestion');
	suggestionContainer.appendChild(lastDummyChoice);
}
