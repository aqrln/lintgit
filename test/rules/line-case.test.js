'use strict';

const assert = require('assert');
const parser = require('../../lib/parser');
const rules = require('../../lib/rules');

exports.testLowercaseMsgNoTag = () => {
  const message = parser.parse('implement a feature');
  const errors = rules.lintCase(message);
  assert.strictEqual(errors.length, 1);
};

exports.testUppercaseMsgNoTag = () => {
  const message = parser.parse('Implement a feature');
  const errors = rules.lintCase(message);
  assert.strictEqual(errors.length, 0);
};

exports.testLowercaseMsgTag = () => {
  const message = parser.parse('subsystem: implement a feature');
  const errors = rules.lintCase(message);
  assert.strictEqual(errors.length, 0);
};

exports.testUppercaseMsgTag = () => {
  const message = parser.parse('subsystem: Implement a feature');
  const errors = rules.lintCase(message);
  assert.strictEqual(errors.length, 1);
};

exports.testLowercaseMsgUppercaseTag = () => {
  const message = parser.parse('Subsystem: implement a feature');
  const errors = rules.lintCase(message);
  assert.strictEqual(errors.length, 1);
};

exports.testUppercaseMsgUppercaseTag = () => {
  const message = parser.parse('Subsystem: Implement a feature');
  const errors = rules.lintCase(message);
  assert.strictEqual(errors.length, 2);
};
