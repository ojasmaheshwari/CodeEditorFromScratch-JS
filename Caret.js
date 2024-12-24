
export function getCaretPosition(element) {
	const range = window.getSelection().getRangeAt(0);
	const prefix = range.cloneRange();
	prefix.selectNodeContents(element);
	prefix.setEnd(range.endContainer, range.endOffset);
	return prefix.toString().length;
};

export const setCaret = (pos, parent) => {
	for (const node of parent.childNodes) {
		if (node.nodeType == Node.TEXT_NODE) {
			if (node.length >= pos) {
				const range = document.createRange();
				const sel = window.getSelection();
				range.setStart(node, pos);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);
				return -1;
			} else {
				pos = pos - node.length;
			}
		} else {
			pos = setCaret(pos, node);
			if (pos < 0) {
				return pos;
			}
		}
	}
	return pos;
};
