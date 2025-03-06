import { highlight } from "../components/SyntaxHighlighting.ts";
import { getCaretPosition, setCaret } from "../components/Caret.ts";
import { Completion, SuggestionEngineInit } from "../components/Completion.ts";
import DOMElements from "../global/DOMElements.ts";
import { OnePunchhhhhhhhhhhhh } from "../secrets/VeryImportantFileDoNotTouchPleaseContainsSecretToUniverse.ts";
import { g, placeholderCode } from "../global/Global.ts";
import { debounce, isAlphaNumeric } from "../core/Utility.ts";

export function getCodeFromEditor(editor: HTMLElement): string {
  let code = "";
  for (const node of Array.from(editor.children)) {
    if (node.nodeName === "DIV" || node.nodeName === "BR") {
      code += (node as HTMLElement).innerText + "\n";
    }
  }
  return code;
}

export function getRecentKeywordRange(): Range {
  const sel = window.getSelection();
  const range = sel?.getRangeAt(0);
  const textNode = range?.startContainer as Text;
  const textContent = textNode.textContent;

  const wordStart = textContent!.slice(0, range?.startOffset).search(/\b\w+$/);
  const wordEnd = textContent!.slice(range?.startOffset).search(/\W/);
  const start = wordStart === -1 ? 0 : wordStart;
  const end =
    wordEnd === -1
      ? textContent!.length
      : range
      ? range.startOffset + wordEnd
      : textContent!.length;

  const toReplaceKeywordRange = document.createRange();
  toReplaceKeywordRange.setStart(textNode, start);
  toReplaceKeywordRange.setEnd(textNode, end);

  return toReplaceKeywordRange;
}

export function getRecentKeyword(): string {
  const recentKeyword = getRecentKeywordRange().toString();
  return recentKeyword;
}

export function saveCodeToStorage(code: string): void {
  localStorage.setItem(g.EDITOR_LOCALSTORAGE_KEY, code);
}

function handleTabs(editor: HTMLElement): void {
  const { suggestionContainer } = DOMElements;

  editor.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Tab") {
      if (
        suggestionContainer &&
        suggestionContainer.dataset.active === "true"
      ) {
        e.preventDefault();
        (suggestionContainer.children[1] as HTMLElement).focus();
      } else {
        const pos = getCaretPosition(editor) + 4;
        const range = window.getSelection()?.getRangeAt(0);
        range?.deleteContents();
        range?.insertNode(document.createTextNode("    "));
        highlight(editor);
        setCaret(pos, editor);
        e.preventDefault();
      }
    } else if (e.ctrlKey && e.key === "O") {
      e.preventDefault();
      OnePunchhhhhhhhhhhhh(editor);
    }
  });
}

function handleKeyPresses(editor: HTMLElement): void {
  const { suggestionContainer } = DOMElements;

  highlight(editor);

  const debouncedSave = debounce(() => {
    const code = getCodeFromEditor(editor);
    saveCodeToStorage(code);
  }, g.saveDebounceInterval);

  editor.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Tab") return;

    e.preventDefault();
    if (e.key === "Escape") {
      if (
        suggestionContainer &&
        suggestionContainer.dataset.active === "true"
      ) {
        suggestionContainer.innerHTML = "";
        suggestionContainer.dataset.active = "false";
      }
    } else if (isAlphaNumeric(e.key)) {
      const pos = getCaretPosition(editor);
      highlight(editor);
      setCaret(pos, editor);
      debounce(() => Completion(editor), g.completionDebounceInterval)();
      debouncedSave();
    } else {
      if (
        suggestionContainer &&
        suggestionContainer.dataset.active === "true"
      ) {
        suggestionContainer.innerHTML = "";
        suggestionContainer.dataset.active = "false";
      }
    }
  });

  editor.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Backspace") {
      debouncedSave();
      if (window.getSelection()?.getRangeAt(0).startOffset === 0) {
        highlight(editor);
      }
    }
  });
}

export function insertCodeIntoEditor(editor: HTMLElement, code: string): void {
  const placeholderCodeLines = code.split("\n");
  for (const line of placeholderCodeLines) {
    editor.innerHTML +=
      "<div>" +
      line.replace("<", "&lt").replace(">", "&gt").replace("\t", "    ") +
      "</div>";
  }
}

export function InitializeEditor(editor: HTMLElement): void {
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

  suggestionContainer.style.position = "absolute";
}

export function CreateEditor(defaultCode: string = placeholderCode): void {
  const editor = DOMElements.editor;

  const savedCode = localStorage.getItem(g.EDITOR_LOCALSTORAGE_KEY);
  const codeToUse = savedCode || defaultCode;

  if (editor) {
    editor.innerText = "";
    insertCodeIntoEditor(editor, codeToUse);

    SuggestionEngineInit();
    handleTabs(editor);
    handleKeyPresses(editor);
  }
}
