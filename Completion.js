import {lexer, getKeywordsFromLexemes} from "./Lexer.js";
import {fuzzySearch} from "./FuzzySearch.js";
import {getRecentKeyword} from "./editor.js";

export function Completion(editor) {
	const lexemes = lexer(editor.innerText);
	const keywords = getKeywordsFromLexemes(lexemes);
	const userTypedWord = getRecentKeyword(editor);
	const scoresData = fuzzySearch(keywords, userTypedWord);
	console.log(scoresData);
}
