'use strict';

const assert = require('assert');
const parser = require('../../lib/parser');
const rules = require('../../lib/rules');

exports.testTrailingPeriod = () => {
  const message = parser.parse('Implement a feature.');
  const errors = rules.lintNoTrailingPeriod(message);
  assert.strictEqual(errors.length, 1);
};

exports.testNoTrailingPeriod = () => {
  const message = parser.parse('Implement a feature');
  const errors = rules.lintNoTrailingPeriod(message);
  assert.strictEqual(errors.length, 0);
};
