export const debounce = (func: (...args: any[]) => void, timeout: number = 300): (...args: any[]) => void => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }
  
  export function isAlphaNumeric(char: string): boolean | undefined {
    if (char.length !== 1) return;
  
    const code = char.charCodeAt(0);
    return (
      (code >= 48 && code <= 57) || // Numbers 0-9
      (code >= 65 && code <= 90) || // Uppercase A-Z
      (code >= 97 && code <= 122)   // Lowercase a-z
    );
  }
  