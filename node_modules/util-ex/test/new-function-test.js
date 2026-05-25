import sinonChai from "sinon-chai";
import sinon from "sinon";
import chai from "chai";
var assert = chai.assert;
var should = chai.should();
chai.use(sinonChai);

import createFunction from '../src/new-function.js';

describe("newFunction", function () {
  it("should create a function via string", function () {
    var fn;
    fn = createFunction("function  myFn(){}");
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(0);
  });
  it("should create a function via string with args", function () {
    var fn;
    fn = createFunction("function myFn (arg1, arg2, arg3) \n {}\n");
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(3);
  });
  it("should create a function via string with args and body new line", function () {
    var fn;
    fn = createFunction("function myFn (arg1, arg2, arg3) \n {\nreturn a\n}\n");
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(3);
  });
  it("should create a function via string with specified scope", function () {
    var b, fn;
    b = 123;
    fn = createFunction("function myFn(arg1, arg2) {return arg1+arg2+b}", {
      b: b
    });
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(2);
    fn(10, 2).should.be.equal(135);
  });
  it("should create a function via string with specified scope value array", function () {
    var b, fn;
    b = 123;
    fn = createFunction("function myFn(arg1, arg2) {return arg1+arg2+b}", ['b'], [b]);
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(2);
    fn(10, 2).should.be.equal(135);
  });
  it("should create an empty named function", function () {
    var fn;
    fn = createFunction("myFn");
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(0);
  });
  it("should create an empty named function with args", function () {
    var fn;
    fn = createFunction("myFn", ['arg1', 'arg2']);
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(2);
  });
  it("should create a function", function () {
    var fn;
    fn = createFunction("myFn", ['arg1', 'arg2'], "return arg1+arg2");
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(2);
    fn(10, 2).should.be.equal(12);
  });
  it("should create a function without args", function () {
    var fn;
    fn = createFunction("myFn", "return 'hello!'");
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(0);
    fn().should.be.equal("hello!");
  });
  it("should create a function with specified scope", function () {
    var b, fn;
    b = 123;
    fn = createFunction("myFn", ['arg1', 'arg2'], "return arg1+arg2+b", {
      b: b
    });
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(2);
    fn(10, 2).should.be.equal(135);
  });
  it("should create a function with specified scope value array", function () {
    var b, fn;
    b = 123;
    fn = createFunction("myFn", ['arg1', 'arg2'], "return arg1+arg2+b", ['b'], [b]);
    should.exist(fn, "fn");
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(2);
    fn(10, 2).should.be.equal(135);
  });
  it("should create an async function via string with args and body new line", function () {
    var fn;
    fn = createFunction("async function myFn (arg1, arg2, arg3) \n {\nreturn a\n}\n");
    should.exist(fn, "fn");
    assert.isFunction(fn);
    assert.isTrue(fn.constructor.name === 'AsyncFunction');
    fn.should.have.property('name', 'myFn');
    fn.should.have.length(3);
  });

  it("should create an async function via name", function () {
    var fn;
    fn = createFunction("async sleep", ['ms'], "return new Promise(resolve => setTimeout(resolve, ms))");
    should.exist(fn, "fn");
    assert.isFunction(fn);
    assert.isTrue(fn.constructor.name === 'AsyncFunction');
    fn.should.have.property('name', 'sleep');
    fn.should.have.length(1);
    fn = createFunction("async empty");
    should.exist(fn, "fn");
    assert.isFunction(fn);
    assert.isTrue(fn.constructor.name === 'AsyncFunction');
    fn.should.have.property('name', 'empty');
    fn.should.have.length(0);
  });

  it("should remain flexible for normal functions bind this via scope", function () {
    const context = { x: 42 };
    let fn = createFunction("function getX() { return this.x }", { this: context });
    fn().should.equal(42);

    fn = createFunction("function getX() { return this.x }");
    // Explicit apply should work
    const otherContext = { x: 100 };
    fn.apply(otherContext).should.equal(100);
  });

  describe("when name is a Function object", function () {
    it("should convert function object to string and create function", function () {
      const originalFn = function add(a, b) { return a + b; };
      const fn = createFunction(originalFn);
      should.exist(fn);
      fn.should.have.length(2);
      fn(1, 2).should.equal(3);
    });

    it("should convert arrow function object to string and create function", function () {
      const originalFn = (a, b) => a * b;
      const fn = createFunction(originalFn);
      should.exist(fn);
      fn.should.have.length(2);
      fn(3, 4).should.equal(12);
    });

    it("should create named function from function object with scope", function () {
      const originalFn = function multiply(a, b) { return a * b * factor; };
      const factor = 10;
      const fn = createFunction(originalFn, { factor: factor });
      should.exist(fn);
      fn.should.have.length(2);
      fn(2, 3).should.equal(60);
    });

    it("should create function from arrow function with scope", function () {
      const originalFn = (a, b) => a + b + extra;
      const extra = 100;
      const fn = createFunction(originalFn, { extra: extra });
      should.exist(fn);
      fn.should.have.length(2);
      fn(1, 2).should.equal(103);
    });

    it("should support function object with this binding", function () {
      const obj = {
        value: 42,
        getValue: function() { return this.value; }
      };
      const fn = createFunction(obj.getValue, { this: obj });
      fn().should.equal(42);
    });

    it("should support function object with args and scope", function () {
      const originalFn = function greet(name, suffix) {
        return `Hello, ${name}! ${greeting}${suffix}`;
      };
      const scope = {
        greeting: 'Welcome'
      };
      const fn = createFunction(originalFn, ['greeting'], [scope.greeting]);
      should.exist(fn);
      fn('World', '.').should.equal('Hello, World! Welcome.');
    });

    it("should handle async function object", function () {
      const originalFn = async function fetchData(id) {
        return Promise.resolve(id * 2);
      };
      const fn = createFunction(originalFn);
      should.exist(fn);
      assert.isFunction(fn);
      assert.isTrue(fn.constructor.name === 'AsyncFunction');
    });
  });
});
