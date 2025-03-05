import { lexer, getKeywordsFromLexemes } from "../core/Lexer.ts";
import { fuzzySearch } from "../core/FuzzySearch.ts";
import { getCodeFromEditor, getRecentKeyword, getRecentKeywordRange } from "../editor/editor.ts";
import { getCaretGlobalCoordinates, getCaretPosition, setCaret } from "./Caret.ts";
import DOMElements from "../global/DOMElements.js";
import { SuggestionNavigationProps } from "./SuggestionNavigation.ts"
import { OPMModeSettings } from "../global/Global.ts";

let gCaretPos: number = 0;

function triggerKeywordReplace(replaceBy: string, pos: number): void {
  const { editor, suggestionContainer } = DOMElements;
  
  const sel = window.getSelection();
  if (editor) {
    setCaret(pos, editor);
  }
  const toReplaceKeywordRange = getRecentKeywordRange();

  toReplaceKeywordRange.deleteContents();
  toReplaceKeywordRange.insertNode(document.createTextNode(replaceBy));

  const updatedCaret = document.createRange();
  updatedCaret.setStart(toReplaceKeywordRange.endContainer, toReplaceKeywordRange.endOffset);
  updatedCaret.collapse();
  sel?.removeAllRanges();
  sel?.addRange(updatedCaret);

  if (suggestionContainer) {
    suggestionContainer.innerHTML = "";
    suggestionContainer.dataset.active = "false";
  }

    

}

function handleSuggestionPress(e: MouseEvent): void {
  triggerKeywordReplace((e.target as HTMLElement).innerText, gCaretPos);
  e.preventDefault();
  e.stopPropagation();
}

function manageSuggestionFocus(e: FocusEvent): void {
  const { suggestionContainer } = DOMElements;

  const focusedSuggestion = e.target as HTMLElement;
  if (focusedSuggestion.classList.contains("___first-dummy-suggestion___")) {
    if(suggestionContainer){
        (suggestionContainer.children[1] as HTMLElement).focus();
    }
  } else if (focusedSuggestion.classList.contains("___last-dummy-suggestion___")) {
    if(suggestionContainer){
        (suggestionContainer.children[1] as HTMLElement).focus();
    }
  }
}

function handleSuggestionKeyEvents(e: KeyboardEvent): void {
  const { editor, suggestionContainer } = DOMElements;

  if (e.key === "Escape") {
    if(suggestionContainer){
        suggestionContainer.innerHTML = "";
        suggestionContainer.dataset.active = "false";
    }

    // Set caret to the position before the suggestionContainer was open
    if (editor) {
        setCaret(getCaretPosition(editor), editor);
    }
  }
}

export function SuggestionEngineInit(): void {
  const suggestionContainer = DOMElements.suggestionContainer;
  if(suggestionContainer){
      suggestionContainer.addEventListener("focusin", manageSuggestionFocus);
      suggestionContainer.addEventListener("click", (e) => { handleSuggestionPress(e) });
      suggestionContainer.addEventListener("keydown", (e) => { handleSuggestionKeyEvents(e) });
  };

}

export function Completion(editor: HTMLElement): void {
  const { suggestionContainer } = DOMElements;
  if (!suggestionContainer) {
    return;
  }

  suggestionContainer.innerHTML = "";

  const userTypedWord = getRecentKeyword();
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
  lastDummyChoice.tabIndex = -1;
  lastDummyChoice.classList.add('___last-dummy-suggestion___');
  suggestionContainer.appendChild(lastDummyChoice);

  suggestionContainer.dataset.active = "true";
}
