import chai from "chai";
var assert = chai.assert;
var should = chai.should();

import isArrowFunctionStr from '../src/is/string/arrow-function.js';

describe("is/string/arrow-function", function () {
  it("should test arrow function with parenthesis", function () {
    isArrowFunctionStr('(a, b) => a + b').should.be.true;
    isArrowFunctionStr('(a, b) => { return a + b; }').should.be.true;
    isArrowFunctionStr('() => 123').should.be.true;
  });

  it("should test arrow function without parenthesis", function () {
    isArrowFunctionStr('x => x * 2').should.be.true;
    isArrowFunctionStr('item => { console.log(item); }').should.be.true;
  });

  it("should test async arrow function", function () {
    isArrowFunctionStr('async (x) => x').should.be.true;
    isArrowFunctionStr('async x => x').should.be.true;
  });

  it("should test arrow function with spaces and semicolons", function () {
    isArrowFunctionStr('  (a) => a  ').should.be.true;
    isArrowFunctionStr('; (a) => a; ').should.be.true;
    isArrowFunctionStr('\n(a) => a\n').should.be.true;
  });

  it("should not match normal functions", function () {
    isArrowFunctionStr('function(a) {}').should.be.false;
    isArrowFunctionStr('function name(a) {}').should.be.false;
    isArrowFunctionStr('async function(a) {}').should.be.false;
  });

  it("should not match non-function strings", function () {
    isArrowFunctionStr('const x = 5;').should.be.false;
    isArrowFunctionStr('x => ').should.be.false; // Incomplete
    isArrowFunctionStr('=> x').should.be.false;
    isArrowFunctionStr('123').should.be.false;
  });
});
