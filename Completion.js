import {lexer, getKeywordsFromLexemes, isSymbol} from "./Lexer.js";
import {fuzzySearch} from "./FuzzySearch.js";
import {getRecentKeyword} from "./editor.js";
import {getCaretGlobalCoordinates, getCaretPositionWithNewlines} from "./Caret.js";
import {editor, suggestionContainer} from "./DOMElements.js";

function triggerKeywordReplace(replaceBy) {
	const pos = getCaretPositionWithNewlines(editor) - 1;

	console.log("pos: ", pos);
	const code = editor.innerText;

	if (code[pos] === '\n') pos--;

	let keywordStartIdx, keywordEndIdx;

	for (keywordStartIdx = pos; keywordStartIdx >= 0 && !isSymbol(code[keywordStartIdx]) && code[keywordStartIdx] !== ' ' && code[keywordStartIdx] !== '\n' && code[keywordStartIdx] !== '\t'; keywordStartIdx--);
	for (keywordEndIdx = pos; keywordEndIdx < code.length && !isSymbol(code[keywordEndIdx]) && code[keywordEndIdx] !== ' ' && code[keywordEndIdx] !== '\n' && code[keywordEndIdx] !== '\t'; keywordEndIdx++);

	console.log(keywordStartIdx, keywordEndIdx);
	console.log(code.slice(keywordStartIdx, keywordEndIdx + 1));
}

function handleSuggestionPress(e) {
	triggerKeywordReplace(e.target.innerText);
}

export function Completion(editor) {
	const lexemes = lexer(editor.innerText);
	const keywords = getKeywordsFromLexemes(lexemes);
	const userTypedWord = getRecentKeyword(editor);
	const scoresData = fuzzySearch(keywords, userTypedWord);

	const caretCoords = getCaretGlobalCoordinates();
	const caretX = caretCoords.x, caretY = caretCoords.y;

	suggestionContainer.innerHTML = "";
	suggestionContainer.style.left = `${caretX}px`;
	suggestionContainer.style.top = `${caretY + 20}px`;

	if (userTypedWord === '') return;

	suggestionContainer.addEventListener("click", handleSuggestionPress);

	console.log(scoresData);

	for (let i = 0; i < scoresData.length; i++) {
		const data = scoresData[i];

		const suggestion = document.createElement('div');
		suggestion.classList.add('suggestion');
		suggestion.innerText = data.token;
		suggestionContainer.appendChild(suggestion);
		document.body.appendChild(suggestionContainer);
	}
}
