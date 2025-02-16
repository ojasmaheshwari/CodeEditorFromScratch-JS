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
	toReplaceKeywordRange.deleteContents();
	toReplaceKeywordRange.insertNode(document.createTextNode(replaceBy));
	sel.addRange(toReplaceKeywordRange);

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


let completionTimeout = null;

export function Completion(editor) {
	if (completionTimeout) {
		clearTimeout(completionTimeout);
	}
	
	completionTimeout = setTimeout(() => {
		const userTypedWord = getRecentKeyword(editor);
		if (!userTypedWord || /^[\s\n\t]$/.test(userTypedWord)) {
			suggestionContainer.dataset.active = "false";
			suggestionContainer.innerHTML = "";
			return;
		}

		const lexemes = lexer(getCodeFromEditor(editor));
		const keywords = getKeywordsFromLexemes(lexemes);
		const scoresData = fuzzySearch(keywords, userTypedWord);
		
		if (scoresData.length === 0) {
			suggestionContainer.dataset.active = "false";
			suggestionContainer.innerHTML = "";
			return;
		}

		updateSuggestionUI(scoresData);
	}, 150); 
}

function updateSuggestionUI(scoresData) {
	const caretCoords = getCaretGlobalCoordinates();
	suggestionContainer.style.left = `${caretCoords.x}px`;
	suggestionContainer.style.top = `${caretCoords.y + 20}px`;
	
	const fragment = document.createDocumentFragment();
	
	const firstDummy = document.createElement('button');
	firstDummy.className = 'first-dummy-suggestion';
	fragment.appendChild(firstDummy);
	
	scoresData.forEach(data => {
		const suggestion = document.createElement('button');
		suggestion.className = 'suggestion' + (OPMModeSettings.active ? ' opm-suggestion' : '');
		suggestion.textContent = data.token;
		fragment.appendChild(suggestion);
	});
	
	const lastDummy = document.createElement('button');
	lastDummy.className = 'last-dummy-suggestion';
	fragment.appendChild(lastDummy);
	
	suggestionContainer.innerHTML = '';
	suggestionContainer.appendChild(fragment);
	suggestionContainer.dataset.active = "true";
	
	SuggestionNavigationProps.currentSuggestionIndex = 0;
	SuggestionNavigationProps.firstSuggestionIndex = 0;
	SuggestionNavigationProps.lastSuggestionIndex = scoresData.length - 1;
}
