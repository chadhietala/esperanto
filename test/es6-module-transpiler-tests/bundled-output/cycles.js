'use strict';

function geta() {
  return a;
}

var b = 2;

function getb() {
  return b;
}

var a = 1;

assert.equal(geta(), 1);
assert.equal(a, 1);
assert.equal(getb(), 2);
assert.equal(b, 2);