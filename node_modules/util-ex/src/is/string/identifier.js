/**
 * Determines if a string is a valid JavaScript identifier.
 *
 * @param {string} str - The string to check.
 * @param {object} [options] - The options for checking.
 * @param {boolean} [options.allowAsync=false] - Whether to support 'async ' prefix.
 * @returns {boolean} - True if the string is a valid identifier, false otherwise.
 */
export function isIdentifier(str, options) {
  if (typeof str !== 'string') return false;
  const allowAsync = options && options.allowAsync;
  const regex = allowAsync 
    ? /^(async\s+)?([a-zA-Z_$][0-9a-zA-Z_$]*)$/
    : /^([a-zA-Z_$][0-9a-zA-Z_$]*)$/;
  return regex.test(str);
}

export default isIdentifier;
