import { keywords } from "../core/Lexer.ts";

type ColorMappingType = {
  keywords: string;
  doubleQuotationStrings: string;
  singleQuotationStrings: string;
  comments: string;
  default: string;
};

const ColorMapping: ColorMappingType = {
  keywords: "#569cd6",
  doubleQuotationStrings: "#ce9178",
  singleQuotationStrings: "#ce9178",
  comments: "gray",
  default: "white",
};

export function cleanEscapeSequences(code: string): string {
  return String.raw`${code}`;
}

function coloredSpan(content: string, color: string): string {
  return `<span style="color: ${color}">${content}</span>`;
}

function generateKeywordRegexRule(): RegExp {
  const keywordsOr = keywords.join('|');
  return new RegExp(`\\b(${keywordsOr}|\\.\\w+)(?=[^\w])`, 'g');
}

const RegexRules = {
  keywords: generateKeywordRegexRule(),
  singleLineComments: new RegExp('(\/\/.*)', 'g'),
  multiLineComments: new RegExp(/(\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\/)/gm),
  doubleQuotationStrings: new RegExp('"(.*?)"', 'g'),
  singleQuotationStrings: new RegExp(/'(.*?)'/g),
};

export function highlight(element: HTMLElement): void {
  for (const node of Array.from(element.children)) {
    if (node.nodeName !== 'DIV' && node.nodeName !== 'BR') continue;

    const htmlNode = node as HTMLElement;
    const nodeInnerText = cleanEscapeSequences(htmlNode.innerText);

    const replaceBy = nodeInnerText
      .replaceAll('<', '&lt')
      .replaceAll('>', '&gt')
      .replaceAll(' ', '&nbsp;')
      .replaceAll(RegexRules.doubleQuotationStrings, (match: string, p1: string) =>
        coloredSpan(`"${p1}"`, ColorMapping.doubleQuotationStrings)
      )
      .replaceAll(RegexRules.singleQuotationStrings, (match: string, p1: string) =>
        coloredSpan(`'${p1}'`, ColorMapping.singleQuotationStrings)
      )
      .replaceAll(RegexRules.singleLineComments, (match: string) =>
        coloredSpan(`<em>${match}</em>`, ColorMapping.comments)
      )
      .replaceAll(RegexRules.keywords, (match: string) =>
        coloredSpan(match, ColorMapping.keywords)
      );

    // Replace text with colored spans and add line breaks
    node.innerHTML = replaceBy.split('\n').join('<br/>');
  }
}
