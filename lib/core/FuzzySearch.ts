export function getEditDistance(word_1: string, word_2: string): number {
    const cache: number[][] = [];
  
    for (let i = 0; i < word_1.length + 1; i++) {
      const row: number[] = [];
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
        if (word_1[i] === word_2[j]) {
          cache[i][j] = cache[i + 1][j + 1];
        } else {
          cache[i][j] = Math.min(cache[i][j + 1], cache[i + 1][j], cache[i + 1][j + 1]) + 1;
        }
      }
    }
  
    return cache[0][0];
  }
  
  interface KeywordScore {
    token: string;
    score: number;
  }
  
  export function fuzzySearch(searchTerms: string[], target: string): KeywordScore[] {
    const keywordScores: KeywordScore[] = [];
  
    for (const searchTerm of searchTerms) {
      const score = getEditDistance(target, searchTerm);
      const scorePercent = score / Math.max(searchTerm.length, target.length);
      keywordScores.push({ token: searchTerm, score: scorePercent });
    }
  
    function compare(scoreObject_1: KeywordScore, scoreObject_2: KeywordScore): number {
      if (scoreObject_1.score < scoreObject_2.score) {
        return -1;
      } else {
        return 1;
      }
    }
  
    keywordScores.sort(compare);
    return keywordScores;
  }
  