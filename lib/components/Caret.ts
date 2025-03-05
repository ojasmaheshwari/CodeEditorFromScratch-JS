export function getCaretPosition(element: HTMLElement): number {
    const sel = window.getSelection();
    const range = sel?.getRangeAt(0);
    if (!range) return 0;
  
    const prefix = range.cloneRange();
    prefix.selectNodeContents(element);
    prefix.setEnd(range.endContainer, range.endOffset);
    return prefix.toString().length;
  }
  
  export function getCaretPositionWithNewlines(element: HTMLElement): number {
    const sel = window.getSelection();
    const range = sel?.getRangeAt(0);
    if (!range) return 0;
  
    const prefix = range.cloneRange();
    prefix.selectNodeContents(element);
    prefix.setEnd(range.endContainer, range.endOffset);
    const fragment = prefix.cloneContents();
    return prefix.toString().length + fragment.children.length - 1;
  }
  
  export const setCaret = (pos: number, parent: Node): number => {
    for (const node of Array.from(parent.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        if ((node.textContent?.length ?? 0) >= pos) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.setStart(node, pos);
          range.collapse(true);
          sel?.removeAllRanges();
          sel?.addRange(range);
          return -1;
        } else {
          pos -= node.textContent?.length ?? 0;
        }
      } else {
        pos = setCaret(pos, node);
        if (pos < 0) {
          return pos;
        }
      }
    }
    return pos;
  }
  
  export function getCaretGlobalCoordinates(): { x: number, y: number } {
    const sel = window.getSelection();
    const range = sel?.getRangeAt(0);
    const rect = range?.getClientRects()[0];
    return rect ? { x: rect.left, y: rect.top } : { x: 0, y: 0 };
  }