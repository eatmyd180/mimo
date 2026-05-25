import chai from "chai";
var should = chai.should();

import newFunction from '../src/new-function.js';

describe("newFunction expression support", function () {
  it("should create a function from an expression", function () {
    const fn = newFunction("a + b");
    should.exist(fn);
    fn.name.should.equal('anonymous');
  });

  it("should create a function from an expression with scope", function () {
    const fn = newFunction("a + b", { a: 1, b: 2 });
    should.exist(fn);
    fn().should.equal(3);
  });

  it("should create a named function from an expression", function () {
    const fn = newFunction("a + b", "add", { a: 1, b: 2 });
    should.exist(fn);
    fn.name.should.equal('add');
    fn().should.equal(3);
  });

  it("should create an async function from an expression containing await", function () {
    const fn = newFunction("await Promise.resolve(a + b)", { a: 1, b: 2 });
    should.exist(fn);
    fn.constructor.name.should.equal('AsyncFunction');
    return fn().then(res => res.should.equal(3));
  });

  it("should create an async function from an expression starting with async", function () {
    const fn = newFunction("async a + b", { a: 5, b: 5 });
    should.exist(fn);
    fn.constructor.name.should.equal('AsyncFunction');
    return fn().then(res => res.should.equal(10));
  });

  it("should handle expression with explicit return", function () {
    const fn = newFunction("return a * b", { a: 3, b: 4 });
    fn().should.equal(12);
  });

  it("should handle dot notation as expression", function () {
    const fn = newFunction("obj.x + 1", { obj: { x: 10 } });
    fn().should.equal(11);
  });

  it("should support array-style scope and values with expression", function () {
    const fn = newFunction("x / y", ["x", "y"], [10, 2]);
    fn().should.equal(5);
  });

  it("should support named expression with array-style scope and values", function () {
    const fn = newFunction("x - y", "subtract", ["x", "y"], [10, 2]);
    fn.name.should.equal('subtract');
    fn().should.equal(8);
  });

  it("should work with calling functions from scope", function () {
    const fn = newFunction("abc(val)", { abc: function (v) { return v * 2 }, val: 5 });
    should.exist(fn);
    fn().should.equal(10);
  });

  it("should handle object literals in expressions (wrapped in parentheses)", function () {
    const fn = newFunction("({ x: a, y: b })", { a: 1, b: 2 });
    const res = fn();
    res.should.deep.equal({ x: 1, y: 2 });
  });

  it("should handle expressions with leading/trailing whitespace", function () {
    const fn = newFunction("  a + b  ", { a: 10, b: 20 });
    fn().should.equal(30);
  });

  it("should handle string literal expressions", function () {
    const fn = newFunction("'hello ' + name", { name: 'world' });
    fn().should.equal('hello world');
  });

  it("should handle multi-line code with explicit return", function () {
    const code = `
      const x = a * 2;
      const y = b * 3;
      return x + y;
    `;
    const fn = newFunction(code, { a: 1, b: 1 });
    fn().should.equal(5);
  });

  it("should treat a simple variable as expression if it contains return", function () {
    const fn = newFunction("return a", { a: 42 });
    fn().should.equal(42);
  });
  it("should treat a simple variable as expression if it contains return", function () {
    const fn = newFunction("a", { a: 42 });
    fn().should.equal(42);
  });
});
