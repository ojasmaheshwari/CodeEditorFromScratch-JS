import {lexer, getKeywordsFromLexemes} from "./Lexer.js";
import {fuzzySearch} from "./FuzzySearch.js";
import {getRecentKeyword} from "./editor.js";
import {getCaretGlobalCoordinates} from "./Caret.js";
import {suggestionContainer} from "./DOMElements.js";

export function Completion(editor) {
	const lexemes = lexer(editor.innerText);
	const keywords = getKeywordsFromLexemes(lexemes);
	const userTypedWord = getRecentKeyword(editor);
	const scoresData = fuzzySearch(keywords, userTypedWord);

	const coords = getCaretGlobalCoordinates();
	const caretX = coords.x, caretY = coords.y;

	suggestionContainer.innerHTML = "";
	suggestionContainer.style.left = `${caretX}px`;
	suggestionContainer.style.top = `${caretY + 20}px`;

	if (userTypedWord === '') return;

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
