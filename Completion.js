import {lexer, getKeywordsFromLexemes, isSymbol, keywords} from "./Lexer.js";
import {fuzzySearch} from "./FuzzySearch.js";
import {getRecentKeyword} from "./editor.js";
import {getCaretGlobalCoordinates, getCaretPositionWithNewlines, setCaret} from "./Caret.js";
import {editor, suggestionContainer} from "./DOMElements.js";
import {insertCodeIntoEditor} from "./editor.js";
import {highlight} from "./SyntaxHighlighting.js";

let gCaretPos = 0;

function triggerKeywordReplace(replaceBy, pos) {
	console.log("triggered keyword replace");
	const code = editor.innerText;

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

	setCaret(keywordStartIdx + replaceBy.length, editor);
}

function handleSuggestionPress(e) {
	triggerKeywordReplace(e.target.innerText, gCaretPos);
	e.preventDefault();
	e.stopPropagation();
}

export function SuggestionEngineInit() {
	suggestionContainer.addEventListener("click", (e) => {handleSuggestionPress(e)});
}

export function Completion(editor) {
	const userTypedWord = getRecentKeyword(editor);
	suggestionContainer.innerHTML = "";
	if (userTypedWord === '' || !userTypedWord || userTypedWord === ' ' || userTypedWord === '\n' || userTypedWord === '\t') return;
	console.log(userTypedWord);

	const lexemes = lexer(editor.innerText);
	const keywords = getKeywordsFromLexemes(lexemes);
	const scoresData = fuzzySearch(keywords, userTypedWord);
	console.log(scoresData);

	const caretCoords = getCaretGlobalCoordinates();
	const caretX = caretCoords.x, caretY = caretCoords.y;
	suggestionContainer.style.left = `${caretX}px`;
	suggestionContainer.style.top = `${caretY + 20}px`;

	gCaretPos = getCaretPositionWithNewlines(editor);

	for (let i = 0; i < scoresData.length; i++) {
		const data = scoresData[i];

		const suggestion = document.createElement('div');
		suggestion.classList.add('suggestion');
		suggestion.innerText = data.token;
		suggestionContainer.appendChild(suggestion);
		document.body.appendChild(suggestionContainer);
	}
}
