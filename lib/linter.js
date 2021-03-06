'use strict';

const parser = require('./parser');
const rules = require('./rules');

const linter = {};
module.exports = linter;

// Lints a commit message represented as a string
//
linter.lint = (messageText) => {
  const message = parser.parse(messageText);
  const errors = []
    .concat(rules.lintLineLength(message))
    .concat(rules.lintVerb(message))
    .concat(rules.lintCase(message))
    .concat(rules.lintWhitespace(message))
    .concat(rules.lintNoTrailingPeriod(message));
  return errors;
};
