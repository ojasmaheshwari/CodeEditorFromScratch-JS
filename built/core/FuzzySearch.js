export function getEditDistance(word_1, word_2) {
    const cache = [];
    for (let i = 0; i < word_1.length + 1; i++) {
        const row = [];
        for (let j = 0; j < word_2.length + 1; j++) {
            row.push(Infinity);
        }
        cache.push(row);
    }
    for (let i = 0; i < word_2.length + 1; i++) {
        cache[word_1.length][i] = word_2.length - i;
    }
    for (let i = 0; i < word_1.length + 1; i++) {
        cache[i][word_2.length] = word_1.length - i;
    }
    for (let i = word_1.length - 1; i >= 0; i--) {
        for (let j = word_2.length - 1; j >= 0; j--) {
            if (word_1[i] == word_2[j]) {
                cache[i][j] = cache[i + 1][j + 1];
            }
            else {
                cache[i][j] = Math.min(cache[i][j + 1], cache[i + 1][j], cache[i + 1][j + 1]) + 1;
            }
        }
    }
    return cache[0][0];
}
export function fuzzySearch(searchTerms, target) {
    const keywordScores = [];
    for (const searchTerm of searchTerms) {
        const score = getEditDistance(target, searchTerm);
        const scorePercent = (score / Math.max(searchTerm.length, target.length));
        keywordScores.push({ token: searchTerm, score: scorePercent });
    }
    function compare(scoreObject_1, scoreObject_2) {
        if (scoreObject_1.score < scoreObject_2.score) {
            return -1;
        }
        else {
            return 1;
        }
    }
    keywordScores.sort(compare);
    return keywordScores;
}
//# sourceMappingURL=FuzzySearch.js.map