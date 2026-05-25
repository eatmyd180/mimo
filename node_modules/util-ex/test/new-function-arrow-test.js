import chai from "chai";
var should = chai.should();
var assert = chai.assert;

import newFunction from '../src/new-function.js';

describe("newFunction Arrow Functions", function () {
  it("should create an arrow function via string", function () {
    const fn = newFunction("(a, b) => a + b");
    should.exist(fn, "fn");
    fn(2, 3).should.equal(5);
  });

  it("should create an arrow function with implicit return", function () {
    const fn = newFunction("x => x * 2");
    should.exist(fn, "fn");
    fn(5).should.equal(10);
  });

  it("should create an async arrow function", function () {
    const fn = newFunction("async (x) => x");
    should.exist(fn, "fn");
    assert.isTrue(fn.constructor.name === 'AsyncFunction');
  });

  it("should create an arrow function with scope", function () {
    const fn = newFunction("(a) => a + b", { b: 10 });
    should.exist(fn, "fn");
    fn(5).should.equal(15);
  });

  it("should handle multiple arguments with arrow function string as first arg", function () {
    const fn = newFunction("() => log('hi')", { log: (v) => v });
    fn().should.equal('hi');
  });

  it("should still create normal function when using name/args/body", function () {
    const fn = newFunction("myArrow", ["a"], "return a + 1");
    fn.toString().should.contain("function myArrow(a)");
    fn(1).should.equal(2);
  });

  it("should support thisArg via scope.this for arrow functions", function () {
    const context = { x: 42 };
    const fn = newFunction("() => this.x", { this: context });
    should.exist(fn, "fn");
    fn().should.equal(42);
  });

  it("should support thisArg for async arrow functions", async function () {
    const context = { x: 42 };
    const fn = newFunction("async () => this.x", { this: context });
    const result = await fn();
    result.should.equal(42);
  });
});
