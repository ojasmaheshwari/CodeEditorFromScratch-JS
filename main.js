import {editor} from "./DOMElements.js";
import {highlight} from "./SyntaxHighlighting.js";
import {getCaretPosition, setCaret} from "./Caret.js";

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

function main() {
	const placeholderCodeLines = placeholderCode.split('\n');
	for (const line of placeholderCodeLines) {
		editor.innerHTML += "<div>" + line.replace('<', '&lt').replace('>', '&gt').replace('\t', '    ') + "</div>";
	}
	highlight(editor);
	editor.addEventListener("keydown", (e) => {
		if (e.which === 9) {
			console.log(editor.innerHTML);
			const pos = getCaretPosition(editor) + 4;
			const range = window.getSelection().getRangeAt(0);
			range.deleteContents();
			range.insertNode(document.createTextNode("    "));
			highlight(editor);
			setCaret(pos, editor);
			e.preventDefault();
		}
	});
	editor.addEventListener("keyup", (e) => {
		if (e.keyCode >= 0x30 || e.keyCode == 0x20 || e.keyCode == 8) {
			const pos = getCaretPosition(editor);
			highlight(editor);
			setCaret(pos, editor);
		}
	});
}

main();
