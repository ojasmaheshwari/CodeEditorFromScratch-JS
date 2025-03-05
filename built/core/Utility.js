export function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
// checks if the char is alpha-numeric
export function isAlphaNumeric(char) {
    if (char.length !== 1)
        return;
    const code = char.charCodeAt(0);
    return ((code >= 48 && code <= 57) ||
        (code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122));
}
;
//# sourceMappingURL=Utility.js.map