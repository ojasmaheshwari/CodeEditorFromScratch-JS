export const keywords: string[] = [
    'class', 'void', 'int', 'return', 'pragma', 'include', 'public', 'private', 'const', 'static', 
    'true', 'false', 'null', 'NULL', 'nullptr', 'for', 'if', 'while', 'else', 'enum', 'struct', 'typedef', 
    'struct', 'union', 'assert', 'virtual', 'unsigned', 'char', 'long', 'double'
  ];
  
  export const symbols: string[] = [
    '(', ')', '{', '}', ';', '+', '-', '*', '/', '=', '<', '>', '<=', '>=', '==', '!=', '&&', '||', '#', 
    ':', '~', '\'', '"', '.', '->', '[', ']', ',',
  ];
  
  export function isKeyword(word: string): boolean {
    return keywords.indexOf(word) !== -1;
  }
  
  export function isSymbol(char: string): boolean {
    return symbols.indexOf(char) !== -1;
  }
  
  export function isDigit(char: string): boolean {
    return !isNaN(parseInt(char));
  }
  
  export function isStringLiteral(literal: string): boolean {
    return literal[0] === '"' && literal[literal.length - 1] === '"';
  }
  
  function lexeme(token: string, type: string): { token: string, type: string } {
    return { token, type };
  }
  
  export function getSourceFromLexemes(lexemes: { token: string, type: string }[]): string {
    let source = '';
    for (const lexeme of lexemes) {
      source += lexeme.token;
    }
    return source;
  }
  
  export function getKeywordsFromLexemes(lexemes: { token: string, type: string }[]): string[] {
    const keywordSet = new Set<string>();
    for (const lexeme of lexemes) {
      if (lexeme.type === 'keyword') keywordSet.add(lexeme.token);
    }
    return Array.from(keywordSet);
  }
  
  export function isGapCharacter(char: string): boolean {
    const gapCharacters = [' ', '\t', '\r'];
    const code = char.charCodeAt(0);
  
    if (code === 160) { // No breaking space (&nbsp;) char code
      return true;
    } else if (gapCharacters.includes(char)) {
      return true;
    } else {
      return false;
    }
  }
  
  export function lexer(input: string): { token: string, type: string }[] {
    let currentToken = '';
    const lexemes: { token: string, type: string }[] = [];
    const lines = input.split('\n');
  
    for (const line of lines) {
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (isSymbol(char)) {
          if (currentToken !== '') lexemes.push(lexeme(currentToken, 'keyword'));
          lexemes.push(lexeme(char, 'symbol'));
          currentToken = '';
        } else if (isGapCharacter(char)) {
          if (currentToken !== '') lexemes.push(lexeme(currentToken, 'keyword'));
          lexemes.push(lexeme(char, 'space'));
          currentToken = '';
        } else {
          currentToken += char;
        }
      }
      if (currentToken !== '') lexemes.push(lexeme(currentToken, 'keyword'));
      currentToken = '';
      lexemes.push(lexeme('\n', 'newline'));
    }
  
    return lexemes;
  }
  