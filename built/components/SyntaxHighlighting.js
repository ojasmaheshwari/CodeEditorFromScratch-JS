import { keywords } from "../core/Lexer.js";
import { getRecentKeywordRange } from "../editor/editor.js";
const ColorMapping = {
    keywords: "#569cd6",
    doubleQuotationStrings: "#ce9178",
    singleQuotationStrings: "#ce9178",
    comments: "gray",
    default: "white",
};
export function cleanEscapeSequences(code) {
    return String.raw `${code}`;
}
function coloredSpan(content, color) {
    return `<span style="color: ${color}">${content}</span>`;
}
function generateKeywordRegexRule() {
    const keywordsOr = keywords.join('|');
    return new RegExp(`\\b(${keywordsOr}|\\.\\w+)(?=[^\w])`, 'g');
}
const RegexRules = {
    keywords: generateKeywordRegexRule(),
    singleLineComments: new RegExp('(\/\/.*)', 'g'),
    multiLineComments: new RegExp(/(\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\/)/gm),
    doubleQuotationStrings: new RegExp('"(.*?)"', 'g'),
    singleQuotationStrings: new RegExp(/'(.*?)'/g)
};
export function highlight(element) {
    /*
    let range;
    try {
        range = getRecentKeywordRange();
    }
    catch (error) {
        console.error(error);
        return;
    }

    if (!range) return;

    const word = range.toString();
    for (const ruleName in RegexRules) {
        const rule = RegexRules[ruleName];
        if (rule.test(word)) {
            const color = ColorMapping[ruleName];

            // check if range is already surrounded by a <span>
            if (range.startContainer.parentElement.nodeName === "SPAN") {
                const surroundingSpan = range.startContainer.parentElement;
                surroundingSpan.style.color = color;
            } else {
                // Else create a new span and surround the range
                const spanElement = document.createElement("span");
                spanElement.style.color = color;
                range.surroundContents(spanElement);
            }
            return;
        }
    }

    // If no regex rule matches then:-
    // Check if the range had previously been styled using a span
    if (range.startContainer.parentElement.nodeName === "SPAN") {
        const surroundingSpan = range.startContainer.parentElement;
        surroundingSpan.style.color = ColorMapping.default;
    }
    */
    for (const node of element.children) {
        const nodeInnerText = cleanEscapeSequences(node.innerText);
        const replaceBy = nodeInnerText
            .replaceAll('<', '&lt')
            .replaceAll('>', '&gt')
            .replaceAll(' ', '&nbsp;')
            .replaceAll(RegexRules.doubleQuotationStrings, coloredSpan('"$1"', ColorMapping.doubleQuotationStrings))
            .replaceAll(RegexRules.singleQuotationStrings, coloredSpan('\'$1\'', ColorMapping.singleQuotationStrings))
            .replaceAll(RegexRules.singleLineComments, coloredSpan('<em>$1</em>', ColorMapping.comments))
            .replaceAll(RegexRules.keywords, coloredSpan('$1', ColorMapping.keywords));
        node.innerHTML = replaceBy.split('\n').join('<br/>');
    }
}
//# sourceMappingURL=SyntaxHighlighting.js.map