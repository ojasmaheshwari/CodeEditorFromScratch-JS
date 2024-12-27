export const keywords = ['class', 'void', 'int', 'return', 'pragma', 'include', 'public', 'private', 'const', 'static', 'true', 'false', 'null', 'NULL', 'nullptr', 'for', 'if', 'while', 'else', 'enum', 'struct', 'typedef', 'struct', 'union', 'assert', 'virtual', 'unsigned', 'char', 'long', 'double'];

export const symbols = [
	'(',
	')',
	'{',
	'}',
	';',
	'+',
	'-',
	'*',
	'/',
	'=',
	'<',
	'>',
	'<=',
	'>=',
	'==',
	'!=',
	'&&',
	'||',
	'#',
	':',
	'~',
	'\'',
	'"',
	'.',
	'->'
];

export function isKeyword(word) {
	return keywords.indexOf(word) !== -1;
}

export function isSymbol(char) {
	return symbols.indexOf(char) !== -1;
}

export function isDigit(char) {
	return !isNaN(parseInt(char));
}

export function isStringLiteral(literal) {
	return literal[0] = '"' && literal[literal.length - 1] == '"';
}

function lexeme(token, type) {
	return {token: token, type: type};
};

export function getSourceFromLexemes(lexemes) {
	let source = "";
	for (const lexeme of lexemes) {
		source += lexeme.token;
	}

	return source;
}

export function getKeywordsFromLexemes(lexemes) {
	const keywords = new Set();

	for (const lexeme of lexemes) {
		if (lexeme.type == "keyword") keywords.add(lexeme.token);
	}

	return Array.from(keywords);
}

export function lexer(input) {
	let currentToken = "";
	const lexemes = [];
	const lines = input.split('\n');

	for (const line of lines) {
		for (let i = 0; i < line.length; i++) {
			const char = line[i];
			if (isSymbol(char)) {
				if (currentToken !== "") lexemes.push(lexeme(currentToken, "keyword"));
				lexemes.push(lexeme(char, "symbol"));
				currentToken = "";
			}
			else if (char === ' ' || char === '\t' || char === '\r') {
				if (currentToken !== "") lexemes.push(lexeme(currentToken, "keyword"));
				lexemes.push(lexeme(char, "space"));
				currentToken = "";
			}
			else {
				currentToken += char;
			}
		}
		lexemes.push(lexeme('\n', "newline"));
	}

	return lexemes;
}
