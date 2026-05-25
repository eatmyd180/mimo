import sinonChai from "sinon-chai";
import chai from "chai";
var assert = chai.assert;
var should = chai.should();
chai.use(sinonChai);

import isRegExpStr from '../src/is/string/regexp.js';

describe("is/string/regexp", function () {
  it("should return true for valid regexp strings", function () {
    isRegExpStr('/[a-z]/').should.be.true;
    isRegExpStr('/[a-z]/g').should.be.true;
    isRegExpStr('/[a-z]/gi').should.be.true;
    isRegExpStr('/a\/b/').should.be.true;
    isRegExpStr('/^abc$/m').should.be.true;
  });

  it("should return false for invalid regexp strings or non-regexp paths", function () {
    isRegExpStr('/tmp/file').should.be.false;
    isRegExpStr('/usr/bin/node').should.be.false;
    isRegExpStr('/test').should.be.false;
    isRegExpStr('//').should.be.false;
    isRegExpStr('function abs(/[a-z]/){}').should.be.false;
    isRegExpStr('/[a-z]/invalid').should.be.false;
  });

  it("should return false for non-string inputs", function () {
    isRegExpStr(null).should.be.false;
    isRegExpStr(undefined).should.be.false;
    isRegExpStr(123).should.be.false;
    isRegExpStr(/[a-z]/).should.be.false;
  });
});
