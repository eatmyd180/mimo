import chai from "chai";
var should = chai.should();

import { isIdentifier } from '../src/is/string/identifier.js';

describe("isIdentifier", function () {
  it("should return true for valid identifiers", function () {
    isIdentifier("foo").should.be.true;
    isIdentifier("_bar").should.be.true;
    isIdentifier("$baz").should.be.true;
    isIdentifier("v123").should.be.true;
    isIdentifier("a_b_c").should.be.true;
  });

  it("should return true for identifiers with async prefix only if allowed", function () {
    isIdentifier("async foo", { allowAsync: true }).should.be.true;
    isIdentifier("async _bar", { allowAsync: true }).should.be.true;
    isIdentifier("async $", { allowAsync: true }).should.be.true;
    
    isIdentifier("async foo").should.be.false;
    isIdentifier("async _bar").should.be.false;
  });

  it("should return false for invalid identifiers", function () {
    isIdentifier("123foo").should.be.false;
    isIdentifier("foo-bar").should.be.false;
    isIdentifier("foo.bar").should.be.false;
    isIdentifier("a+b").should.be.false;
    isIdentifier("hello world").should.be.false;
    isIdentifier("async123").should.be.true; 
    isIdentifier("async  foo", { allowAsync: true }).should.be.true;
  });

  it("should return false for empty or whitespace strings", function () {
    isIdentifier("").should.be.false;
    isIdentifier("   ").should.be.false;
  });

  it("should return false for non-string inputs", function () {
    isIdentifier(null).should.be.false;
    isIdentifier(undefined).should.be.false;
    isIdentifier(123).should.be.false;
    isIdentifier({}).should.be.false;
  });
});
