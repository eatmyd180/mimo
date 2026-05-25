import createFunc from './_create-function.js';
import isFunctionStr from './is/string/function.js';
import isArrowFunctionStr from './is/string/arrow-function.js';
import isIdentifier from './is/string/identifier.js';
import isString from './is/type/string.js';
import isArray from './is/type/array.js';

/*
 * Usage:
 *   var fn = newFunction('yourFuncName', ['arg1', 'arg2'], 'return log(arg1+arg2);', {log:console.log});
 *
 *   newFunction('function abc(){}');
 *   newFunction('function abc(){}', {log:console.log})
 *   newFunction('function abc(){}', ['log'], [console.log])
 *
 *   // Expression support:
 *   newFunction('a + b', {a:1, b:2})
 *   newFunction('a + b', 'add', {a:1, b:2})
 *
 * fn.toString() is :
 * "function yourFuncName(arg1, arg2) {
 *    return log(arg1+arg2);
 *  }"
 */

function _parseExpression(expression, name, scope, values) {
  if (isString(name) && isIdentifier(name, { allowAsync: true })) {
    // newFunction(expression, name, scope, values)
  } else {
    // newFunction(expression, scope, values)
    values = scope;
    scope = name;
    name = 'anonymous';
  }
  let async = '';
  if (expression.includes('await') || expression.trim().startsWith('async ')) {
    async = 'async ';
    if (expression.trim().startsWith('async ')) {
      expression = expression.trim().substring(6);
    }
  }
  const body = expression.includes('return ') ? expression : `return ${expression}`;
  const funcStr = `${async}function ${name}(){${body}}`;
  return createFunc(funcStr, scope, values);
}

/**
 * Creates a new function with the given name, arguments, body, scope and values.
 *
 * * If the first argument is an **expression** (not a valid identifier and not a full function string):
 *   `newFunction(expression, [name], [scope], [values])`
 *   - The expression is automatically wrapped in a function and prefixed with `return` if needed.
 *   - If the second argument is a valid identifier, it's used as the function name.
 *
 * * If only one argument is provided and it is a **function string**, returns a new function with the same code.
 * * If only one argument is provided and it is an **identifier**, returns a new empty function with that name.
 * * If multiple arguments are provided in the traditional way:
 *   `newFunction(name, aArgs, body, [scope], [values])`
 *
 * @param {string|Function} name The name of the function, the function itself, or an expression.
 * @param {string[]|string|object} [aArgs] An array of argument names, or the function name (if first arg is expression), or scope.
 * @param {string|object} [body] The body of the function, or scope (if first arg is expression).
 * @param {object|any[]} [scope] The scope for the function, or values (if first arg is expression).
 * @param {any[]} [values] The values to apply to the scope.
 * @returns {Function} A new function with the given name, arguments, body, scope and values.
 * @example
 * // Expression support (New!)
 * var add = newFunction('a + b', {a: 1, b: 2});
 * add(); // 3
 * var namedAdd = newFunction('a + b', 'add', {a: 1, b: 2});
 * namedAdd.name; // 'add'
 * var asyncAdd = newFunction('await Promise.resolve(a + b)', {a: 1, b: 2});
 *
 * // Traditional usage
 * var add1 = newFunction(`function add(a,b) {return a+b}`);
 * var add = newFunction('add', ['a', 'b'], 'return a + b;');
 * var result = add(1, 2); // result is 3
 * var greet = newFunction('greet', ['name'], 'console.log("Hello, " + name + "!");');
 * greet('John'); // Output: Hello, John!
 * const sleep = newFunction('sleep', ['ms'], 'return new Promise(resolve => setTimeout(resolve, ms));');
 * const wait1Second = newFunction('async wait1Second', [], `await sleep(1000);`, {sleep});
 * await wait1Second()
 */
export function newFunction(name, aArgs, body, scope, values) {
  if (typeof name === 'function') {
    name = name.toString()
  }
  const asyncMatch = name.match(/^(async\s+)(.*)$/);
  if (isString(name) && !isFunctionStr(name) && !isArrowFunctionStr(name) && !isString(body)) {
    const expression = name;
    let exprName = aArgs;
    let exprScope = body;
    let exprValues = scope;
    if (!(isString(exprName) && isIdentifier(exprName, { allowAsync: true }))) {
      exprValues = exprScope;
      exprScope = exprName;
      exprName = 'anonymous';
    }

    const exprIsIdentifier = isIdentifier(expression, { allowAsync: true });
    let maybeIdentifierExpr = exprScope && exprIsIdentifier;
    if (maybeIdentifierExpr) {
      const identifier = asyncMatch ? asyncMatch[2] : expression;
      maybeIdentifierExpr = isArray(exprScope) ? exprScope.indexOf(identifier) >= 0 : exprScope.hasOwnProperty(identifier);
    }

    if (maybeIdentifierExpr || !exprIsIdentifier)
      return _parseExpression(expression, exprName, exprScope, exprValues);
  }

  if (arguments.length === 1) {
    if (isFunctionStr(name) || isArrowFunctionStr(name)) {
      return createFunc(name);
    }
    let async = ''
    if (asyncMatch) {
      async = 'async ';
      name = asyncMatch[2];
    }
    name = `${async}function ${name}(){}`;
    return createFunc(name);
  }
  if (isFunctionStr(name) || isArrowFunctionStr(name)) {
    scope = aArgs;
    values = body;
  } else {
    if (isString(aArgs)) {
      values = scope;
      scope = body;
      body = aArgs;
      aArgs = [];
    } else if (aArgs == null) {
      aArgs = [];
    }
    let async = ''
    const asyncMatch = name.match(/^(async\s+)(.*)$/);
    if (asyncMatch) {
      async = 'async ';
      name = asyncMatch[2];
    }
    name = `${async}function ${name}(${aArgs.join(', ')}) {\n${body}\n}`;
  }
  return createFunc(name, scope, values);
};

// Function(scope, 'return ' + name + ';').apply null, values
export default newFunction;
