import objectToString from '../../object-to-string.js';
import isObject from './object.js';

const regexpClass = '[object RegExp]';
/**
 * Checks if the given value is a RegExp instance
 * This function specifically determines whether the provided value is an actual RegExp object instance,
 * not just any object that might resemble a regular expression
 * @param {*} v - The value to check
 * @returns {boolean} Returns true if v is a RegExp instance, false otherwise
 *
 * @example
 * // returns true
 * isRegExp(/abc/);
 *
 * @example
 * // returns true
 * isRegExp(new RegExp('abc'));
 *
 * @example
 * // returns false
 * isRegExp('abc');
 *
 * @example
 * // returns false
 * isRegExp({});
 *
 * @example
 * // returns false
 * isRegExp(null);
 */
export function isRegExp(v) {
  return isObject(v) && objectToString(v) === regexpClass;
};
export default isRegExp;
