'use strict';

const assert = require('assert');
const parser = require('../../lib/parser');
const rules = require('../../lib/rules');

exports.testNoTags = () => {
  const message = parser.parse('Implement a feature');
  const errors = rules.lintWhitespace(message);
  assert.strictEqual(errors.length, 0);
};

exports.testCorrectWhitespaceOneTag = () => {
  const message = parser.parse('lib: implement a feature');
  const errors = rules.lintWhitespace(message);
  assert.strictEqual(errors.length, 0);
};

exports.testCorrectWhitespaceManyTags = () => {
  const message = parser.parse('lib,test: refactor to ES6');
  const errors = rules.lintWhitespace(message);
  assert.strictEqual(errors.length, 0);
};

exports.testIncorrectColonOneTag = () => {
  const message = parser.parse('lib:implement a feature');
  const errors = rules.lintWhitespace(message);
  assert.strictEqual(errors.length, 1);
};

exports.testIncorrectColonManyTags = () => {
  const message = parser.parse('lib,test:refactor to ES6');
  const errors = rules.lintWhitespace(message);
  assert.strictEqual(errors.length, 1);
};

exports.testIncorrectComma = () => {
  const message = parser.parse('lib, test: refactor to ES6');
  const errors = rules.lintWhitespace(message);
  assert.strictEqual(errors.length, 1);
};

exports.testIncorrectCommaAndColon = () => {
  const message = parser.parse('lib, test:refactor to ES6');
  const errors = rules.lintWhitespace(message);
  assert.strictEqual(errors.length, 2);
};
