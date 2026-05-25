/**
 * Determines if a string represents a valid JavaScript arrow function.
 * @param {string} aFuncString - The string to test.
 * @returns {boolean} - True if the string represents a valid arrow function, false otherwise.
 * @example
 * isArrowFunctionStr('(x, y) => x + y') // true
 * isArrowFunctionStr('async x => { return x; }') // true
 * isArrowFunctionStr('function(x) { return x; }') // false
 */
export function isArrowFunctionStr(aFuncString) {
  // Matches:
  // (a, b) => ...
  // a => ...
  // async (a) => ...
  // async a => ...
  const result = /^[;\s]*(async\s+)?(\([^)]*\)|[a-zA-Z_$][0-9a-zA-Z_$]*)\s*=>\s*[^;\s].*$/s.test(aFuncString);
  return result;
};
export default isArrowFunctionStr;
