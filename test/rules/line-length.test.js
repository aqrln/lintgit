'use strict';

const assert = require('assert');
const parser = require('../../lib/parser');
const rules = require('../../lib/rules');

const PR_MERGE_COMMIT = '\
Merge pull-request #42 from github.com:example/ExampleRepo\
';

const REVERT_COMMIT = '\
Revert "lib: add some feature that turned out to be bug-prone"\
';

const OK_COMMIT = `\
core: add some feature

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sem orci,
volutpat viverra eleifend eu, maximus ut tellus. Pellentesque sit amet
consequat nisl. Mauris dictum posuere nibh, fringilla interdum mi
rhoncus id.
`;

const LONG_SUMMARY_COMMIT = `\
core: add some feature and start to explain it there instead of below

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sem orci,
volutpat viverra eleifend eu, maximus ut tellus. Pellentesque sit amet
consequat nisl. Mauris dictum posuere nibh, fringilla interdum mi
rhoncus id.
`;

const LONG_BODY_COMMIT = `\
core: add some feature

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sem orci,
volutpat viverra eleifend eu, maximus ut tellus. Pellentesque sit amet consequat
nisl. Mauris dictum posuere nibh, fringilla interdum mi rhoncus id.
`;

const LONG_SUMMARY_AND_BODY_COMMIT = `\
core: add some feature and start to explain it there instead of below

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sem orci,
volutpat viverra eleifend eu, maximus ut tellus. Pellentesque sit amet consequat
nisl. Mauris dictum posuere nibh, fringilla interdum mi rhoncus id.
`;

const MISSING_BLANK_LINE_COMMIT = `\
core: add some feature
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sem orci,
volutpat viverra eleifend eu, maximus ut tellus.
`;

exports.testMergeCommit = () => {
  const errors = rules.lintLineLength(parser.parse(PR_MERGE_COMMIT));
  assert.strictEqual(errors.length, 0);
};

exports.testRevertCommit = () => {
  const errors = rules.lintLineLength(parser.parse(REVERT_COMMIT));
  assert.strictEqual(errors.length, 0);
};

exports.testGoodCommit = () => {
  const errors = rules.lintLineLength(parser.parse(OK_COMMIT));
  assert.strictEqual(errors.length, 0);
};

exports.testLongSummaryCommit = () => {
  const errors = rules.lintLineLength(parser.parse(LONG_SUMMARY_COMMIT));
  assert.strictEqual(errors.length, 1);
};

exports.testLongBodyCommit = () => {
  const errors = rules.lintLineLength(parser.parse(LONG_BODY_COMMIT));
  assert.strictEqual(errors.length, 1);
};

exports.testLongSummaryAndBodyCommit = () => {
  const errors = rules.lintLineLength(
    parser.parse(LONG_SUMMARY_AND_BODY_COMMIT));
  assert.strictEqual(errors.length, 2);
};

exports.testMissingBlankLineCommit = () => {
  const errors = rules.lintLineLength(parser.parse(MISSING_BLANK_LINE_COMMIT));
  assert.strictEqual(errors.length, 1);
};
