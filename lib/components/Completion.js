import {lexer, getKeywordsFromLexemes} from "../core/Lexer.js";
import {fuzzySearch} from "../core/FuzzySearch.js";
import {getCodeFromEditor, getRecentKeyword, getRecentKeywordRange} from "../editor/editor.js";
import {getCaretGlobalCoordinates, getCaretPosition, setCaret} from "./Caret.js";
import DOMElements from "../global/DOMElements.js";
import {SuggestionNavigationProps} from "./SuggestionNavigation.js";
import {OPMModeSettings} from "../global/Globals.js";

let gCaretPos = 0;

function triggerKeywordReplace(replaceBy, pos) {
	const {editor, suggestionContainer} = DOMElements;

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

function handleSuggestionPress(e) {
	triggerKeywordReplace(e.target.innerText, gCaretPos);
	e.preventDefault();
	e.stopPropagation();
}

function manageSuggestionFocus(e) {
	const {suggestionContainer} = DOMElements;

	const focusedSuggestion = e.target;
	if (focusedSuggestion.classList.contains("___first-dummy-suggestion___")) {
		suggestionContainer.children[1].focus();
	} else if (focusedSuggestion.classList.contains("___last-dummy-suggestion___")) {
		suggestionContainer.children[1].focus();
	}
}

function handleSuggestionKeyEvents(e) {
	const {editor, suggestionContainer} = DOMElements;

	if (e.key === "Escape") {
		suggestionContainer.innerHTML = "";
		suggestionContainer.dataset.active = "false";

		// Set caret to the position before the suggestionContainer was open
		setCaret(getCaretPosition(editor), editor);
	}
}

export function SuggestionEngineInit() {
	const suggestionContainer = DOMElements.suggestionContainer;

	suggestionContainer.addEventListener("focusin", manageSuggestionFocus);
	suggestionContainer.addEventListener("click", (e) => {handleSuggestionPress(e)});
	suggestionContainer.addEventListener("keydown", (e) => {handleSuggestionKeyEvents(e)})
}

export function Completion(editor) {
	const {suggestionContainer} = DOMElements;

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
	firstDummyChoice.classList.add('___first-dummy-suggestion___');
	suggestionContainer.appendChild(firstDummyChoice);

	console.log(scoresData);
	for (let i = 0; i < scoresData.length; i++) {
		const data = scoresData[i];

		const suggestion = document.createElement('button');
		suggestion.classList.add('___suggestion___');
		if (OPMModeSettings.active) suggestion.classList.add('opm-suggestion');
		suggestion.innerText = data.token;
		suggestionContainer.appendChild(suggestion);
		document.body.appendChild(suggestionContainer);
	}

	SuggestionNavigationProps.currentSuggestionIndex = 0;
	SuggestionNavigationProps.firstSuggestionIndex = 0;
	SuggestionNavigationProps.lastSuggestionIndex = keywords.length - 1;

	const lastDummyChoice = document.createElement('button');
	lastDummyChoice.tabIndex =
		lastDummyChoice.classList.add('___last-dummy-suggestion___');
	suggestionContainer.appendChild(lastDummyChoice);

	suggestionContainer.dataset.active = "true";
}
