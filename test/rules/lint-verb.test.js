'use strict';

const assert = require('assert');
const parser = require('../../lib/parser');
const rules = require('../../lib/rules');

const RELEASE_COMMIT = `\
Version 1.0.0

* Bugs fixed
* Production ready
`;

const CORRECT_VERB_COMMIT_NOTAG = `\
Implement a feature
`;

const CORRECT_VERB_COMMIT_TAG = `\
subsystem: implement a feature
`;

const INCORRECT_VERB_COMMIT_NOTAG = `\
Implemented a feature
`;

const INCORRECT_VERB_COMMIT_TAG = `\
subsystem: implemented a feature
`;

const INCORRECT_POS_COMMIT_NOTAG = `\
Feature implemented
`;

const INCORRECT_POS_COMMIT_TAG = `\
subsystem: feature implemented
`;

exports.testReleaseCommit = () => {
  const errors = rules.lintVerb(parser.parse(RELEASE_COMMIT));
  assert.strictEqual(errors.length, 0);
};

exports.testCorrectVerbCommitNoTag = () => {
  const errors = rules.lintVerb(parser.parse(CORRECT_VERB_COMMIT_NOTAG));
  assert.strictEqual(errors.length, 0);
};

exports.testCorrectVerbCommitTag = () => {
  const errors = rules.lintVerb(parser.parse(CORRECT_VERB_COMMIT_TAG));
  assert.strictEqual(errors.length, 0);
};

exports.testIncorrectVerbCommitNoTag = () => {
  const errors = rules.lintVerb(parser.parse(INCORRECT_VERB_COMMIT_NOTAG));
  assert.strictEqual(errors.length, 1);
};

exports.testIncorrectVerbCommitTag = () => {
  const errors = rules.lintVerb(parser.parse(INCORRECT_VERB_COMMIT_TAG));
  assert.strictEqual(errors.length, 1);
};

exports.testIncorrectPosCommitNoTag = () => {
  const errors = rules.lintVerb(parser.parse(INCORRECT_POS_COMMIT_NOTAG));
  assert.strictEqual(errors.length, 1);
};

exports.testIncorrectPosCommitTag = () => {
  const errors = rules.lintVerb(parser.parse(INCORRECT_POS_COMMIT_TAG));
  assert.strictEqual(errors.length, 1);
};
