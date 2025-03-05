export function isKeyword(word: any): boolean;
export function isSymbol(char: any): boolean;
export function isDigit(char: any): boolean;
export function isStringLiteral(literal: any): boolean;
export function getSourceFromLexemes(lexemes: any): string;
export function getKeywordsFromLexemes(lexemes: any): any[];
export function isGapCharacter(char: any): boolean;
export function lexer(input: any): {
    token: any;
    type: any;
}[];
export const keywords: string[];
export const symbols: string[];
//# sourceMappingURL=Lexer.d.ts.map