import {highlight} from "./SyntaxHighlighting.js";
import {getCaretPosition, setCaret} from "./Caret.js";
import {isSymbol} from "./Lexer.js";
import {Completion, SuggestionEngineInit} from "./Completion.js";
import {suggestionContainer} from "./DOMElements.js";
import {OnePunchhhhhhhhhhhhh} from "./VeryImportantFileDoNotTouchPleaseContainsSecretToUniverse.js";
import {g} from "./Globals.js";
import {debounce} from "./Utility.js";

const placeholderCode = `
#include <cassert>
#include <cstdlib>
#include <iostream>

class Cpu {
  public:
    virtual int dummy( int, int ) {}
  private:
    virtual int add_( int a, int b ) { return a + b; }  // A
    virtual int sub_( int a, int b ) { return a - b; }  // B
    virtual int mul_( int a, int b ) { return a * b; }  // C
    virtual int div_( int a, int b ) { return a / b; }  // D
    virtual int mod_( int a, int b ) { return a % b; }  // E
    virtual int and_( int a, int b ) { return a & b; }  // F
    virtual int or_( int a, int b )  { return a | b; }  // G
    virtual int xor_( int a, int b ) { return a ^ b; }  // H
};

int main( int argc, char* argv[] ) {
    typedef int (Cpu::*Memfun)( int, int );

    union {
        Memfun fn;
        unsigned char ptr[6];
    } u;

    Cpu    cpu;

    u.fn = &Cpu::dummy;

    assert( argc == 4 );

    int p1 = atoi( argv[ 1 ] );
    int p2 = atoi( argv[ 3 ] );
    char op = argv[2][0];

    assert( op >= 'A' && op <= 'H' );

    u.ptr[0] = 1 + 4 * ( op - 'A' + 1 );  // Don't look here!

    std::cout << "The answer is " << ( (cpu.*(u.fn))( p1, p2 ) ) << std::endl;
}
`;

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
	const currCaretRange = window.getSelection().getRangeAt(0).cloneRange();
	if (currCaretRange.endOffset == 0 || currCaretRange.startOffset == 0) {
		currCaretRange.setStart(currCaretRange.endContainer, 0);
		currCaretRange.setEnd(currCaretRange.endContainer, 1);
	}
	else {
		currCaretRange.setStart(currCaretRange.endContainer, currCaretRange.endOffset - 1);
		currCaretRange.setEnd(currCaretRange.endContainer, currCaretRange.endOffset);
	}
	let tempRange = currCaretRange.cloneRange();
	let word = ""
	let char = tempRange.toString();

	while (!(['\n', ' ', '\t', '\r'].includes(char)) && !isSymbol(char) && tempRange.startOffset > 0 && tempRange.endOffset > 0) {
		word = char + word;
		tempRange.setStart(tempRange.startContainer, tempRange.startOffset - 1);
		tempRange.setEnd(tempRange.endContainer, tempRange.endOffset - 1);
		char = tempRange.toString();
	}

	tempRange = currCaretRange.cloneRange();
	if (tempRange.startOffset < tempRange.startContainer.length && tempRange.endOffset < tempRange.endContainer.length) {
		tempRange.setStart(tempRange.startContainer, tempRange.startOffset + 1);
		tempRange.setEnd(tempRange.endContainer, tempRange.endOffset + 1);
	}
	char = tempRange.toString();

	while (!(['\n', ' ', '\t', '\r'].includes(char)) && !isSymbol(char) && tempRange.startOffset < tempRange.startContainer.length && tempRange.endOffset < tempRange.endContainer.length) {
		word += char;
		tempRange.setStart(tempRange.startContainer, tempRange.startOffset + 1);
		tempRange.setEnd(tempRange.endContainer, tempRange.endOffset + 1);
		char = tempRange.toString();
	}

	return word;
}

/*
export function getRecentKeyword(editor) {
	const code = getCodeFromEditor(editor);
	let pos = getCaretPositionWithNewlines(editor) - 1;

	if (code[pos] === '\n') pos--;

	// TODO: A hacky fix but works and not too slow tbh, might fix later
	while (!code[pos] && pos >= 0) {
		pos--;
	}
	if (code[pos] === ' ' || pos == 0) return '';

	let word = "";
	for (let i = pos + 1; i < code.length && !isSymbol(code[i]) && code[i] !== '\n' && code[i] !== ' ' && code[i] !== '\t'; i++) {
		word += code[i];
	}
	for (let i = pos; i >= 0 && !isSymbol(code[i]) && code[i] !== '\n' && code[i] !== ' ' && code[i] !== '\t'; i--) {
		word = code[i] + word;
	}

	return word;
}
*/
const STORAGE_KEY = 'editor_content';

function saveCodeToStorage(code) {
    localStorage.setItem(STORAGE_KEY, code);
}

function handleTabs(editor) {
	editor.addEventListener("keydown", (e) => {
		if (e.which === 9) {
			if (suggestionContainer.dataset.active === "true") {
				// TODO??
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
    highlight(editor);
    
    const debouncedSave = debounce(() => {
        const code = getCodeFromEditor(editor);
        saveCodeToStorage(code);
    }, g.saveDebounceInterval);

    editor.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.key === "Escape") {
            suggestionContainer.innerHTML = "";
            suggestionContainer.dataset.active = "false";
        }
        else if (e.keyCode >= 0x30 || e.keyCode == 0x20) {
            const pos = getCaretPosition(editor);
            highlight(editor);
            setCaret(pos, editor);
            debounce(() => Completion(editor), g.completionDebounceInterval)();
            debouncedSave();
        }
    });

    editor.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
            debouncedSave();
            if (window.getSelection().getRangeAt(0).startOffset === 0) {
                highlight(editor);
                Completion(editor);
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

export function CreateEditor(editor, defaultCode = placeholderCode) {
    const savedCode = localStorage.getItem(STORAGE_KEY);
    const codeToUse = savedCode || defaultCode;
    
    editor.innerText = "";
    insertCodeIntoEditor(editor, codeToUse);

    SuggestionEngineInit();
    handleTabs(editor);
    handleKeyPresses(editor);
}