'use strict';

const assert = require('assert');
const parser = require('../../lib/parser');
const rules = require('../../lib/rules');

const LOWERCASE_MSG_NOTAG = `\
implement a feature
`;

const UPPERCASE_MSG_NOTAG = `\
Implement a feature
`;

const LOWERCASE_MSG_TAG = `\
subsystem: implement a feature
`;

const UPPERCASE_MSG_TAG = `\
subsystem: Implement a feature
`;

const LOWERCASE_MSG_UPPERCASE_TAG = `\
Subsystem: implement a feature
`;

const UPPERCASE_MSG_UPPERCASE_TAG = `\
Subsystem: Implement a feature
`;

exports.testLowercaseMsgNoTag = () => {
  const errors = rules.lintCase(parser.parse(LOWERCASE_MSG_NOTAG));
  assert.strictEqual(errors.length, 1);
};

exports.testUppercaseMsgNoTag = () => {
  const errors = rules.lintCase(parser.parse(UPPERCASE_MSG_NOTAG));
  assert.strictEqual(errors.length, 0);
};

exports.testLowercaseMsgTag = () => {
  const errors = rules.lintCase(parser.parse(LOWERCASE_MSG_TAG));
  assert.strictEqual(errors.length, 0);
};

exports.testUppercaseMsgTag = () => {
  const errors = rules.lintCase(parser.parse(UPPERCASE_MSG_TAG));
  assert.strictEqual(errors.length, 1);
};

exports.testLowercaseMsgUppercaseTag = () => {
  const errors = rules.lintCase(parser.parse(LOWERCASE_MSG_UPPERCASE_TAG));
  assert.strictEqual(errors.length, 1);
};

exports.testUppercaseMsgUppercaseTag = () => {
  const errors = rules.lintCase(parser.parse(UPPERCASE_MSG_UPPERCASE_TAG));
  assert.strictEqual(errors.length, 2);
};
